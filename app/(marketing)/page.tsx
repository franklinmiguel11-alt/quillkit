import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowRight, Check, Code2, FileText, Github, Globe, Layout, Shield, Terminal, Users, Zap,
    Sparkles, ExternalLink, CheckCircle2, FileCheck, AlertCircle, Star, Upload, Send
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";



export default function Home() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32">
                {/* Animated gradient background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(139,92,246,0.1),transparent_50%)]" />
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        {/* Badge */}
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#F5F7F4] px-4 py-2 text-sm font-medium text-[#283718] ring-1 ring-inset ring-[#283718]/10 hover:bg-[#F5F7F4] transition cursor-pointer">
                            <Sparkles className="h-4 w-4" />
                            <span>Launching on Product Hunt soon</span>
                            <ArrowRight className="h-4 w-4" />
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl mb-6">
                            <span className="block">Open-source</span>
                            <span className="block bg-gradient-to-r from-[#283718] via-[#4A6247] to-[#4A6247] bg-clip-text text-transparent animate-gradient">
                                document signing
                            </span>
                            <span className="block text-slate-900">for developers</span>
                        </h1>

                        {/* Subheading */}
                        <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl mb-10">
                            Add e-signatures to your app in <span className="font-semibold text-slate-900">10 minutes</span>.
                            Self-host for free or use our managed API. Built with Next.js, Supabase, and Tailwind.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                            <Link href="/signup" className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#283718] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:bg-[#4A6247] transition-all duration-200">
                                Start Free
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>

                            <Link href="https://github.com/docflow/docflow" target="_blank" className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-slate-900 shadow-md ring-1 ring-slate-900/10 hover:ring-slate-900/20 transition-all duration-200">
                                <Github className="h-5 w-5" />
                                View on GitHub
                                <ExternalLink className="h-4 w-4 opacity-50" />
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                <span>MIT Licensed</span>
                            </div>
                            <div className="h-4 w-px bg-slate-300" />
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-[#283718]" />
                                <span>500+ developers</span>
                            </div>
                            <div className="h-4 w-px bg-slate-300" />
                            <div className="flex items-center gap-2">
                                <FileCheck className="h-5 w-5 text-[#283718]" />
                                <span>10K+ signed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Features
                        </h2>
                        <p className="mt-4 text-lg text-slate-600">
                            Everything you need to build a signing flow.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <FeatureCard
                            icon={<Code2 className="h-8 w-8 text-[#283718]" />}
                            title="Developer-First"
                            description="Clean REST API, Webhooks, and SDKs for easy integration."
                        />
                        <FeatureCard
                            icon={<Layout className="h-8 w-8 text-[#283718]" />}
                            title="White-Label Ready"
                            description="Custom branding, your domain, and embeddable widgets."
                        />
                        <FeatureCard
                            icon={<Github className="h-8 w-8 text-slate-900" />}
                            title="Open Source"
                            description="MIT licensed. Self-host option. No vendor lock-in."
                        />
                        <FeatureCard
                            icon={<Shield className="h-8 w-8 text-green-600" />}
                            title="Enterprise Ready"
                            description="Encryption at rest, audit trails, and SOC2 ready infrastructure."
                        />
                        <FeatureCard
                            icon={<Zap className="h-8 w-8 text-amber-500" />}
                            title="Smart Signing"
                            description="No login required for signers. Mobile-optimized and fast."
                        />
                        <FeatureCard
                            icon={<Terminal className="h-8 w-8 text-slate-600" />}
                            title="Developer Experience"
                            description="Comprehensive docs, code examples, and active community."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            How it works
                        </h2>
                        <p className="mt-4 text-lg text-slate-600">
                            Three simple steps to get your documents signed.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10" />

                        <div className="relative flex flex-col items-center text-center">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white border-4 border-[#F5F7F4] shadow-sm mb-6">
                                <Upload className="h-10 w-10 text-[#283718]" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">1. Upload & Configure</h3>
                            <p className="text-slate-600">Upload your PDF and drag-and-drop fields for signature, text, or dates.</p>
                        </div>
                        <div className="relative flex flex-col items-center text-center">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white border-4 border-[#F5F7F4] shadow-sm mb-6">
                                <Send className="h-10 w-10 text-[#283718]" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">2. Send & Track</h3>
                            <p className="text-slate-600">Send to recipients via email and track status in real-time.</p>
                        </div>
                        <div className="relative flex flex-col items-center text-center">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white border-4 border-green-50 shadow-sm mb-6">
                                <FileCheck className="h-10 w-10 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">3. Signed & Stored</h3>
                            <p className="text-slate-600">Parties sign on any device. Documents are securely stored.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Built for every use case
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <UseCaseCard title="Sales Contracts" description="Close deals faster with embedded signing in your CRM." />
                        <UseCaseCard title="HR Onboarding" description="Automate offer letters and employee handbooks." />
                        <UseCaseCard title="Real Estate" description="Securely sign lease agreements and purchase contracts." />
                        <UseCaseCard title="Freelance Quotes" description="Get quotes approved and signed instantly." />
                        <UseCaseCard title="NDAs" description="Protect your IP with quick, legally binding NDAs." />
                        <UseCaseCard title="Permission Slips" description="Collect signatures from parents or guardians easily." />
                    </div>
                </div>
            </section>

            {/* Code Example Section */}
            <section className="py-24 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Integrate in minutes
                        </h2>
                        <p className="mt-4 text-lg text-slate-600">
                            Simple, intuitive API designed for developers.
                        </p>
                    </div>

                    <div className="mx-auto max-w-4xl">
                        <Tabs defaultValue="js" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-8">
                                <TabsTrigger value="js">JavaScript</TabsTrigger>
                                <TabsTrigger value="python">Python</TabsTrigger>
                                <TabsTrigger value="curl">cURL</TabsTrigger>
                            </TabsList>
                            <TabsContent value="js">
                                <Card className="bg-slate-900 border-slate-800">
                                    <CardContent className="pt-6">
                                        <pre className="overflow-x-auto p-4">
                                            <code className="text-sm text-slate-50 font-mono">
                                                {`import { QuillKit } from '@quillkit/sdk';

const client = new QuillKit('qk_live_xxxxx');

const doc = await client.documents.create({
  file: 'contract.pdf',
  recipients: [
    { email: 'client@email.com', name: 'John Doe' }
  ],
  fields: {
    signature: { page: 1, x: 100, y: 500 }
  }
});

await doc.send();`}
                                            </code>
                                        </pre>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="python">
                                <Card className="bg-slate-900 border-slate-800">
                                    <CardContent className="pt-6">
                                        <pre className="overflow-x-auto p-4">
                                            <code className="text-sm text-slate-50 font-mono">
                                                {`from quillkit import QuillKit

client = QuillKit('qk_live_xxxxx')

doc = client.documents.create(
    file='contract.pdf',
    recipients=[
        {'email': 'client@email.com', 'name': 'John Doe'}
    ]
)

doc.send()`}
                                            </code>
                                        </pre>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="curl">
                                <Card className="bg-slate-900 border-slate-800">
                                    <CardContent className="pt-6">
                                        <pre className="overflow-x-auto p-4">
                                            <code className="text-sm text-slate-50 font-mono">
                                                {`curl -X POST https://api.docflow.io/v1/documents \\
  -H "Authorization: Bearer df_live_xxxxx" \\
  -F "file=@contract.pdf" \\
  -F "recipients[0][email]=client@email.com"`}
                                            </code>
                                        </pre>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Why developers choose QuillKit
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-100">
                                    <th className="py-4 px-6 text-slate-500 font-medium">Feature</th>
                                    <th className="py-4 px-6 text-[#283718] font-bold text-lg bg-[#F5F7F4]/50 rounded-t-lg">QuillKit</th>
                                    <th className="py-4 px-6 text-slate-500 font-medium">DocuSign API</th>
                                    <th className="py-4 px-6 text-slate-500 font-medium">HelloSign API</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600">
                                <tr className="border-b border-slate-50">
                                    <td className="py-4 px-6 font-medium text-slate-900">Open Source</td>
                                    <td className="py-4 px-6 bg-[#F5F7F4]/30"><Check className="h-5 w-5 text-green-500" /></td>
                                    <td className="py-4 px-6"><div className="h-px w-4 bg-slate-300" /></td>
                                    <td className="py-4 px-6"><div className="h-px w-4 bg-slate-300" /></td>
                                </tr>
                                <tr className="border-b border-slate-50">
                                    <td className="py-4 px-6 font-medium text-slate-900">Self-Hostable</td>
                                    <td className="py-4 px-6 bg-[#F5F7F4]/30"><Check className="h-5 w-5 text-green-500" /></td>
                                    <td className="py-4 px-6"><div className="h-px w-4 bg-slate-300" /></td>
                                    <td className="py-4 px-6"><div className="h-px w-4 bg-slate-300" /></td>
                                </tr>
                                <tr className="border-b border-slate-50">
                                    <td className="py-4 px-6 font-medium text-slate-900">Unlimited Free Test Mode</td>
                                    <td className="py-4 px-6 bg-[#F5F7F4]/30"><Check className="h-5 w-5 text-green-500" /></td>
                                    <td className="py-4 px-6"><Check className="h-5 w-5 text-green-500" /></td>
                                    <td className="py-4 px-6"><Check className="h-5 w-5 text-green-500" /></td>
                                </tr>
                                <tr className="border-b border-slate-50">
                                    <td className="py-4 px-6 font-medium text-slate-900">Custom Branding</td>
                                    <td className="py-4 px-6 bg-[#F5F7F4]/30"><Check className="h-5 w-5 text-green-500" /></td>
                                    <td className="py-4 px-6">$$$</td>
                                    <td className="py-4 px-6">$$$</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-24 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Loved by developers
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="bg-white border-none shadow-sm">
                            <CardContent className="pt-6">
                                <div className="flex gap-1 text-amber-500 mb-4">
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                </div>
                                <p className="text-slate-600 mb-6">"Finally an e-signature solution that feels like it was built for 2024. The API is a joy to work with."</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-200" />
                                    <div>
                                        <p className="font-semibold text-sm text-slate-900">Alex Chen</p>
                                        <p className="text-xs text-slate-500">CTO at TechFlow</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-none shadow-sm">
                            <CardContent className="pt-6">
                                <div className="flex gap-1 text-amber-500 mb-4">
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                </div>
                                <p className="text-slate-600 mb-6">"We migrated from DocuSign and saved 80% on our monthly bill while getting better customization."</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-200" />
                                    <div>
                                        <p className="font-semibold text-sm text-slate-900">Sarah Jones</p>
                                        <p className="text-xs text-slate-500">Product Manager</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-none shadow-sm">
                            <CardContent className="pt-6">
                                <div className="flex gap-1 text-amber-500 mb-4">
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                </div>
                                <p className="text-slate-600 mb-6">"The open source nature gives us peace of mind. We can always self-host if we need to."</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-200" />
                                    <div>
                                        <p className="font-semibold text-sm text-slate-900">Mike Smith</p>
                                        <p className="text-xs text-slate-500">DevOps Engineer</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                            Simple, transparent pricing
                        </h2>
                        <p className="mt-4 text-lg text-slate-600">
                            Start free, scale as you grow
                        </p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="mx-auto max-w-6xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Free Plan */}
                            <div className="relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition">
                                <h3 className="text-lg font-semibold text-slate-900">Free</h3>
                                <p className="mt-2 text-sm text-slate-600">Perfect for trying out</p>
                                <p className="mt-6">
                                    <span className="text-4xl font-bold text-slate-900">$0</span>
                                    <span className="text-sm text-slate-600">/month</span>
                                </p>
                                <ul className="mt-8 space-y-3 text-sm">
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">3 documents/month</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">Web interface</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">Email support</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                                        <span className="text-slate-700">Watermark included</span>
                                    </li>
                                </ul>
                                <Link href="/signup" className="mt-8 block w-full rounded-lg bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-900 hover:bg-slate-200 transition">
                                    Start Free
                                </Link>
                            </div>

                            {/* Starter Plan */}
                            <div className="relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition">
                                <h3 className="text-lg font-semibold text-slate-900">Starter</h3>
                                <p className="mt-2 text-sm text-slate-600">For small teams</p>
                                <p className="mt-6">
                                    <span className="text-4xl font-bold text-slate-900">$10</span>
                                    <span className="text-sm text-slate-600">/month</span>
                                </p>
                                <ul className="mt-8 space-y-3 text-sm">
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">10 documents included</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">$1.50 per extra doc</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">No watermark</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">90-day storage</span>
                                    </li>
                                </ul>
                                <Link href="/signup?plan=starter" className="mt-8 block w-full rounded-lg bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800 transition">
                                    Start Trial
                                </Link>
                            </div>

                            {/* Pro Plan (Highlighted) */}
                            <div className="relative rounded-2xl bg-gradient-to-b from-[#F5F7F4] to-[#F5F7F4] p-8 shadow-lg ring-2 ring-[#283718] hover:shadow-xl transition">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#283718] px-3 py-1 text-xs font-semibold text-white">
                                        <Star className="h-3 w-3 fill-current" />
                                        Popular
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">Pro</h3>
                                <p className="mt-2 text-sm text-slate-600">For growing businesses</p>
                                <p className="mt-6">
                                    <span className="text-4xl font-bold text-slate-900">$30</span>
                                    <span className="text-sm text-slate-600">/month</span>
                                </p>
                                <ul className="mt-8 space-y-3 text-sm">
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">Unlimited web documents</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">100 API docs/month</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">Webhooks</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">Custom branding</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">Priority support</span>
                                    </li>
                                </ul>
                                <Link href="/signup?plan=pro" className="mt-8 block w-full rounded-lg bg-[#283718] px-4 py-3 text-center text-sm font-semibold text-white shadow-md hover:bg-[#4A6247] hover:shadow-lg transition">
                                    Start Trial
                                </Link>
                            </div>

                            {/* Enterprise Plan */}
                            <div className="relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition">
                                <h3 className="text-lg font-semibold text-slate-900">Enterprise</h3>
                                <p className="mt-2 text-sm text-slate-600">For large organizations</p>
                                <p className="mt-6">
                                    <span className="text-4xl font-bold text-slate-900">Custom</span>
                                </p>
                                <ul className="mt-8 space-y-3 text-sm">
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">Everything in Pro</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">Unlimited API docs</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">White-label</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">SSO/SAML</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">SLA 99.9%</span>
                                    </li>
                                </ul>
                                <Link href="mailto:sales@docflow.io" className="mt-8 block w-full rounded-lg bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800 transition">
                                    Contact Sales
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Frequently asked questions
                        </h2>
                    </div>
                    <div className="mx-auto max-w-3xl grid gap-8">
                        <div className="p-6 rounded-2xl bg-slate-50">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Is QuillKit really open source?</h3>
                            <p className="text-slate-600">Yes! You can self-host the entire platform for free. The source code is available on GitHub under the MIT license.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-50">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">How does the pricing work?</h3>
                            <p className="text-slate-600">We offer a generous free tier for getting started. Our paid plans scale with your usage, so you only pay for what you need.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-50">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Is my data secure?</h3>
                            <p className="text-slate-600">Absolutely. We use industry-standard encryption for all data at rest and in transit. We are working towards SOC2 compliance.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-50">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Can I use my own branding?</h3>
                            <p className="text-slate-600">Yes, our Pro and Enterprise plans allow you to fully customize the signing experience with your own logo, colors, and domain.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Ready to add signatures?
                        </h2>
                        <p className="max-w-[85%] leading-normal text-slate-600 sm:text-lg sm:leading-7">
                            Join 500+ developers building with QuillKit today.
                        </p>
                        <Link href="/signup">
                            <Button size="lg" className="h-11 px-8 bg-[#283718] hover:bg-[#4A6247] text-white">Start Building Free</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-12 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
                        <img src="/quillkit-logo.png" alt="QuillKit" className="h-6 w-6 object-contain" />
                        <p className="text-center text-sm leading-loose text-slate-600 md:text-left">
                            Built by <Link href="/" className="font-medium underline underline-offset-4 text-slate-900">QuillKit</Link>.
                            The source code is available on <Link href="https://github.com/docflow/docflow" target="_blank" className="font-medium underline underline-offset-4 text-slate-900">GitHub</Link>.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="relative p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
    );
}

function UseCaseCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="p-6 rounded-xl border bg-slate-50 hover:bg-white hover:shadow-md transition-all">
            <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-600">{description}</p>
        </div>
    )
}
