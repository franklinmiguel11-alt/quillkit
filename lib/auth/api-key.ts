import { createClient } from "@/lib/supabase/server"

export async function validateApiKey(request: Request) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }

    const apiKey = authHeader.split(' ')[1]
    const supabase = createClient()

    const { data: user } = await supabase
        .from('users')
        .select('id, email, plan_type')
        .eq('api_key', apiKey)
        .single()

    return user
}
