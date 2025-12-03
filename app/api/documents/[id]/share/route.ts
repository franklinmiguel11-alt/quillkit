import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resend } from '@/lib/email/resend'
import { SignRequestEmail } from '@/lib/email/templates' // Reusing SignRequestEmail for now, or create a ShareEmail template

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient()
        const { email } = await request.json()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 1. Get document details
        const { data: document } = await supabase
            .from('documents')
            .select('*, users(full_name)')
            .eq('id', params.id)
            .single()

        if (!document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 })
        }

        // 2. Insert into document_shares
        const { error: shareError } = await supabase
            .from('document_shares')
            .insert({
                document_id: params.id,
                recipient_email: email,
                status: 'sent'
            })

        if (shareError) throw shareError

        // 3. Send email
        // For sharing, we might want a different email template, but for now let's use a generic link to the document
        const shareLink = `${process.env.NEXT_PUBLIC_APP_URL}/documents/${params.id}`

        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: `${document.users.full_name} shared a document with you`,
            html: `
        <p>Hello,</p>
        <p>${document.users.full_name} has shared the document <strong>${document.title}</strong> with you.</p>
        <p><a href="${shareLink}">Click here to view the document</a></p>
      `
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error sharing document:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
