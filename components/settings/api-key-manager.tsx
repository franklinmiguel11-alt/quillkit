"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Copy, RefreshCw, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function ApiKeyManager({ initialApiKey }: { initialApiKey: string | null }) {
    const [apiKey, setApiKey] = useState<string | null>(initialApiKey)
    const [isLoading, setIsLoading] = useState(false)
    const [showKey, setShowKey] = useState(false)
    const { toast } = useToast()

    const generateApiKey = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/settings/apikey', {
                method: 'POST',
            })

            if (!response.ok) throw new Error('Failed to generate key')

            const data = await response.json()
            setApiKey(data.apiKey)
            toast({
                title: "API Key Generated",
                description: "Your new API key is ready to use.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to generate API key.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = () => {
        if (apiKey) {
            navigator.clipboard.writeText(apiKey)
            toast({
                title: "Copied",
                description: "API key copied to clipboard.",
            })
        }
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Your API Key</Label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Input
                            value={apiKey || ''}
                            type={showKey ? "text" : "password"}
                            readOnly
                            placeholder="No API key generated"
                            className="pr-10"
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowKey(!showKey)}
                            disabled={!apiKey}
                        >
                            {showKey ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                        </Button>
                    </div>
                    <Button variant="outline" size="icon" onClick={copyToClipboard} disabled={!apiKey}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                    Keep this key secret. Do not share it in client-side code.
                </p>
            </div>
            <Button onClick={generateApiKey} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {apiKey ? 'Regenerate Key' : 'Generate Key'}
            </Button>
        </div>
    )
}
