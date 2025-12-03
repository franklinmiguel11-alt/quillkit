"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ResendSetupAlert({ visible = true }: { visible?: boolean }) {
    if (!visible) return null

    return (
        <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Resend Configuration Required</AlertTitle>
            <AlertDescription className="flex items-center justify-between mt-2">
                <span>
                    Your Resend domain is not verified. Emails will only be sent to the registered test email address.
                </span>
                <Button variant="outline" size="sm" asChild className="ml-4 bg-white text-destructive hover:bg-gray-100 border-destructive">
                    <Link href="https://resend.com/domains" target="_blank">
                        Verify Domain
                    </Link>
                </Button>
            </AlertDescription>
        </Alert>
    )
}
