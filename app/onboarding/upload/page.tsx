"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProgressDots } from "@/components/onboarding/ProgressDots"
import { FileUp, Check } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UploadPage() {
    const [uploading, setUploading] = useState(false)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)

        // Simulate upload
        setTimeout(async () => {
            setSuccess(true)
            await fetch('/api/onboarding/complete', { method: 'POST' })

            // Auto-redirect after 1.5s
            setTimeout(() => {
                router.push('/dashboard')
            }, 1500)
        }, 1000)
    }

    const handleSkip = async () => {
        await fetch('/api/onboarding/complete', { method: 'POST' })
        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-brand-subtle px-6 py-12">
            <div className="max-w-2xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
                {/* Headline */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        Try it now - Upload your first document
                    </h2>
                </div>

                {/* Upload Zone */}
                <div className="relative">
                    <label
                        htmlFor="file-upload"
                        className={`
                            block border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                            transition-all
                            ${success
                                ? 'border-green-500 bg-green-50'
                                : 'border-brand-primary bg-white hover:bg-brand-subtle'
                            }
                        `}
                    >
                        {success ? (
                            <div className="space-y-4">
                                <Check className="h-16 w-16 text-green-500 mx-auto" />
                                <p className="text-lg font-semibold text-green-700">
                                    Document uploaded! ✓
                                </p>
                            </div>
                        ) : (
                            <>
                                <FileUp className="h-16 w-16 text-brand-primary mx-auto mb-4" />
                                <p className="text-lg text-slate-700 mb-2">
                                    {uploading ? 'Uploading...' : 'Drag PDF here or click to browse'}
                                </p>
                            </>
                        )}
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".pdf"
                        onChange={handleUpload}
                        className="hidden"
                        disabled={uploading || success}
                    />
                </div>

                {!success && (
                    <>
                        <div className="text-center text-slate-500">or</div>

                        <div className="text-center">
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-brand-primary text-brand-primary hover:bg-brand-subtle"
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                Browse files
                            </Button>
                        </div>
                    </>
                )}

                {/* Navigation */}
                <div className="flex flex-col items-center gap-6 mt-8">
                    <ProgressDots currentStep={3} />

                    {!success && (
                        <button
                            onClick={handleSkip}
                            className="text-slate-500 hover:text-slate-700 text-sm transition-colors"
                        >
                            Skip for now
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
