import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient()

        // 1. Check ownership
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { data: document } = await supabase
            .from('documents')
            .select('*')
            .eq('id', params.id)
            .eq('user_id', user.id)
            .single()

        if (!document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 })
        }

        if (document.status === 'signed') {
            return NextResponse.json({ error: 'Cannot void signed document' }, { status: 400 })
        }

        // 2. Update status
        const { error } = await supabase
            .from('documents')
            .update({
                status: 'voided',
                audit_log: [...(document.audit_log || []), {
                    action: 'voided',
                    timestamp: new Date().toISOString(),
                    actor: user.email
                }]
            })
            .eq('id', params.id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error voiding document:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
