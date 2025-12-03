import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "@/components/profile/profile-form"

export default async function ProfilePage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
                    <p className="text-muted-foreground">
                        Manage your personal profile information.
                    </p>
                </div>
            </div>
            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                            Update your name and contact details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileForm
                            initialData={{
                                full_name: userData?.full_name || '',
                                email: user.email || '',
                                company: userData?.company || '',
                                title: userData?.title || '',
                                address: userData?.address || '',
                                phone_number: userData?.phone_number || '',
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
