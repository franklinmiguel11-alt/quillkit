"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Loader2 } from "lucide-react"
import { PDFDocument } from "pdf-lib"

export default function NewDocumentPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        throw new Error(`Storage error: ${uploadError.message}`)
      }

      // 2. Get public URL (or signed URL)
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      // 3. Create document record
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data: doc, error: dbError } = await supabase
        .from('documents')
        .insert({
          title: file.name,
          original_pdf_url: filePath, // Storing path, not full URL for security/portability
          user_id: user?.id,
          status: 'draft'
        })
        .select()
        .single()

      if (dbError) {
        console.error('Database error:', dbError)
        throw new Error(`Database error: ${dbError.message}`)
      }

      router.push(`/documents/${doc.id}/edit`)
    } catch (error: any) {
      console.error('Error uploading:', error)
      alert(error.message || 'Error uploading document')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Upload Document</h2>
      </div>

      <div className="max-w-3xl mx-auto mt-8">
        <Card className="border-dashed border-2 hover:border-[#283718] transition-colors cursor-pointer bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
            <div className="bg-[#F5F7F4] p-4 rounded-full mb-4">
              <Upload className="h-10 w-10 text-[#283718]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Upload your document</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Drag and drop your PDF here, or click to browse.
              </p>
            </div>

            <div className="w-full max-w-xs mx-auto mt-8">
              <div className="relative">
                <Input
                  id="pdf"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <Button variant="outline" className="w-full">
                  Select File
                </Button>
              </div>
            </div>

            {file && (
              <div className="flex items-center gap-2 text-sm text-[#283718] bg-[#F5F7F4] px-4 py-2 rounded-full mt-4 animate-in fade-in slide-in-from-bottom-2">
                <span className="font-medium">{file.name}</span>
                <span className="text-blue-400">|</span>
                <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            )}

            <div className="pt-8">
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                size="lg"
                className="min-w-[200px]"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Continue to Editor"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Supported file types: PDF up to 10MB
          </p>
        </div>
      </div>
    </div>
  )
}
