import type { Metadata } from "next";
import { Inter, Dancing_Script } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const dancingScript = Dancing_Script({ subsets: ["latin"], variable: "--font-signature" });

export const metadata: Metadata = {
    title: "QuillKit - Document Signing for Developers",
    description: "The fastest way to add document signing to your application. Developer-friendly API, white-label ready.",
};

import { Toaster } from "@/components/ui/toaster";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable, dancingScript.variable)}>
                <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
                    {children}
                </div>
                <Toaster />
            </body>
        </html>
    );
}
