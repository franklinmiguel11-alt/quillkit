import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { SendFromTemplateForm } from "@/components/templates/send-form"

export default async function UseTemplatePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: template } = await supabase
    .from('templates')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!template) {
    notFound()
  }

  return (
    <div className="flex-1 p-8 pt-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Use Template</h2>
          <p className="text-muted-foreground">
            Fill in recipient information for: <strong>{template.name}</strong>
          </p>
        </div>
        <SendFromTemplateForm template={template} />
      </div>
    </div>
  )
}
