"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Share2, Loader2, Copy, Check } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export function ShareModal({ documentId }: { documentId: string }) {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    const handleShare = async () => {
        if (!email) return
        setLoading(true)
        try {
            const response = await fetch(`/api/documents/${documentId}/share`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            if (!response.ok) throw new Error('Failed to share')

            toast({
                title: "Document shared",
                description: `Invitation sent to ${email}`,
            })
            setOpen(false)
            setEmail("")
        } catch (error) {
            console.error('Error sharing:', error)
            toast({
                title: "Error",
                description: "Failed to share document. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const copyLink = () => {
        const link = `${window.location.origin}/documents/${documentId}`
        navigator.clipboard.writeText(link)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast({
            title: "Link copied",
            description: "Document link copied to clipboard",
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Document
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Share Document</DialogTitle>
                    <DialogDescription>
                        Invite others to view this document or copy the link.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                                Link
                            </Label>
                            <Input
                                id="link"
                                defaultValue={`${typeof window !== 'undefined' ? window.location.origin : ''}/documents/${documentId}`}
                                readOnly
                            />
                        </div>
                        <Button type="submit" size="sm" className="px-3" onClick={copyLink}>
                            <span className="sr-only">Copy</span>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            placeholder="colleague@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleShare} disabled={loading || !email}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Invitation"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
