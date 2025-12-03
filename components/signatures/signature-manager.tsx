"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Loader2, Trash2, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import SignatureCanvas from 'react-signature-canvas'
import { useRouter } from "next/navigation"

interface SavedSignature {
    id: string
    name: string
    type: 'drawn' | 'typed'
    signature_data: string
    is_default: boolean
}

export function SignatureManager({ initialSignatures }: { initialSignatures: SavedSignature[] }) {
    const [signatures, setSignatures] = useState(initialSignatures)
    const [isOpen, setIsOpen] = useState(false)
    const [editingSignature, setEditingSignature] = useState<SavedSignature | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [signatureName, setSignatureName] = useState('')
    const [typedSignature, setTypedSignature] = useState('')
    const signaturePadRef = useRef<SignatureCanvas>(null)
    const { toast } = useToast()
    const router = useRouter()

    const openEditDialog = (sig: SavedSignature) => {
        setEditingSignature(sig)
        setSignatureName(sig.name)
        if (sig.type === 'typed') {
            setTypedSignature(sig.signature_data)
        }
        setIsOpen(true)
    }

    const closeDialog = () => {
        setIsOpen(false)
        setEditingSignature(null)
        setSignatureName('')
        setTypedSignature('')
        signaturePadRef.current?.clear()
    }

    const saveSignature = async (type: 'drawn' | 'typed') => {
        setIsLoading(true)
        try {
            let signatureData = ''
            if (type === 'drawn') {
                // If editing and canvas is empty, use original signature data
                if (editingSignature && editingSignature.type === 'drawn' && signaturePadRef.current?.isEmpty()) {
                    signatureData = editingSignature.signature_data
                } else if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
                    toast({
                        title: "Error",
                        description: "Please draw a signature first.",
                        variant: "destructive",
                    })
                    setIsLoading(false)
                    return
                } else {
                    signatureData = signaturePadRef.current.toDataURL()
                }
            } else {
                if (!typedSignature.trim()) {
                    toast({
                        title: "Error",
                        description: "Please enter a signature.",
                        variant: "destructive",
                    })
                    setIsLoading(false)
                    return
                }
                signatureData = typedSignature
            }

            const url = editingSignature
                ? `/api/signatures?id=${editingSignature.id}`
                : '/api/signatures'
            const method = editingSignature ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: signatureName || (type === 'drawn' ? 'My Drawn Signature' : 'My Typed Signature'),
                    type,
                    signature_data: signatureData,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
                console.error('Failed to save signature:', response.status, errorData)
                throw new Error(`Server returned ${response.status}: ${JSON.stringify(errorData)}`)
            }

            toast({
                title: editingSignature ? "Signature Updated" : "Signature Saved",
                description: `Your signature has been ${editingSignature ? 'updated' : 'saved'} successfully.`,
            })
            closeDialog()
            router.refresh()
        } catch (error) {
            console.error('Save signature error:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to save signature.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const deleteSignature = async (id: string) => {
        try {
            const response = await fetch(`/api/signatures?id=${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) throw new Error('Failed to delete signature')

            toast({
                title: "Signature Deleted",
                description: "Your signature has been deleted.",
            })
            router.refresh()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete signature.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-4">
            {signatures.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    <p className="mb-2">You currently do not have any signatures.</p>
                    <p className="text-sm">Add your first signature to get started.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {signatures.map((sig) => (
                        <div key={sig.id} className="flex items-center justify-between border p-4 rounded-md">
                            <div className="flex items-center gap-4">
                                <div className="border rounded p-2 bg-white min-w-[200px]">
                                    {sig.type === 'drawn' ? (
                                        <img src={sig.signature_data} alt={sig.name} className="h-12 w-full object-contain" />
                                    ) : (
                                        <div className="h-12 flex items-center justify-center font-signature text-2xl">
                                            {sig.signature_data}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium">{sig.name}</p>
                                    <p className="text-sm text-muted-foreground capitalize">{sig.type}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => openEditDialog(sig)}>
                                    Edit
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => deleteSignature(sig.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Signature
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingSignature ? 'Edit Signature' : 'Add Signature'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Signature Name</Label>
                            <Input
                                value={signatureName}
                                onChange={(e) => setSignatureName(e.target.value)}
                                placeholder="e.g., My Primary Signature"
                            />
                        </div>
                        <Tabs defaultValue="draw" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="draw">Draw</TabsTrigger>
                                <TabsTrigger value="type">Type</TabsTrigger>
                            </TabsList>
                            <TabsContent value="draw" className="space-y-4">
                                <div className="border rounded-md bg-white">
                                    <SignatureCanvas
                                        ref={signaturePadRef}
                                        canvasProps={{
                                            className: 'w-full h-48',
                                        }}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => signaturePadRef.current?.clear()}>
                                        Clear
                                    </Button>
                                    <Button onClick={() => saveSignature('drawn')} disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Signature
                                    </Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="type" className="space-y-4">
                                <Input
                                    value={typedSignature}
                                    onChange={(e) => setTypedSignature(e.target.value)}
                                    placeholder="Type your signature"
                                    className="font-signature text-2xl"
                                />
                                <div className="border rounded-md p-4 bg-white min-h-[100px] flex items-center justify-center">
                                    <span className="font-signature text-3xl">{typedSignature}</span>
                                </div>
                                <Button onClick={() => saveSignature('typed')} disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Signature
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
