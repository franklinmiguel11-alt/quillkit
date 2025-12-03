"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Upload, PenTool } from "lucide-react"
import Link from "next/link"

export function WelcomeModal({ documentCount }: { documentCount: number }) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        // Show if user has 0 documents and hasn't seen the modal yet (could use localStorage)
        const hasSeenWelcome = localStorage.getItem("hasSeenWelcome")
        if (documentCount === 0 && !hasSeenWelcome) {
            setOpen(true)
        }
    }, [documentCount])

    const handleClose = () => {
        setOpen(false)
        localStorage.setItem("hasSeenWelcome", "true")
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center">Welcome to QuillKit! 🎉</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        Get started with your first document in seconds.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer" onClick={handleClose}>
                        <div className="bg-[#F5F7F4] p-2 rounded-full">
                            <Upload className="h-6 w-6 text-[#283718]" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Upload a PDF</h3>
                            <p className="text-sm text-muted-foreground">Upload an existing PDF to sign or send for signing.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer" onClick={handleClose}>
                        <div className="bg-[#F5F7F4] p-2 rounded-full">
                            <FileText className="h-6 w-6 text-[#283718]" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Use a Template</h3>
                            <p className="text-sm text-muted-foreground">Start with a pre-made template to save time.</p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleClose} className="w-full">Let's Go!</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
