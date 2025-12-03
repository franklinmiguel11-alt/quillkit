"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, File, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DashboardActions() {
    const router = useRouter()
    const [creatingBlank, setCreatingBlank] = useState(false)

    const handleStartBlank = async () => {
        setCreatingBlank(true)
        try {
            const response = await fetch('/api/documents/blank', {
                method: 'POST',
            })

            if (!response.ok) throw new Error('Failed to create blank document')

            const { id } = await response.json()
            router.push(`/documents/${id}/edit`)
        } catch (error) {
            console.error('Error creating blank document:', error)
            alert('Failed to create blank document')
        } finally {
            setCreatingBlank(false)
        }
    }

    return (
        <div className="grid gap-4 md:grid-cols-3 mb-4">
            <Link href="/documents/new">
                <Card className="hover:bg-slate-50 transition-colors cursor-pointer h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upload PDF</CardTitle>
                        <Upload className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-muted-foreground">Upload and prepare a document</div>
                    </CardContent>
                </Card>
            </Link>
            <Card className="hover:bg-slate-50 transition-colors cursor-pointer h-full opacity-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Use Template</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground">Coming soon</div>
                </CardContent>
            </Card>
            <Card
                className="hover:bg-slate-50 transition-colors cursor-pointer h-full"
                onClick={handleStartBlank}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Start Blank</CardTitle>
                    {creatingBlank ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <File className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground">Create a blank document</div>
                </CardContent>
            </Card>
        </div>
    )
}
