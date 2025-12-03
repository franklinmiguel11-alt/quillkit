import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', user.id)

    if (error) {
        console.error('Onboarding complete error:', error)
        return NextResponse.json({ error: 'Failed to update onboarding status' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
