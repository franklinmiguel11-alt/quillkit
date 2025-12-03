"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function WelcomePage() {
    const router = useRouter()

    const handleSkip = async () => {
        await fetch('/api/onboarding/complete', { method: 'POST' })
        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-brand-subtle px-6">
            <div className="max-w-2xl mx-auto text-center space-y-8 animate-in fade-in duration-500">
                {/* Logo */}
                <img
                    src="/quillkit-logo.png"
                    alt="QuillKit"
                    className="h-16 w-16 object-contain mx-auto"
                />

                {/* Headline */}
                <h1 className="text-4xl font-bold text-slate-900">
                    Welcome to QuillKit
                </h1>

                {/* Subtext */}
                <p className="text-lg text-slate-600">
                    Get your first document signed in under 2 minutes
                </p>

                {/* Primary CTA */}
                <Link href="/onboarding/tutorial">
                    <Button
                        size="lg"
                        className="bg-brand-primary hover:bg-brand-secondary px-8 py-4 text-lg h-auto transition-transform hover:scale-105"
                    >
                        Get Started
                    </Button>
                </Link>

                {/* Skip Link */}
                <button
                    onClick={handleSkip}
                    className="text-slate-500 hover:text-slate-700 text-sm transition-colors mt-4 block w-full"
                >
                    Skip
                </button>
            </div>
        </div>
    )
}
