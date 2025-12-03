import { UserNav } from "@/components/user-nav"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { FileText } from "lucide-react"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50/50">
            <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
                <div className="container flex h-16 items-center justify-between py-4 pl-6">
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="flex items-center space-x-2">
                            <img src="/quillkit-logo.png" alt="QuillKit" className="h-8 w-8 object-contain" />
                            <span className="font-bold text-xl text-slate-900">QuillKit</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/dashboard" className="text-sm font-medium text-slate-900 hover:text-brand-primary border-b-2 border-transparent hover:border-brand-primary py-5 transition-all">
                                Home
                            </Link>
                            <Link href="/documents" className="text-sm font-medium text-slate-600 hover:text-brand-primary border-b-2 border-transparent hover:border-brand-primary py-5 transition-all">
                                Agreements
                            </Link>
                            <Link href="/templates" className="text-sm font-medium text-slate-600 hover:text-brand-primary border-b-2 border-transparent hover:border-brand-primary py-5 transition-all">
                                Templates
                            </Link>
                            <Link href="/settings" className="text-sm font-medium text-slate-600 hover:text-brand-primary border-b-2 border-transparent hover:border-brand-primary py-5 transition-all">
                                APIs
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm text-slate-600 hidden md:block">
                            {/* Trial badge removed */}
                        </div>
                        <UserNav user={user} />
                    </div>
                </div>
            </header>
            <main className="flex-1 w-full">
                {children}
            </main>
        </div>
    )
}
