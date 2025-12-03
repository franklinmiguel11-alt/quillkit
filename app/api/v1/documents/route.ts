import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateApiKey } from '@/lib/auth/api-key'
import { resend } from '@/lib/email/resend'
import { SignRequestEmail } from '@/lib/email/templates'
import { randomBytes } from 'crypto'

export async function POST(request: Request) {
    // 1. Validate API Key
    const user = await validateApiKey(request)
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized: Invalid API Key' }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const recipientsJson = formData.get('recipients') as string
        const fieldsJson = formData.get('fields') as string

        if (!file || !recipientsJson) {
            return NextResponse.json({ error: 'Missing required fields: file, recipients' }, { status: 400 })
        }

        const recipients = JSON.parse(recipientsJson)
        const fields = fieldsJson ? JSON.parse(fieldsJson) : []

        // 2. Upload PDF
        const supabase = createClient()
        const fileName = `${user.id}/${Date.now()}_${file.name}`

        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, file, {
                contentType: file.type,
                upsert: false
            })

        if (uploadError) throw uploadError

        // 3. Create Document Record
        const signingToken = randomBytes(32).toString('hex')

        // Add IDs to recipients if not present
        const recipientsWithIds = recipients.map((r: any) => ({
            ...r,
            id: r.id || randomBytes(8).toString('hex'),
            status: 'pending'
        }))

        const { data: document, error: dbError } = await supabase
            .from('documents')
            .insert({
                user_id: user.id,
                title: file.name,
                original_pdf_url: fileName,
                status: 'sent',
                recipients: recipientsWithIds,
                fields: fields,
                signing_token: signingToken,
                sent_at: new Date().toISOString()
            })
            .select()
            .single()

        if (dbError) throw dbError

        // 4. Send Emails
        for (const recipient of recipientsWithIds) {
            const signingLink = `${process.env.NEXT_PUBLIC_APP_URL}/sign/${document.id}?token=${signingToken}&email=${encodeURIComponent(recipient.email)}`

            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
                to: recipient.email,
                subject: `Sign ${document.title}`,
                react: SignRequestEmail({
                    senderName: 'QuillKit User', // Could fetch user's name
                    documentTitle: document.title,
                    signingLink: signingLink,
                }),
            })
        }

        // 5. Update Usage Stats (Optional but good practice)
        // await supabase.rpc('increment_api_usage', { user_id: user.id })

        return NextResponse.json({
            id: document.id,
            status: 'sent',
            recipients: recipientsWithIds
        })

    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
