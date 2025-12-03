"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Upload, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface RecipientRole {
    id: string
    role: string
    order: number
}

export function CreateTemplateWizard() {
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    // Step 1: Name & Description
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    // Step 2: Document
    const [file, setFile] = useState<File | null>(null)

    // Step 3: Recipient Roles
    const [recipientRoles, setRecipientRoles] = useState<RecipientRole[]>([
        { id: '1', role: 'Signer', order: 1 }
    ])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const addRecipientRole = () => {
        const newRole: RecipientRole = {
            id: Date.now().toString(),
            role: '',
            order: recipientRoles.length + 1
        }
        setRecipientRoles([...recipientRoles, newRole])
    }

    const updateRole = (id: string, role: string) => {
        setRecipientRoles(recipientRoles.map(r =>
            r.id === id ? { ...r, role } : r
        ))
    }

    const removeRole = (id: string) => {
        setRecipientRoles(recipientRoles.filter(r => r.id !== id))
    }

    const handleNext = () => {
        if (step === 1 && !name.trim()) {
            toast({
                title: "Name required",
                description: "Please enter a template name.",
                variant: "destructive"
            })
            return
        }
        if (step === 2 && !file) {
            toast({
                title: "Document required",
                description: "Please upload a document.",
                variant: "destructive"
            })
            return
        }
        setStep(step + 1)
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            // Upload PDF
            const formData = new FormData()
            if (file) formData.append('file', file)
            formData.append('name', name)
            formData.append('description', description)
            formData.append('recipient_roles', JSON.stringify(recipientRoles))

            const response = await fetch('/api/templates', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) throw new Error('Failed to create template')

            const template = await response.json()

            toast({
                title: "Template created",
                description: "Your template has been created successfully."
            })

            // Redirect to field editor
            router.push(`/templates/${template.id}/edit`)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create template.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center flex-1">
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center font-semibold
                            ${s <= step ? 'bg-brand-primary text-white' : 'bg-slate-200 text-slate-500'}
                        `}>
                            {s}
                        </div>
                        {s < 3 && (
                            <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-brand-primary' : 'bg-slate-200'}`} />
                        )}
                    </div>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {step === 1 && 'Template Information'}
                        {step === 2 && 'Upload Document'}
                        {step === 3 && 'Add Recipients'}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && 'Enter a name and description for your template'}
                        {step === 2 && 'Upload the document you want to use as a template'}
                        {step === 3 && 'Define recipient roles (placeholders)'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {step === 1 && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="name">Template Name *</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Employment Contract"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description (optional)</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Briefly describe what this template is for..."
                                    rows={4}
                                />
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <Label htmlFor="file" className="cursor-pointer">
                                    <span className="text-brand-primary hover:underline">Upload a file</span>
                                    {" or drag and drop"}
                                </Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                {file && (
                                    <p className="mt-4 text-sm text-slate-600">
                                        Selected: {file.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            {recipientRoles.map((role, index) => (
                                <div key={role.id} className="flex gap-2">
                                    <div className="flex-1">
                                        <Label>Role {index + 1}</Label>
                                        <Input
                                            value={role.role}
                                            onChange={(e) => updateRole(role.id, e.target.value)}
                                            placeholder="e.g., Signer, Manager, Approver"
                                        />
                                    </div>
                                    {recipientRoles.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeRole(role.id)}
                                            className="mt-6"
                                        >
                                            ×
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button variant="outline" onClick={addRecipientRole} className="w-full">
                                + Add Role
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-between mt-6">
                <Button
                    variant="outline"
                    onClick={() => step > 1 ? setStep(step - 1) : router.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {step > 1 ? 'Previous' : 'Cancel'}
                </Button>
                {step < 3 ? (
                    <Button onClick={handleNext}>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save & Continue
                    </Button>
                )}
            </div>
        </div>
    )
}
