"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileSignature, Upload } from "lucide-react"
import Link from "next/link"

export function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] p-8 text-center animate-in fade-in-50 duration-500">
            <div className="bg-gradient-to-b from-blue-50 to-white p-8 rounded-full mb-8 shadow-sm border border-[#7A9B76]">
                <FileSignature className="h-16 w-16 text-[#283718]" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                Welcome to QuillKit
            </h3>
            <p className="text-slate-500 max-w-md mb-10 text-lg">
                The fastest way to sign and send documents. <br />
                Get started by uploading your first PDF.
            </p>

            <div className="grid gap-4 w-full max-w-xs">
                <Link href="/documents/new">
                    <Button size="lg" className="w-full gap-2 text-base h-14 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all">
                        <Upload className="h-5 w-5" />
                        Upload Document
                    </Button>
                </Link>

                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground font-medium">
                            Or start from scratch
                        </span>
                    </div>
                </div>

                <Link href="/documents/new?blank=true">
                    <Button variant="outline" size="lg" className="w-full gap-2 text-base h-12 hover:bg-slate-50">
                        <FileSignature className="h-5 w-5" />
                        Create Signature
                    </Button>
                </Link>
            </div>
        </div>
    )
}
