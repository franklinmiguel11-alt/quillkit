import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, FileText } from "lucide-react"
import { TemplatesEmptyState } from "@/components/templates/empty-state"
import Link from "next/link"

export default async function TemplatesPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const { data: templates } = await supabase
        .from('templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const hasTemplates = templates && templates.length > 0

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Templates</h2>
                    <p className="text-muted-foreground">
                        Create and manage reusable document templates.
                    </p>
                </div>
                <Link href="/templates/new">
                    <Button className="bg-[#283718] hover:bg-[#4A6247]">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Template
                    </Button>
                </Link>
            </div>

            {hasTemplates ? (
                <>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search My Templates"
                                className="pl-10"
                            />
                        </div>
                        <Button variant="outline">Date</Button>
                        <Button variant="outline">Advanced search</Button>
                        <Button variant="ghost">Clear</Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {templates.map((template) => (
                            <div key={template.id} className="border rounded-lg p-4 hover:border-[#283718] transition-colors cursor-pointer">
                                <div className="aspect-[3/4] bg-slate-100 rounded mb-3 flex items-center justify-center">
                                    <FileText className="h-12 w-12 text-slate-400" />
                                </div>
                                <h3 className="font-semibold truncate">{template.name}</h3>
                                <p className="text-sm text-muted-foreground truncate">{template.description || 'No description'}</p>
                                <div className="flex gap-2 mt-3">
                                    <Link href={`/templates/${template.id}/use`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            Use Template
                                        </Button>
                                    </Link>
                                    <Link href={`/templates/${template.id}/edit`}>
                                        <Button variant="ghost" size="sm">
                                            Edit
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <TemplatesEmptyState />
            )}
        </div>
    )
}
