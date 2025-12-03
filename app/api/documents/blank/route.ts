import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PDFDocument } from 'pdf-lib'

export async function POST(request: Request) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 1. Create a blank PDF
        const pdfDoc = await PDFDocument.create()
        pdfDoc.addPage([600, 800]) // Standard letter size approx
        const pdfBytes = await pdfDoc.save()

        // 2. Upload to storage
        const fileName = `blank_${user.id}_${Date.now()}.pdf`
        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, pdfBytes, {
                contentType: 'application/pdf'
            })

        if (uploadError) throw uploadError

        // 3. Create document record
        const { data: document, error: dbError } = await supabase
            .from('documents')
            .insert({
                user_id: user.id,
                title: 'Untitled Document',
                original_pdf_url: fileName,
                status: 'draft',
                fields: [],
                recipients: []
            })
            .select()
            .single()

        if (dbError) throw dbError

        return NextResponse.json({ id: document.id })
    } catch (error) {
        console.error('Error creating blank document:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
