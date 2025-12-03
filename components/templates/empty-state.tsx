"use client"

import { Button } from "@/components/ui/button"
import { FileText, Rocket } from "lucide-react"
import Link from "next/link"

export function TemplatesEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="relative mb-8">
                {/* Illustration - simplified paper airplane design */}
                <div className="relative w-64 h-64">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                        {/* Background envelope shapes */}
                        <g opacity="0.2">
                            <rect x="30" y="60" width="60" height="80" rx="4" fill="#2D3E2C" />
                            <rect x="110" y="40" width="60" height="80" rx="4" fill="#2D3E2C" />
                            <rect x="70" y="100" width="60" height="80" rx="4" fill="#2D3E2C" />
                        </g>
                        {/* Paper airplanes */}
                        <g className="animate-pulse">
                            <path d="M 50 100 L 90 120 L 50 140 Z" fill="#60A5FA" opacity="0.8" />
                            <path d="M 100 60 L 140 80 L 100 100 Z" fill="#283718" />
                            <path d="M 80 150 L 120 170 L 80 190 Z" fill="#60A5FA" opacity="0.6" />
                        </g>
                    </svg>
                </div>
            </div>

            <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                Resending the same envelopes?
            </h3>
            <p className="text-slate-600 mb-6 text-center max-w-md">
                Save documents, placeholder recipients and fields as a template so you can save time.
            </p>

            <div className="flex gap-3">
                <Link href="/templates/new">
                    <Button className="bg-brand-primary hover:bg-brand-secondary">
                        <Rocket className="mr-2 h-4 w-4" />
                        Create a Template
                    </Button>
                </Link>
                <Button variant="outline">
                    Browse starter templates
                </Button>
            </div>
        </div>
    )
}
