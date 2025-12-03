import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApiKeyManager } from "@/components/settings/api-key-manager"

export default async function SettingsPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const { data: userData } = await supabase
        .from('users')
        .select('api_key')
        .eq('id', user.id)
        .single()

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            </div>
            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Developer API</CardTitle>
                        <CardDescription>
                            Manage your API key to access the QuillKit API programmatically.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ApiKeyManager initialApiKey={userData?.api_key} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
