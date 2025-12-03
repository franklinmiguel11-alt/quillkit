"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Loader2, Send } from "lucide-react"

export default function SendDocumentPage({ params }: { params: { id: string } }) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [document, setDocument] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Fetch document on load
  useEffect(() => {
    const fetchDocument = async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', params.id)
        .single()

      if (data) setDocument(data)
      setLoading(false)
    }
    fetchDocument()
  }, [params.id])

  const handleSend = async () => {
    setSending(true)
    try {
      const response = await fetch(`/api/documents/${params.id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: email,
          recipientName: name,
          message,
          useExistingRecipients: document?.recipients?.length > 0
        }),
      })

      if (!response.ok) throw new Error('Failed to send')

      router.push('/dashboard')
    } catch (error) {
      console.error('Error sending:', error)
      alert('Error sending document')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  const hasRecipients = document?.recipients && document.recipients.length > 0

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Send Document</h2>
      </div>

      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Recipient Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasRecipients ? (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border">
                <p className="text-sm font-medium mb-2">Sending to {document.recipients.length} recipient(s):</p>
                <ul className="space-y-2">
                  {document.recipients.map((r: any, i: number) => (
                    <li key={i} className="text-sm flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color || '#283718' }} />
                      <span className="font-medium">{r.name}</span>
                      <span className="text-muted-foreground">({r.email || 'No email provided'})</span>
                    </li>
                  ))}
                </ul>
                {document.recipients.some((r: any) => !r.email) && (
                  <div className="mt-4 p-2 bg-amber-50 text-amber-800 text-xs rounded border border-amber-200">
                    Warning: Some recipients are missing email addresses. They will not receive an email.
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Please sign this document..." />
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Recipient Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Recipient Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Please sign this document..." />
              </div>
            </>
          )}

          <Button onClick={handleSend} disabled={sending || (!hasRecipients && (!email || !name))} className="w-full">
            {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Send Document
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
