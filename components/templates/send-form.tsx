"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface RecipientRole {
    role: string
    order: number
}

interface Template {
    id: string
    name: string
    recipient_roles: RecipientRole[]
}

export function SendFromTemplateForm({ template }: { template: Template }) {
    const [isLoading, setIsLoading] = useState(false)
    const [recipients, setRecipients] = useState<Record<string, { name: string; email: string }>>(
        template.recipient_roles.reduce((acc, role) => ({
            ...acc,
            [role.role]: { name: '', email: '' }
        }), {})
    )
    const router = useRouter()
    const { toast } = useToast()

    const updateRecipient = (role: string, field: 'name' | 'email', value: string) => {
        setRecipients({
            ...recipients,
            [role]: { ...recipients[role], [field]: value }
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch(`/api/templates/${template.id}/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipients })
            })

            if (!response.ok) throw new Error('Failed to send document')

            const document = await response.json()

            toast({
                title: "Document sent!",
                description: "Your document has been created and sent to recipients."
            })

            router.push(`/documents/${document.id}`)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send document.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardContent className="pt-6 space-y-6">
                    {template.recipient_roles.map((role, index) => (
                        <div key={`${role.role}-${index}`} className="space-y-4">
                            <h3 className="font-semibold text-lg">{role.role}</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                        value={recipients[role.role]?.name || ''}
                                        onChange={(e) => updateRecipient(role.role, 'name', e.target.value)}
                                        placeholder="Full name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={recipients[role.role]?.email || ''}
                                        onChange={(e) => updateRecipient(role.role, 'email', e.target.value)}
                                        placeholder="email@example.com"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-brand-primary hover:bg-brand-secondary">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Document
                </Button>
            </div>
        </form>
    )
}
