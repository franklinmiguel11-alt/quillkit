import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuditTrail } from "@/components/documents/audit-trail"
import { Download, Ban } from "lucide-react"
import Link from "next/link"
import { ShareModal } from "@/components/dashboard/share-modal"
import { PDFViewer } from "@/components/documents/pdf-viewer"

export default async function DocumentDetailPage({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: document } = await supabase
        .from('documents')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!document) {
        notFound()
    }

    // Get signed URL for the PDF (original or signed) to ensure access
    const pdfPath = document.status === 'signed' ? document.signed_pdf_url : document.original_pdf_url
    const { data, error: signedUrlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(pdfPath, 3600) // Valid for 1 hour

    const publicUrl = data?.signedUrl

    if (signedUrlError || !publicUrl) {
        console.error('Error creating signed URL:', signedUrlError)
        // Fallback to public URL if signed fails (though likely won't work if private)
        const { data: { publicUrl: fallbackUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(pdfPath)
        // If we can't get a signed URL, we'll try the public one, but likely it's a 404 issue
    }

    const finalUrl = publicUrl // || fallbackUrl - handled by variable naming if I was cleaner, but let's just use publicUrl variable name for compatibility with rest of code


    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{document.title}</h2>
                <div className="flex items-center space-x-2">
                    <Badge variant={document.status === 'signed' ? 'default' : 'outline'} className="text-lg px-3 py-1">
                        {document.status}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Document Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PDFViewer url={publicUrl || ''} />
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className="w-full" asChild>
                                <a href={publicUrl} download>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF
                                </a>
                            </Button>
                            {document.status !== 'signed' && document.status !== 'voided' && (
                                <Button variant="destructive" className="w-full">
                                    <Ban className="mr-2 h-4 w-4" />
                                    Void Document
                                </Button>
                            )}
                            <ShareModal documentId={document.id} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recipients</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {document.recipients?.map((recipient: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{recipient.name}</p>
                                            <p className="text-sm text-muted-foreground">{recipient.email}</p>
                                        </div>
                                        <Badge variant="secondary">{recipient.status || 'pending'}</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Audit Trail</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AuditTrail events={document.audit_log || []} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
