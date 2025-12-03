"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, FileText, Home, Settings, CreditCard, Files } from "lucide-react"

const items = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
    },
    {
        title: "Documents",
        href: "/documents",
        icon: FileText,
    },
    {
        title: "Templates",
        href: "/templates",
        icon: Files,
    },
    {
        title: "Billing",
        href: "/billing",
        icon: CreditCard,
    },
    {
        title: "APIs",
        href: "/settings",
        icon: Settings,
    },
]

export function DashboardNav() {
    const pathname = usePathname()

    return (
        <nav className="grid items-start gap-2">
            {items.map((item, index) => {
                const Icon = item.icon
                return (
                    <Link
                        key={index}
                        href={item.href}
                        className={cn(
                            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
                        )}
                    >
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                    </Link>
                )
            })}
        </nav>
    )
}
