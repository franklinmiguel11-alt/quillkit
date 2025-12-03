import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SignatureManager } from "@/components/signatures/signature-manager"

export default async function SignaturesPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const { data: signatures } = await supabase
        .from('saved_signatures')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Signatures</h2>
                    <p className="text-muted-foreground">
                        Add or update your name and signature styles.
                    </p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Saved Signatures</CardTitle>
                    <CardDescription>
                        Manage your saved signatures for quick signing.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SignatureManager initialSignatures={signatures || []} />
                </CardContent>
            </Card>
        </div>
    )
}
