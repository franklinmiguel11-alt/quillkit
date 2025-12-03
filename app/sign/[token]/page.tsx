import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { SigningInterface } from "@/components/signing/signing-interface"

export default async function SigningPage({ params }: { params: { token: string } }) {
    const supabase = createClient()

    // Fetch document by token (bypassing RLS with service role if needed, or using public policy)
    // Since we set up a policy for public access via token, we can query directly if we pass the token in headers or query
    // However, for simplicity in this MVP, we might need to use a service role client here or ensure the policy works.
    // The policy "Public can view documents via token" uses current_setting.
    // A simpler way for MVP is to just query with service role in this server component.

    const { data: document } = await supabase
        .from('documents')
        .select('*')
        .eq('signing_token', params.token)
        .single()

    if (!document) {
        notFound()
    }

    if (document.status === 'signed') {
        return <div>This document has already been signed.</div>
    }

    const { data, error: signedUrlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.original_pdf_url, 3600)

    const publicUrl = data?.signedUrl

    if (signedUrlError || !publicUrl) {
        console.error('Error creating signed URL:', signedUrlError)
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <SigningInterface document={document} pdfUrl={publicUrl || ''} token={params.token} />
        </div>
    )
}
