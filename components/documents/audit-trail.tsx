import { CheckCircle2, Mail, Eye, FileText, Ban } from "lucide-react"

type Event = {
    action: string
    timestamp: string
    actor?: string
    ip?: string
}

export function AuditTrail({ events }: { events: Event[] }) {
    if (!events || events.length === 0) {
        return <div className="text-sm text-muted-foreground">No activity yet.</div>
    }

    return (
        <div className="space-y-4">
            {events.map((event, i) => (
                <div key={i} className="flex gap-3">
                    <div className="mt-1">
                        {getIcon(event.action)}
                    </div>
                    <div className="text-sm">
                        <p className="font-medium">{formatAction(event.action)}</p>
                        <p className="text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                        {event.actor && <p className="text-xs text-muted-foreground">by {event.actor}</p>}
                    </div>
                </div>
            ))}
        </div>
    )
}

function getIcon(action: string) {
    switch (action) {
        case 'created': return <FileText className="h-4 w-4 text-[#283718]" />
        case 'sent': return <Mail className="h-4 w-4 text-yellow-500" />
        case 'viewed': return <Eye className="h-4 w-4 text-[#283718]" />
        case 'signed': return <CheckCircle2 className="h-4 w-4 text-green-500" />
        case 'voided': return <Ban className="h-4 w-4 text-red-500" />
        default: return <FileText className="h-4 w-4 text-gray-500" />
    }
}

function formatAction(action: string) {
    return action.charAt(0).toUpperCase() + action.slice(1)
}
