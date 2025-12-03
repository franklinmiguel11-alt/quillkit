import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: signatures } = await supabase
        .from('saved_signatures')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return NextResponse.json(signatures || [])
}

export async function POST(request: Request) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, type, signature_data } = body

    const { data, error } = await supabase
        .from('saved_signatures')
        .insert({
            user_id: user.id,
            name,
            type,
            signature_data,
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: 'Failed to save signature' }, { status: 500 })
    }

    return NextResponse.json(data)
}

export async function PUT(request: Request) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'Missing signature ID' }, { status: 400 })
    }

    const body = await request.json()
    const { name, type, signature_data } = body

    const { data, error } = await supabase
        .from('saved_signatures')
        .update({
            name,
            type,
            signature_data,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: 'Failed to update signature' }, { status: 500 })
    }

    return NextResponse.json(data)
}

export async function DELETE(request: Request) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'Missing signature ID' }, { status: 400 })
    }

    const { error } = await supabase
        .from('saved_signatures')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return NextResponse.json({ error: 'Failed to delete signature' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
