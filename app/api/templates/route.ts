import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: templates } = await supabase
        .from('templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return NextResponse.json(templates || [])
}

export async function POST(request: Request) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const recipientRoles = JSON.parse(formData.get('recipient_roles') as string || '[]')

        if (!file || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Upload PDF to storage
        const fileName = `${user.id}/${Date.now()}-${file.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, file)

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName)

        // Create template record
        const { data: template, error: dbError } = await supabase
            .from('templates')
            .insert({
                user_id: user.id,
                name,
                description,
                original_pdf_url: publicUrl,
                recipient_roles: recipientRoles,
                fields: []
            })
            .select()
            .single()

        if (dbError) {
            console.error('Database error:', dbError)
            return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
        }

        return NextResponse.json(template)
    } catch (error) {
        console.error('Template creation error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
