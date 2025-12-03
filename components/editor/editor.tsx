"use client"

import { useState, useRef } from "react"
import { Document as PDFDocument, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Loader2, Save, Send, Type, PenTool, Calendar, CheckSquare, Eye, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Field = {
  id: string
  type: 'signature' | 'text' | 'date' | 'checkbox'
  x: number
  y: number
  page: number
  width: number
  height: number
  recipient_id?: string
}

export function Editor({ document, pdfUrl }: { document: any, pdfUrl: string }) {
  const [numPages, setNumPages] = useState<number>(0)
  const [scale, setScale] = useState(1.0)
  const [fields, setFields] = useState<Field[]>(document.fields || [])
  const [recipients, setRecipients] = useState<any[]>(document.recipients || [])
  const [activeRecipientId, setActiveRecipientId] = useState<string | null>(null)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [signing, setSigning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleSignNow = async () => {
    setSigning(true)
    try {
      // 1. Save first
      await saveDocument()

      // 2. Generate token
      const response = await fetch(`/api/documents/${document.id}/sign-now`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to setup signing')

      const { token } = await response.json()

      // 3. Redirect to signing page
      router.push(`/sign/${token}`)
    } catch (error) {
      console.error('Error signing now:', error)
      setSigning(false)
    }
  }

  // Initialize active recipient if exists
  if (recipients.length > 0 && !activeRecipientId) {
    setActiveRecipientId(recipients[0].id)
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  const addRecipient = () => {
    const newRecipient = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Recipient ${recipients.length + 1}`,
      email: '',
      color: ['#EF4444', '#F59E0B', '#10B981', '#283718', '#6366F1', '#8B5CF6'][recipients.length % 6]
    }
    setRecipients([...recipients, newRecipient])
    setActiveRecipientId(newRecipient.id)
  }

  const handleDrop = (e: React.DragEvent, pageIndex: number) => {
    e.preventDefault()
    const type = e.dataTransfer.getData("type") as Field['type']
    const fieldId = e.dataTransfer.getData("fieldId")
    const offsetX = parseFloat(e.dataTransfer.getData("offsetX") || "0")
    const offsetY = parseFloat(e.dataTransfer.getData("offsetY") || "0")

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX - rect.left - offsetX
    const y = e.clientY - rect.top - offsetY

    if (fieldId) {
      // Moving existing field
      setFields(fields.map(f => {
        if (f.id === fieldId) {
          return { ...f, x, y, page: pageIndex + 1 }
        }
        return f
      }))
      setSelectedFieldId(fieldId)
    } else if (type) {
      // Adding new field
      const newField: Field = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        x,
        y,
        page: pageIndex + 1,
        width: type === 'checkbox' ? 20 : 150,
        height: type === 'checkbox' ? 20 : 40,
        recipient_id: activeRecipientId || undefined
      }
      setFields([...fields, newField])
      setSelectedFieldId(newField.id)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const saveDocument = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('documents')
        .update({ fields, recipients })
        .eq('id', document.id)

      if (error) throw error
      // Show toast success
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setSaving(false)
    }
  }

  const getRecipientColor = (recipientId?: string) => {
    const recipient = recipients.find(r => r.id === recipientId)
    return recipient ? recipient.color : '#283718' // Default green
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* LEFT PANEL: Recipients & Fields */}
      <div className="w-72 border-r bg-white flex flex-col h-full shadow-sm z-10">

        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-white">
          <h2 className="font-bold text-lg text-slate-800">Fields</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          {/* Recipients Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recipients</h3>
              <Button variant="ghost" size="sm" onClick={addRecipient} className="h-6 w-6 p-0 hover:bg-[#F5F7F4] hover:text-[#283718]">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {recipients.map(recipient => (
                <div
                  key={recipient.id}
                  className={`p-3 rounded-lg border transition-all ${activeRecipientId === recipient.id ? 'border-[#283718] bg-[#F5F7F4] shadow-sm' : 'border-slate-200 hover:border-[#7A9B76] hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0`} style={{ backgroundColor: recipient.color }}>
                      {recipient.name.charAt(0)}
                    </div>
                    <Input
                      value={recipient.name}
                      onChange={(e) => {
                        const updated = recipients.map(r =>
                          r.id === recipient.id ? { ...r, name: e.target.value } : r
                        )
                        setRecipients(updated)
                      }}
                      className="h-7 text-sm font-medium"
                      placeholder="Recipient name"
                    />
                  </div>
                  <Input
                    value={recipient.email}
                    onChange={(e) => {
                      const updated = recipients.map(r =>
                        r.id === recipient.id ? { ...r, email: e.target.value } : r
                      )
                      setRecipients(updated)
                    }}
                    type="email"
                    className="h-7 text-xs"
                    placeholder="email@example.com"
                  />
                </div>
              ))}
              {recipients.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg bg-slate-50">
                  No recipients added
                </div>
              )}
            </div>
          </div>

          {/* Fields Toolbar */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Standard Fields</h3>
            <div className="grid grid-cols-1 gap-2">
              <DraggableField type="signature" icon={<PenTool className="w-4 h-4" />} label="Signature" />
              <DraggableField type="text" icon={<Type className="w-4 h-4" />} label="Text" />
              <DraggableField type="date" icon={<Calendar className="w-4 h-4" />} label="Date Signed" />
              <DraggableField type="checkbox" icon={<CheckSquare className="w-4 h-4" />} label="Checkbox" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-slate-50 space-y-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-[#283718]" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
              <PreviewModalContent pdfUrl={pdfUrl} fields={fields} recipients={recipients} />
            </DialogContent>
          </Dialog>

          <Button className="w-full bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-[#283718]" variant="outline" onClick={saveDocument} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Draft
          </Button>

          <Button className="w-full bg-[#283718] hover:bg-[#4A6247] text-white shadow-md" onClick={() => router.push(`/documents/${document.id}/send`)}>
            <Send className="mr-2 h-4 w-4" />
            Continue to Send
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-2 text-slate-500">Or</span>
            </div>
          </div>

          <Button
            className="w-full bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-[#283718]"
            variant="outline"
            onClick={handleSignNow}
            disabled={signing || saving}
          >
            {signing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenTool className="mr-2 h-4 w-4" />}
            Sign Now
          </Button>
        </div>
      </div>

      {/* CENTER PANEL: Main Canvas */}
      <div className="flex-1 bg-slate-100 overflow-auto p-8 flex justify-center" ref={containerRef}>
        <div className="space-y-8">
          <PDFDocument
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<Loader2 className="h-8 w-8 animate-spin" />}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div
                key={`page_${index + 1}`}
                className="relative shadow-lg"
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
              >
                <Page
                  pageNumber={index + 1}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
                {/* Render Fields for this page */}
                {fields.filter(f => f.page === index + 1).map(field => (
                  <div
                    key={field.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("fieldId", field.id)
                      const rect = (e.target as HTMLElement).getBoundingClientRect()
                      e.dataTransfer.setData("offsetX", (e.clientX - rect.left).toString())
                      e.dataTransfer.setData("offsetY", (e.clientY - rect.top).toString())
                      e.stopPropagation()
                    }}
                    className={`absolute border-2 rounded flex items-center justify-center text-xs cursor-move transition-all ${selectedFieldId === field.id ? 'ring-2 ring-offset-2 ring-blue-500 z-10' : ''}`}
                    style={{
                      left: field.x,
                      top: field.y,
                      width: field.width,
                      height: field.height,
                      borderColor: getRecipientColor(field.recipient_id),
                      backgroundColor: `${getRecipientColor(field.recipient_id)}20`,
                      color: getRecipientColor(field.recipient_id)
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFieldId(field.id)
                    }}
                  >
                    {field.type}
                  </div>
                ))}
              </div>
            ))}
          </PDFDocument>
        </div >
      </div >

      {/* RIGHT PANEL: Document Info */}
      <div className="w-64 border-l bg-white p-4 hidden lg:block overflow-y-auto">
        <h3 className="font-semibold mb-4">Document Info</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Fields</p>
              <p className="text-2xl font-bold text-slate-900">{fields.length}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Recipients</p>
              <p className="text-2xl font-bold text-slate-900">{recipients.length}</p>
            </div>
          </div>

          <div className="h-px bg-slate-200" />

          {/* Selected Field Properties */}
          <div>
            <h4 className="font-medium text-sm mb-3">Field Properties</h4>
            {selectedFieldId ? (
              (() => {
                const selectedField = fields.find(f => f.id === selectedFieldId)
                if (!selectedField) return <p className="text-sm text-muted-foreground">Field not found</p>

                return (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-500">Type</label>
                      <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border text-sm font-medium capitalize">
                        {selectedField.type === 'signature' && <PenTool className="w-3 h-3" />}
                        {selectedField.type === 'text' && <Type className="w-3 h-3" />}
                        {selectedField.type === 'date' && <Calendar className="w-3 h-3" />}
                        {selectedField.type === 'checkbox' && <CheckSquare className="w-3 h-3" />}
                        {selectedField.type}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-500">Assigned To</label>
                      <select
                        className="w-full p-2 text-sm border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-[#283718] outline-none transition-all"
                        value={selectedField.recipient_id || ''}
                        onChange={(e) => {
                          const newFields = fields.map(f =>
                            f.id === selectedFieldId ? { ...f, recipient_id: e.target.value } : f
                          )
                          setFields(newFields)
                        }}
                      >
                        <option value="" disabled>Select a recipient</option>
                        {recipients.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setFields(fields.filter(f => f.id !== selectedFieldId))
                          setSelectedFieldId(null)
                        }}
                      >
                        Delete Field
                      </Button>
                    </div>
                  </div>
                )
              })()
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">Select a field on the document to edit its properties</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  )
}

