import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/link"
import { CreateTemplateWizard } from "@/components/templates/create-wizard"

export default async function NewTemplatePage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="flex-1 p-8 pt-6">
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Create Template</h2>
                <p className="text-muted-foreground">
                    Follow the steps to create a reusable template.
                </p>
            </div>
            <CreateTemplateWizard />
        </div>
    )
}
