import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resend } from '@/lib/email/resend'
import { SignRequestEmail } from '@/lib/email/templates'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { recipientEmail, recipientName, message, useExistingRecipients } = await request.json()

    // 1. Get document
    const { data: document } = await supabase
      .from('documents')
      .select('*, users(full_name)')
      .eq('id', params.id)
      .single()

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // 2. Generate signing token (shared for now)
    const signingToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
    const signingLink = `${process.env.NEXT_PUBLIC_APP_URL}/sign/${signingToken}`

    // 3. Determine recipients
    let recipientsList = []
    if (useExistingRecipients && document.recipients && document.recipients.length > 0) {
      recipientsList = document.recipients
    } else {
      recipientsList = [{
        email: recipientEmail,
        name: recipientName,
        role: 'signer',
        status: 'sent',
        color: '#3B82F6'
      }]
    }

    // 4. Update document
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        signing_token: signingToken,
        recipients: recipientsList
      })
      .eq('id', params.id)

    if (updateError) throw updateError

    // 5. Send emails
    const emailPromises = recipientsList.map((recipient: any) => {
      if (!recipient.email) return Promise.resolve()

      return resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: recipient.email,
        subject: `${document.users.full_name} sent you a document to sign`,
        react: SignRequestEmail({
          senderName: document.users.full_name,
          documentTitle: document.title,
          signingLink,
          message
        }),
      })
    })

    await Promise.all(emailPromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending document:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
