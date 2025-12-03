"use client"

import { useState, useRef, useEffect } from "react"
import { Document as PDFDocument, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Check, ArrowRight, ArrowLeft, Eye } from "lucide-react"
import SignatureCanvas from 'react-signature-canvas'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function SigningInterface({ document, pdfUrl, token }: { document: any, pdfUrl: string, token: string }) {
  const [step, setStep] = useState(1)
  const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '', email: '' })
  const [numPages, setNumPages] = useState<number>(0)
  const [signature, setSignature] = useState<string | null>(null)
  const [signing, setSigning] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [signatureType, setSignatureType] = useState<'draw' | 'type'>('draw')
  const [typedSignature, setTypedSignature] = useState('')
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({}) // Store all field values
  const [savedSignatures, setSavedSignatures] = useState<any[]>([])
  const sigPad = useRef<SignatureCanvas>(null)
  const typeCanvasRef = useRef<HTMLCanvasElement>(null)

  // Fetch saved signatures
  useEffect(() => {
    fetch('/api/signatures', {
      credentials: 'include', // Important for auth cookies
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then(data => {
        console.log('Loaded saved signatures:', data)
        setSavedSignatures(data)
      })
      .catch(err => console.error('Failed to load saved signatures:', err))
  }, [])

  // Step 1: Info Validation
  const isInfoValid = userInfo.firstName && userInfo.lastName && userInfo.email

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  const clearSignature = () => {
    sigPad.current?.clear()
    setSignature(null)
    setTypedSignature('')
  }

  const generateTypedSignature = (text: string): string => {
    if (!typeCanvasRef.current) return ''

    const canvas = typeCanvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = '96px Dancing Script, cursive'
    ctx.fillStyle = '#000000'
    ctx.textBaseline = 'middle'

    const metrics = ctx.measureText(text)
    const textWidth = metrics.width
    const x = Math.max(20, (canvas.width - textWidth) / 2)

    ctx.fillText(text, x, canvas.height / 2)
    return canvas.toDataURL('image/png')
  }

  const [openDialogId, setOpenDialogId] = useState<string | null>(null)

  const saveSignature = (fieldId?: string) => {
    console.log('saveSignature called, type:', signatureType, 'fieldId:', fieldId)
    try {
      let signatureDataURL: string | null = null

      if (signatureType === 'draw') {
        console.log('Draw mode, sigPad.current:', sigPad.current)
        if (sigPad.current) {
          // Use toDataURL directly instead of getTrimmedCanvas
          signatureDataURL = sigPad.current.toDataURL('image/png')
          console.log('Data URL length:', signatureDataURL.length)
        } else {
          console.log('No sigPad ref')
        }
      } else if (signatureType === 'type') {
        console.log('Type mode, typedSignature:', typedSignature)
        if (typedSignature.trim() && typeCanvasRef.current) {
          const canvas = typeCanvasRef.current
          const ctx = canvas.getContext('2d')
          if (ctx) {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Set font and style - using Dancing Script
            ctx.font = '96px Dancing Script, cursive'
            ctx.fillStyle = '#000000'
            ctx.textBaseline = 'middle'

            // Measure text to center it properly
            const metrics = ctx.measureText(typedSignature)
            const textWidth = metrics.width
            const x = Math.max(20, (canvas.width - textWidth) / 2)

            // Draw text
            ctx.fillText(typedSignature, x, canvas.height / 2)

            // Convert to image
            signatureDataURL = canvas.toDataURL('image/png')
          }
        }
      }

      // Save to field-specific state and close dialog
      if (signatureDataURL && fieldId) {
        setFieldValues(prev => ({ ...prev, [fieldId]: signatureDataURL }))
        setOpenDialogId(null)
      }
    } catch (error) {
      console.error('Error saving signature:', error)
    }
  }

  const handleComplete = async () => {
    setSigning(true)

    try {
      const response = await fetch(`/api/documents/${document.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          fieldValues, // Send all field values
          signerInfo: userInfo
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Failed to sign')
      }

      setCompleted(true)
      setStep(3)
      // Confetti would go here
    } catch (error) {
      console.error('Error signing:', error)
      alert('Error signing document')
    } finally {
      setSigning(false)
    }
  }

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome to QuillKit</CardTitle>
            <CardDescription>Please enter your details to proceed with signing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={userInfo.firstName}
                  onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={userInfo.lastName}
                  onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              />
            </div>
            <Button
              className="w-full"
              onClick={() => setStep(2)}
              disabled={!isInfoValid}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="p-8 text-center space-y-6 max-w-md w-full">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Document Signed!</h2>
            <p className="text-muted-foreground">The document has been successfully signed and sent to all parties.</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                Preview Signed Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
              <div className="relative shadow-lg border mx-auto">
                <PDFDocument
                  file={pdfUrl}
                  loading={<Loader2 className="h-8 w-8 animate-spin" />}
                >
                  <Page pageNumber={1} scale={0.8} renderTextLayer={false} renderAnnotationLayer={false} />
                  {document.fields.filter((f: any) => f.page === 1).map((field: any) => (
                    <div
                      key={field.id}
                      className="absolute flex items-center justify-center"
                      style={{
                        left: field.x * 0.8,
                        top: field.y * 0.8,
                        width: field.width * 0.8,
                        height: field.height * 0.8,
                      }}
                    >
                      {signature && <img src={signature} alt="Signature" className="w-full h-full object-contain" />}
                    </div>
                  ))}
                </PDFDocument>
              </div>
            </DialogContent>
          </Dialog>

          <Button className="w-full" variant="ghost" onClick={() => window.close()}>
            Close Window
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setStep(1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-semibold hidden md:block">{document.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">
            Signed as {userInfo.firstName} {userInfo.lastName}
          </span>
          <Button onClick={handleComplete} disabled={Object.keys(fieldValues).length === 0 || signing}>
            {signing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
            Finish & Sign
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto bg-slate-100 p-8 flex justify-center">
        <div className="relative space-y-8">
          <PDFDocument
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<Loader2 className="h-8 w-8 animate-spin" />}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div key={`page_${index + 1}`} className="relative shadow-lg mb-4">
                <Page pageNumber={index + 1} renderTextLayer={false} renderAnnotationLayer={false} />

                {/* Render Fields */}
                {document.fields
                  .filter((f: any) => f.page === index + 1)
                  .filter((f: any) => {
                    // Only show fields assigned to this user's email
                    if (!f.recipient_id) return true; // Show unassigned fields
                    const recipient = document.recipients?.find((r: any) => r.id === f.recipient_id)
                    if (!recipient) return true; // Show if recipient not found
                    return recipient.email === userInfo.email; // Only show if email matches
                  })
                  .map((field: any) => {
                    // Render different UI based on field type
                    if (field.type === 'signature') {
                      return (
                        <Dialog
                          key={field.id}
                          open={openDialogId === field.id}
                          onOpenChange={(open) => setOpenDialogId(open ? field.id : null)}
                        >
                          <DialogTrigger asChild>
                            <div
                              className={`absolute border-2 rounded flex items-center justify-center cursor-pointer transition-colors ${fieldValues[field.id] ? 'bg-green-50 border-green-500' : 'bg-[#F5F7F4]/50 border-[#283718] hover:bg-[#F5F7F4]'}`}
                              style={{
                                left: field.x,
                                top: field.y,
                                width: field.width,
                                height: field.height,
                              }}
                            >
                              {fieldValues[field.id] ? (
                                <img src={fieldValues[field.id]} alt="Signature" className="h-full w-full object-contain" />
                              ) : (
                                <span className="text-xs text-[#283718] font-medium">Click to Sign</span>
                              )}
                            </div>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Add your signature</DialogTitle>
                            </DialogHeader>
                            <Tabs value={signatureType} onValueChange={(v) => setSignatureType(v as 'draw' | 'type')} className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="draw">Draw</TabsTrigger>
                                <TabsTrigger value="type">Type</TabsTrigger>
                                <TabsTrigger value="saved">Saved</TabsTrigger>
                              </TabsList>

                              <TabsContent value="draw" className="space-y-4">
                                <div className="border rounded-md bg-white">
                                  <SignatureCanvas
                                    ref={sigPad}
                                    canvasProps={{
                                      className: 'w-full h-40',
                                    }}
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={clearSignature}>Clear</Button>
                                  <Button onClick={() => saveSignature(field.id)}>Apply Signature</Button>
                                </div>
                              </TabsContent>

                              <TabsContent value="type" className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Type your full name</Label>
                                  <Input
                                    value={typedSignature}
                                    onChange={(e) => setTypedSignature(e.target.value)}
                                    placeholder="Franklin Nunez"
                                    className="text-lg"
                                  />
                                </div>

                                {typedSignature && (
                                  <div className="border rounded-md bg-white p-4 flex items-center justify-center min-h-[100px]">
                                    <p className="text-5xl" style={{ fontFamily: 'var(--font-signature), cursive' }}>
                                      {typedSignature}
                                    </p>
                                  </div>
                                )}

                                <canvas ref={typeCanvasRef} width={800} height={200} className="hidden" />

                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={clearSignature}>Clear</Button>
                                  <Button onClick={() => saveSignature(field.id)} disabled={!typedSignature.trim()}>Apply Signature</Button>
                                </div>
                              </TabsContent>

                              <TabsContent value="saved" className="space-y-4">
                                {savedSignatures.length === 0 ? (
                                  <div className="text-center py-8 text-muted-foreground">
                                    <p className="mb-2">No saved signatures yet.</p>
                                    <p className="text-sm">Save a signature from the draw or type tabs.</p>
                                  </div>
                                ) : (
                                  <div className="grid gap-2">
                                    {savedSignatures.map((sig) => (
                                      <Button
                                        key={sig.id}
                                        variant="outline"
                                        className="h-auto p-4 justify-start"
                                        onClick={() => {
                                          const data = sig.type === 'drawn' ? sig.signature_data : generateTypedSignature(sig.signature_data)
                                          setFieldValues(prev => ({ ...prev, [field.id]: data }))
                                          setOpenDialogId(null)
                                        }}
                                      >
                                        <div className="flex items-center gap-4 w-full">
                                          <div className="border rounded p-2 bg-white min-w-[150px]">
                                            {sig.type === 'drawn' ? (
                                              <img src={sig.signature_data} alt={sig.name} className="h-10 w-full object-contain" />
                                            ) : (
                                              <div className="h-10 flex items-center justify-center font-signature text-xl">
                                                {sig.signature_data}
                                              </div>
                                            )}
                                          </div>
                                          <div className="text-left">
                                            <p className="font-medium text-sm">{sig.name}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{sig.type}</p>
                                          </div>
                                        </div>
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </TabsContent>
                            </Tabs>
                          </DialogContent>
                        </Dialog>
                      )
                    } else if (field.type === 'date') {
                      return (
                        <div
                          key={field.id}
                          className="absolute border-2 border-[#283718] rounded bg-white flex items-center justify-center p-1"
                          style={{
                            left: field.x,
                            top: field.y,
                            width: field.width,
                            height: field.height,
                          }}
                        >
                          <Input
                            type="date"
                            value={fieldValues[field.id] || ''}
                            onChange={(e) => setFieldValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                            className="h-full border-0 text-sm"
                          />
                        </div>
                      )
                    } else if (field.type === 'text') {
                      return (
                        <div
                          key={field.id}
                          className="absolute border-2 border-[#283718] rounded bg-white flex items-center justify-center p-1"
                          style={{
                            left: field.x,
                            top: field.y,
                            width: field.width,
                            height: field.height,
                          }}
                        >
                          <Input
                            type="text"
                            value={fieldValues[field.id] || ''}
                            onChange={(e) => setFieldValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                            className="h-full border-0 text-sm"
                            placeholder="Type here..."
                          />
                        </div>
                      )
                    } else if (field.type === 'checkbox') {
                      return (
                        <div
                          key={field.id}
                          className="absolute border-2 border-[#283718] rounded bg-white flex items-center justify-center cursor-pointer"
                          style={{
                            left: field.x,
                            top: field.y,
                            width: field.width,
                            height: field.height,
                          }}
                          onClick={() => setFieldValues(prev => ({ ...prev, [field.id]: !prev[field.id] }))}
                        >
                          {fieldValues[field.id] && (
                            <Check className="w-full h-full text-green-600" />
                          )}
                        </div>
                      )
                    }
                    return null
                  })}
              </div>
            ))}
          </PDFDocument>
        </div>
      </div >
    </div >
  )
}
