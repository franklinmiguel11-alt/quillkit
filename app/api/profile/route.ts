import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { full_name, company, title, address, phone_number } = body

    const { error } = await supabase
        .from('users')
        .update({
            full_name,
            company,
            title,
            address,
            phone_number,
        })
        .eq('id', user.id)

    if (error) {
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
