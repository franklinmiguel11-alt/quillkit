import { LucideIcon } from "lucide-react"

interface FeatureCardProps {
    icon: LucideIcon
    title: string
    description: string
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
    return (
        <div className="group bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-all cursor-pointer">
            <div className="mb-4">
                <Icon className="h-12 w-12 text-brand-primary" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600">{description}</p>
        </div>
    )
}
