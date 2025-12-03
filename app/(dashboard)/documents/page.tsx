import { createClient } from "@/lib/supabase/server"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function DocumentsPage() {
    const supabase = createClient()
    const { data: documents } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/documents/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Document
                        </Button>
                    </Link>
                </div>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="draft">Drafts</TabsTrigger>
                    <TabsTrigger value="sent">Sent</TabsTrigger>
                    <TabsTrigger value="signed">Signed</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                    <DataTable columns={columns} data={documents || []} />
                </TabsContent>
                <TabsContent value="draft" className="space-y-4">
                    <DataTable columns={columns} data={documents?.filter(d => d.status === 'draft') || []} />
                </TabsContent>
                <TabsContent value="sent" className="space-y-4">
                    <DataTable columns={columns} data={documents?.filter(d => d.status === 'sent') || []} />
                </TabsContent>
                <TabsContent value="signed" className="space-y-4">
                    <DataTable columns={columns} data={documents?.filter(d => d.status === 'signed') || []} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
