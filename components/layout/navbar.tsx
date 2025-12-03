"use client"

import Link from "next/link"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/quillkit-logo.png" alt="QuillKit" className="h-8 w-8 object-contain" />
                            <span className="text-xl font-bold bg-gradient-to-r from-[#283718] to-[#4A6247] bg-clip-text text-transparent">
                                QuillKit
                            </span>
                        </Link>
                    </div>

                    {/* Center: Navigation Links (only on marketing pages) */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/#features" className="text-sm font-medium text-slate-700 hover:text-[#283718] transition">Features</Link>
                        <Link href="/#pricing" className="text-sm font-medium text-slate-700 hover:text-[#283718] transition">Pricing</Link>
                        <Link href="/docs" className="text-sm font-medium text-slate-700 hover:text-[#283718] transition">Docs</Link>
                    </div>

                    {/* Right: CTA Buttons */}
                    <div className="flex items-center gap-3">
                        <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-[#283718] transition">
                            Log in
                        </Link>
                        <Link href="/signup">
                            <Button className="inline-flex items-center justify-center rounded-lg bg-[#283718] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4A6247] transition">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
