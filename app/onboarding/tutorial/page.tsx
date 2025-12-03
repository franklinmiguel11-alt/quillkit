"use client"

import { Button } from "@/components/ui/button"
import { FeatureCard } from "@/components/onboarding/FeatureCard"
import { ProgressDots } from "@/components/onboarding/ProgressDots"
import { UploadCloud, PenTool, Send, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TutorialPage() {
    const router = useRouter()

    const handleBack = () => {
        router.back()
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-brand-subtle px-6 py-12">
            <div className="max-w-4xl mx-auto w-full space-y-12 animate-in fade-in duration-500">
                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={UploadCloud}
                        title="Upload any PDF"
                        description="Drag & drop or browse"
                    />
                    <FeatureCard
                        icon={PenTool}
                        title="Add signature fields"
                        description="Simple drag & drop"
                    />
                    <FeatureCard
                        icon={Send}
                        title="Send to anyone"
                        description="No account needed to sign"
                    />
                </div>

                {/* Navigation */}
                <div className="flex flex-col items-center gap-6">
                    <Link href="/onboarding/upload" className="w-full sm:w-auto">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto bg-brand-primary hover:bg-brand-secondary px-8 py-3 transition-transform hover:scale-105"
                        >
                            Continue
                        </Button>
                    </Link>

                    <ProgressDots currentStep={2} />

                    <button
                        onClick={handleBack}
                        className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </button>
                </div>
            </div>
        </div>
    )
}
