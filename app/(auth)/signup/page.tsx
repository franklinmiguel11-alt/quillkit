import Link from "next/link";
import { FileText } from "lucide-react";
import { signup } from "../actions";

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-2">
                            <img src="/quillkit-logo.png" alt="QuillKit" className="h-12 w-12 object-contain" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-[#283718] to-[#4A6247] bg-clip-text text-transparent">
                                QuillKit
                            </span>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-[#283718] hover:text-[#283718]">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form action={signup} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                Full name
                            </label>
                            <input
                                id="name"
                                name="full_name"
                                type="text"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#283718] focus:outline-none focus:ring-2 focus:ring-[#283718]/20 transition"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#283718] focus:outline-none focus:ring-2 focus:ring-[#283718]/20 transition"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#283718] focus:outline-none focus:ring-2 focus:ring-[#283718]/20 transition"
                                placeholder="••••••••"
                            />
                            <p className="mt-2 text-xs text-slate-500">Must be at least 8 characters</p>
                        </div>

                        <div className="flex items-start">
                            <input
                                id="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 rounded border-slate-300 text-[#283718] focus:ring-2 focus:ring-[#283718]/20"
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-slate-600">
                                I agree to the{" "}
                                <Link href="/terms" className="font-medium text-[#283718] hover:text-[#283718]">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="font-medium text-[#283718] hover:text-[#283718]">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-[#283718] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#4A6247] focus:outline-none focus:ring-2 focus:ring-[#283718]/50 transition"
                        >
                            Create account
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-4 text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Signup */}
                    <button className="w-full flex items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500/20 transition">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign up with Google
                    </button>
                </div>
            </div>
        </div>
    );
}
