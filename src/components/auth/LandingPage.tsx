"use client"

import { signIn } from "next-auth/react"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layout } from "lucide-react"

export function LandingPage({ onTryDemo }: { onTryDemo: () => void }) {
    return (
        <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-500/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-4xl w-full text-center z-10"
            >
                {/* Logo / Badge */}
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 mb-8"
                >
                    <Sparkles size={14} className="text-blue-500" />
                    <span className="text-xs font-semibold tracking-wide uppercase text-zinc-600 ">Introducing Cognify V2</span>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6">
                    Chat-in, <span className="text-blue-600 ">UX-out.</span>
                </h1>

                <p className="text-xl text-zinc-600 max-w-2xl mx-auto mb-12 leading-relaxed">
                    Stop chatting with text. Start generating interactive experiences.
                    Cognify builds dashboards, wikis, and tools dynamically based on your intent.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => signIn("google")}
                        className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl shadow-zinc-500/20"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        Sign in with Google
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={onTryDemo}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-zinc-900 font-bold rounded-2xl border border-zinc-200 hover:bg-zinc-50 transition-all duration-200"
                    >
                        Try Demo
                    </button>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
                    <div className="p-6 rounded-2xl border border-zinc-100 bg-white/50 backdrop-blur-sm">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                            <Zap size={20} className="text-blue-600 " />
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-zinc-900 ">Instant UX</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            Generate full-blown interactive interfaces in seconds, not hours.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl border border-zinc-100 bg-white/50 backdrop-blur-sm">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-4">
                            <Layout size={20} className="text-purple-600 " />
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-zinc-900 ">Deterministic</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            Structured Output ensures components always render exactly as planned.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl border border-zinc-100 bg-white/50 backdrop-blur-sm">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                            <ShieldCheck size={20} className="text-emerald-600 " />
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-zinc-900 ">Enterprise Ready</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            Rate limiting, safety validation, and persistent user sessions included.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Footer */}
            <footer className="mt-24 text-zinc-400 text-xs font-medium">
                © 2026 Cognify AI Labs. All rights reserved.
            </footer>
        </div>
    )
}
