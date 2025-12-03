import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

export async function POST(request: Request) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Generate a secure random key
    const apiKey = 'df_live_' + randomBytes(24).toString('hex')

    const { error } = await supabase
        .from('users')
        .update({ api_key: apiKey })
        .eq('id', user.id)

    if (error) {
        return NextResponse.json({ error: 'Failed to update key' }, { status: 500 })
    }

    return NextResponse.json({ apiKey })
}
