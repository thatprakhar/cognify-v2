"use client"

import { motion } from "framer-motion"
import { ArrowRight, MessageSquare, Layers, Sparkles, BarChart3, BookOpen, ListChecks } from "lucide-react"

export function LandingPage({ onTryDemo }: { onTryDemo: () => void }) {
    return (
        <div className="min-h-screen w-full bg-white flex flex-col">
            {/* ── NAV ── */}
            <nav className="w-full flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
                <span className="text-xl font-bold tracking-tight text-zinc-900">Outform</span>
                <button
                    onClick={onTryDemo}
                    className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                    Sign in
                </button>
            </nav>

            {/* ── HERO ── */}
            <section className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-20 max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h1 className="text-5xl md:text-[3.5rem] lg:text-[4rem] font-bold tracking-tight text-zinc-900 leading-[1.1] mb-6">
                        Ask anything.<br />
                        <span className="text-blue-600">Get interactive answers.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Outform doesn't reply with text. It builds rich, interactive experiences — dashboards, wikis, quizzes — tailored to your question.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                        <button
                            onClick={onTryDemo}
                            className="group flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl shadow-zinc-500/20"
                        >
                            <MessageSquare size={18} />
                            Try It Now
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={onTryDemo}
                            className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-zinc-900 font-bold rounded-2xl border border-zinc-200 hover:bg-zinc-50 transition-all duration-200"
                        >
                            See Live Demo
                        </button>
                    </div>

                    <p className="text-sm text-zinc-400">No account required.</p>
                </motion.div>
            </section>

            {/* ── TRANSFORMATION SECTION ── */}
            <section className="w-full bg-zinc-50/80 border-y border-zinc-100 py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-center text-3xl font-bold text-zinc-900 mb-16 tracking-tight">
                            From a question to a full experience
                        </h2>

                        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                            {/* Left: Question */}
                            <div className="flex-1 w-full">
                                <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">You ask</div>
                                <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <MessageSquare size={16} className="text-zinc-500" />
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-medium text-zinc-800 leading-relaxed">
                                                "How does photosynthesis work?"
                                            </p>
                                            <p className="text-sm text-zinc-400 mt-2">or any question — technical, creative, analytical</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="flex-shrink-0 flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                                    <ArrowRight size={20} className="text-white" />
                                </div>
                                <span className="text-[11px] font-semibold uppercase tracking-widest text-blue-600">Becomes</span>
                            </div>

                            {/* Right: Interactive Experience */}
                            <div className="flex-1 w-full">
                                <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">You get</div>
                                <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
                                    <img
                                        src="/answer-engine-mock.png"
                                        alt="Interactive visual answer with diagrams, sections, and key facts"
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="w-full py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-center text-3xl font-bold text-zinc-900 mb-14 tracking-tight">
                            Three steps. That's it.
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[
                                { step: "01", icon: MessageSquare, label: "Ask your question", color: "bg-blue-50 text-blue-600" },
                                { step: "02", icon: Sparkles, label: "We analyze and structure", color: "bg-amber-50 text-amber-600" },
                                { step: "03", icon: Layers, label: "Get an interactive experience", color: "bg-emerald-50 text-emerald-600" },
                            ].map(({ step, icon: Icon, label, color }) => (
                                <div key={step} className="flex flex-col items-center text-center">
                                    <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-300 mb-4">{step}</div>
                                    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-5`}>
                                        <Icon size={24} />
                                    </div>
                                    <p className="text-[15px] font-semibold text-zinc-800">{label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── WHAT YOU GET ── */}
            <section className="w-full bg-zinc-50/80 border-y border-zinc-100 py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-center text-3xl font-bold text-zinc-900 mb-14 tracking-tight">
                            Not just text. Real experiences.
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                { icon: BookOpen, title: "Visual Wikis", desc: "Structured, explorable knowledge", color: "text-blue-600 bg-blue-50" },
                                { icon: BarChart3, title: "Live Dashboards", desc: "Charts and data at a glance", color: "text-emerald-600 bg-emerald-50" },
                                { icon: ListChecks, title: "Interactive Quizzes", desc: "Test understanding, not memory", color: "text-amber-600 bg-amber-50" },
                                { icon: Layers, title: "Smart Layouts", desc: "Tailored to your question", color: "text-violet-600 bg-violet-50" },
                            ].map(({ icon: Icon, title, desc, color }) => (
                                <div key={title} className="bg-white border border-zinc-200/80 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                                    <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mx-auto mb-4`}>
                                        <Icon size={20} />
                                    </div>
                                    <h3 className="font-bold text-[15px] text-zinc-900 mb-1">{title}</h3>
                                    <p className="text-sm text-zinc-500">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── SOCIAL PROOF ── */}
            <section className="w-full py-16 px-6 text-center">
                <p className="text-xl md:text-2xl font-semibold text-zinc-800 max-w-xl mx-auto leading-relaxed tracking-tight">
                    Built for people who want answers,<br />not more reading.
                </p>
            </section>

            {/* ── BOTTOM CTA ── */}
            <section className="w-full pb-20 px-6 text-center">
                <button
                    onClick={onTryDemo}
                    className="group inline-flex items-center justify-center gap-3 px-10 py-4 bg-zinc-900 text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl shadow-zinc-500/20"
                >
                    <MessageSquare size={18} />
                    Try It Now
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-sm text-zinc-400 mt-4">No account required.</p>
            </section>

            {/* ── FOOTER ── */}
            <footer className="w-full border-t border-zinc-100 py-8 px-8 flex items-center justify-between max-w-6xl mx-auto">
                <span className="text-zinc-400 text-xs font-medium">© 2026 Outform. All rights reserved.</span>
                <span className="text-zinc-300 text-xs">Ask → Experience → Understand.</span>
            </footer>
        </div>
    )
}