function DraggableField({ type, icon, label }: { type: string, icon: React.ReactNode, label: string }) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("type", type)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-move hover:border-[#283718] hover:bg-[#F5F7F4] hover:text-[#4A6247] hover:shadow-sm transition-all group"
    >
      <div className="p-1.5 bg-white rounded-md border border-slate-200 text-slate-500 group-hover:text-[#283718] group-hover:border-[#7A9B76]">
        {icon}
      </div>
      <span className="text-sm font-medium text-slate-700 group-hover:text-purple-900">{label}</span>
    </div>
  )
}

function PreviewModalContent({ pdfUrl, fields, recipients }: { pdfUrl: string, fields: Field[], recipients: any[] }) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  const getRecipientColor = (recipientId?: string) => {
    const recipient = recipients.find(r => r.id === recipientId)
    return recipient ? recipient.color : '#283718'
  }

  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex items-center justify-between w-full mb-4">
        <h2 className="text-xl font-bold">Document Preview</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber(p => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {pageNumber} of {numPages || '--'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="relative shadow-lg border overflow-auto max-h-full">
        <PDFDocument
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<Loader2 className="h-8 w-8 animate-spin" />}
        >
          <Page
            pageNumber={pageNumber}
            scale={0.8}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
          {/* Render Fields for this page (Read Only) */}
          {fields.filter(f => f.page === pageNumber).map(field => (
            <div
              key={field.id}
              className="absolute border rounded flex items-center justify-center text-xs"
              style={{
                left: field.x * 0.8, // Adjust for scale
                top: field.y * 0.8,
                width: field.width * 0.8,
                height: field.height * 0.8,
                borderColor: getRecipientColor(field.recipient_id),
                backgroundColor: `${getRecipientColor(field.recipient_id)}20`, // 20% opacity
                color: getRecipientColor(field.recipient_id)
              }}
            >
              {field.type}
            </div>
          ))}
        </PDFDocument>
      </div>
    </div>
  )
}
