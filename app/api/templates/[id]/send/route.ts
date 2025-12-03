import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { recipients } = await request.json()

        // Get template
        const { data: template } = await supabase
            .from('templates')
            .select('*')
            .eq('id', params.id)
            .eq('user_id', user.id)
            .single()

        if (!template) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 })
        }

        // Create recipients array from template roles
        const documentRecipients = template.recipient_roles.map((role: any) => ({
            name: recipients[role.role]?.name || '',
            email: recipients[role.role]?.email || '',
            role: role.role,
            status: 'pending',
            signing_token: crypto.randomUUID()
        }))

        // Create document from template
        const { data: document, error: docError } = await supabase
            .from('documents')
            .insert({
                user_id: user.id,
                name: template.name,
                original_pdf_url: template.original_pdf_url,
                current_pdf_url: template.original_pdf_url,
                status: 'pending',
                recipients: documentRecipients,
                fields: template.fields
            })
            .select()
            .single()

        if (docError) {
            console.error('Document creation error:', docError)
            return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
        }

        // Send emails to recipients
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

        for (const recipient of documentRecipients) {
            try {
                await resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL!,
                    to: recipient.email,
                    subject: `Please sign: ${template.name}`,
                    html: `
                        <p>Hi ${recipient.name},</p>
                        <p>You have been requested to sign a document: <strong>${template.name}</strong></p>
                        <p><a href="${appUrl}/sign/${document.id}?token=${recipient.signing_token}">Click here to review and sign</a></p>
                    `
                })
            } catch (emailError) {
                console.error('Email sending error:', emailError)
            }
        }

        return NextResponse.json(document)
    } catch (error) {
        console.error('Send from template error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
