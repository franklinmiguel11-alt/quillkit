import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Editor } from "@/components/editor/editor"

export default async function EditDocumentPage({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: document } = await supabase
        .from('documents')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!document) {
        notFound()
    }

    // Get signed URL for the PDF
    const { data, error: signedUrlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.original_pdf_url, 3600)

    const publicUrl = data?.signedUrl

    if (signedUrlError || !publicUrl) {
        console.error('Error creating signed URL:', signedUrlError)
    }


    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            <Editor document={document} pdfUrl={publicUrl || ''} />
        </div>
    )
}
