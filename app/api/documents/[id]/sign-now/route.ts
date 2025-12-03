import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { randomUUID } from 'crypto'


export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 1. Verify ownership
        const { data: document } = await supabase
            .from('documents')
            .select('id')
            .eq('id', params.id)
            .eq('user_id', user.id)
            .single()

        if (!document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 })
        }

        // 2. Generate token
        const token = randomUUID()

        // 3. Update document with token
        const { error: updateError } = await supabase
            .from('documents')
            .update({
                signing_token: token,
                status: 'sent', // Mark as sent so it's "active"
                sent_at: new Date().toISOString()
            })
            .eq('id', params.id)

        if (updateError) throw updateError

        return NextResponse.json({ token })
    } catch (error) {
        console.error('Error setting up self-signing:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
