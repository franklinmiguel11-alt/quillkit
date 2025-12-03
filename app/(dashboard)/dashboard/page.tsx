import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, Upload, File, ChevronDown, PenTool, Send, FilePlus, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { ResendSetupAlert } from "@/components/dashboard/resend-setup-alert"
import { createClient } from "@/lib/supabase/server"
import { WelcomeModal } from "@/components/dashboard/welcome-modal"
import { Badge } from "@/components/ui/badge"
import { DashboardActions } from "@/components/dashboard/dashboard-actions"
import { EmptyState } from "@/components/dashboard/empty-state"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default async function DashboardPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch stats
    const { count: totalDocs } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)

    const { count: signedDocs } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('status', 'signed')

    // Fetch recent documents
    const { data: recentDocs } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5)

    return (
        <div className="flex-1 bg-slate-50/50 min-h-screen">
            <WelcomeModal documentCount={totalDocs || 0} />
            <ResendSetupAlert visible={user?.email === 'franklinnunezjimenez@gmail.com'} />

            {/* DocuSign-style Banner */}
            <div className="bg-[#283718] text-white p-8 pb-16">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-normal">
                            Welcome back, <span className="font-bold">{user?.user_metadata?.full_name || 'User'}</span>
                        </h2>
                        <div className="text-sm opacity-90">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="lg" className="bg-white text-[#283718] hover:bg-slate-100 font-semibold px-6 h-12 text-base">
                                    Start
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                                <DropdownMenuItem asChild>
                                    <Link href="/documents/new" className="cursor-pointer">
                                        <Send className="mr-2 h-4 w-4" />
                                        <span>Send an Envelope</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/documents/new?blank=true" className="cursor-pointer">
                                        <PenTool className="mr-2 h-4 w-4" />
                                        <span>Sign a Document</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem disabled>
                                    <FilePlus className="mr-2 h-4 w-4" />
                                    <span>Create Template</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link href="/documents/new?blank=true">
                            <Button variant="outline" size="lg" className="bg-transparent text-white border-white/30 hover:bg-white/10 h-12 px-6">
                                <PenTool className="mr-2 h-4 w-4" />
                                Sign a Document
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-6xl mx-auto px-8 -mt-8 space-y-8 pb-12">

                {/* Stats / Overview Cards */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-slate-700">Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-2 rounded-full shadow-sm border">
                                        <PenTool className="h-5 w-5 text-[#283718]" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">Action Required</p>
                                        <p className="text-sm text-slate-500">0 documents need your signature</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">View</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-slate-700">Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Waiting for others</span>
                                    <span className="font-bold text-slate-900">{totalDocs ? totalDocs - (signedDocs || 0) : 0}</span>
                                </div>
                                <div className="h-px bg-slate-100" />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Completed</span>
                                    <span className="font-bold text-slate-900">{signedDocs || 0}</span>
                                </div>
                                <div className="h-px bg-slate-100" />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Expiring soon</span>
                                    <span className="font-bold text-slate-900">0</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Documents */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="border-b bg-white">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold text-slate-700">Recent Activity</CardTitle>
                            <Button variant="ghost" size="sm" className="text-[#283718] hover:text-[#283718] hover:bg-[#F5F7F4]">
                                View All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {recentDocs && recentDocs.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {recentDocs.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-[#F5F7F4] p-2.5 rounded-lg">
                                                <FileText className="h-5 w-5 text-[#283718]" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{doc.title}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                    <span>{doc.status === 'signed' ? 'Completed' : 'Draft'}</span>
                                                    <span>•</span>
                                                    <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={doc.status === 'signed' ? 'default' : 'secondary'} className={doc.status === 'signed' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-slate-100 text-slate-700 hover:bg-slate-100'}>
                                                {doc.status}
                                            </Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/documents/${doc.id}`}>View Details</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/documents/${doc.id}/edit`}>Edit</Link>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
