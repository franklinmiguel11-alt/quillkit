import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PDFDocument } from 'pdf-lib'
import { resend } from '@/lib/email/resend'
import { DocumentSignedEmail } from '@/lib/email/templates'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const body = await request.json()
    console.log('Received request body keys:', Object.keys(body))
    console.log('fieldValues keys:', body.fieldValues ? Object.keys(body.fieldValues) : 'undefined')

    const { token, fieldValues, signerInfo } = body

    // 1. Verify token and get document
    const { data: document } = await supabase
      .from('documents')
      .select('*, users(email, full_name)')
      .eq('id', params.id)
      .eq('signing_token', token)
      .single()

    if (!document) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // 2. Download original PDF
    const { data: pdfData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(document.original_pdf_url)

    if (downloadError) throw downloadError

    // 3. Embed all field values into PDF
    const pdfDoc = await PDFDocument.load(await pdfData.arrayBuffer())

    // Embed standard font for text fields
    const { StandardFonts } = await import('pdf-lib')
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

    // Process each field based on its type
    for (const field of document.fields) {
      try {
        const value = fieldValues[field.id]
        if (!value) continue // Skip if no value provided

        console.log(`Processing field ${field.id}, type: ${field.type}, value:`, value)
        const page = pdfDoc.getPage(field.page - 1)

        if (field.type === 'signature') {
          // Embed signature image
          console.log('Embedding signature image...')
          const signatureImage = await pdfDoc.embedPng(value)
          const { width, height } = signatureImage.scaleToFit(field.width, field.height)

          page.drawImage(signatureImage, {
            x: field.x,
            y: page.getHeight() - field.y - height,
            width,
            height,
          })
        } else if (field.type === 'text' || field.type === 'date') {
          // Draw text with embedded font
          console.log('Drawing text:', value)
          const textSize = 12
          const textWidth = helveticaFont.widthOfTextAtSize(String(value), textSize)

          page.drawText(String(value), {
            x: field.x + 5,
            y: page.getHeight() - field.y - field.height + 10,
            size: textSize,
            font: helveticaFont,
          })
        } else if (field.type === 'checkbox') {
          // Draw checkmark if checked
          if (value) {
            console.log('Drawing checkbox')
            page.drawText('✓', {
              x: field.x + 2,
              y: page.getHeight() - field.y - field.height + 5,
              size: 16,
              font: helveticaFont,
            })
          }
        }
      } catch (fieldError) {
        console.error(`Error processing field ${field.id}:`, fieldError)
        throw new Error(`Failed to process field ${field.id}: ${fieldError instanceof Error ? fieldError.message : 'Unknown error'}`)
      }
    }

    const signedPdfBytes = await pdfDoc.save()

    // 4. Upload signed PDF
    const signedFileName = `signed_${document.id}_${Date.now()}.pdf`
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(signedFileName, signedPdfBytes, {
        contentType: 'application/pdf'
      })

    if (uploadError) throw uploadError

    // 5. Update recipient status and document
    const updatedRecipients = document.recipients.map((r: any) => {
      if (r.email === signerInfo?.email) {
        return { ...r, status: 'signed', signedAt: new Date().toISOString() }
      }
      return r
    })

    const allSigned = updatedRecipients.every((r: any) => r.status === 'signed')
    const newStatus = allSigned ? 'signed' : 'sent'

    const { error: updateError } = await supabase
      .from('documents')
      .update({
        status: newStatus,
        signed_pdf_url: signedFileName,
        recipients: updatedRecipients
      })
      .eq('id', params.id)

    if (updateError) throw updateError

    // 6. Send email notification
    // Link to dashboard document view instead of direct file link for security
    const dashboardLink = `${process.env.NEXT_PUBLIC_APP_URL}/documents/${document.id}`

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: document.users.email,
      subject: 'Document Signed',
      react: DocumentSignedEmail({
        signerName: 'Signer', // In a real app, we'd capture the name
        documentTitle: document.title,
        downloadLink: dashboardLink,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error signing document:', error)

    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }

    return NextResponse.json({
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
