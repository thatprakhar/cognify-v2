"use client"

import { Activity, ArrowRight, BarChart3, Database, Layers, CheckCircle2, CheckSquare, GitBranch, ShieldCheck, Box } from "lucide-react"

export function LandingPage({ onTryDemo }: { onTryDemo: () => void }) {
    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] font-sans text-zinc-900 selection:bg-zinc-200">
            {/* ── NAV ── */}
            <nav className="w-full border-b border-zinc-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Box className="w-5 h-5 text-zinc-900" />
                        <span className="text-lg font-bold tracking-tight">Outform</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={onTryDemo} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Documentation</button>
                        <button onClick={onTryDemo} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Sign in</button>
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="relative w-full pt-32 pb-24 px-6 overflow-hidden">
                {/* Architectural Grid Background */}
                <div className="absolute inset-0 bg-[#FAFAFA] bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

                <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold tracking-wide text-zinc-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> v2.0 Engine Live
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1] mb-6">
                        Turn complex questions into <br /> interactive systems.
                    </h1>

                    <p className="text-lg text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        Generate structured, validated dashboards, diagrams, and learning modules from natural language. Secure, deterministic, and enterprise-ready.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={onTryDemo}
                            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-colors"
                        >
                            See Examples
                        </button>
                        <button
                            onClick={onTryDemo}
                            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-zinc-50 text-zinc-900 text-sm font-semibold rounded-lg border border-zinc-200 shadow-sm transition-colors"
                        >
                            Request Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* ── IMMEDIATE PROOF (3-COLUMN STRIP) ── */}
            <section className="w-full px-6 pb-32">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Mock 1: Interactive Science */}
                    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[320px]">
                        <div className="p-4 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
                            <Layers className="w-4 h-4 text-zinc-400" />
                            <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Physics Module</span>
                        </div>
                        <div className="flex-1 p-6 flex flex-col items-center justify-center bg-[#FAFAFA] relative overflow-hidden group">
                            {/* Static Mock UI */}
                            <div className="w-full max-w-[200px] bg-white border border-zinc-200 rounded-lg p-3 shadow-sm transform transition-transform group-hover:-translate-y-1">
                                <div className="h-2 w-1/3 bg-zinc-200 rounded-full mb-3" />
                                <div className="w-full h-24 border border-zinc-100 rounded bg-zinc-50 flex items-center justify-center mb-3 relative">
                                    {/* Optics Diagram Mock */}
                                    <div className="absolute inset-x-0 h-0.5 bg-zinc-200/50 top-1/2" />
                                    <div className="w-2 h-16 bg-blue-500 rounded-full" />
                                    <div className="w-16 h-px bg-blue-300 absolute left-4 top-1/4 -rotate-12" />
                                    <div className="w-16 h-px bg-blue-300 absolute right-4 top-3/4 -rotate-12" />
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-4 h-4 rounded-sm border border-zinc-200 bg-zinc-100" />
                                    <div className="h-4 w-3/4 bg-zinc-100 rounded-sm" />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-white border-t border-zinc-100">
                            <p className="text-sm font-medium text-zinc-900">Interactive ray diagrams + structured quizzes.</p>
                        </div>
                    </div>

                    {/* Mock 2: Architecture */}
                    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[320px]">
                        <div className="p-4 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
                            <GitBranch className="w-4 h-4 text-zinc-400" />
                            <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Systems Architecture</span>
                        </div>
                        <div className="flex-1 p-6 flex items-center justify-center bg-[#FAFAFA] group">
                            {/* Flowchart Mock */}
                            <div className="flex flex-col items-center gap-3 transform transition-transform group-hover:scale-105">
                                <div className="px-4 py-2 bg-white border border-zinc-300 rounded text-[10px] font-mono font-medium shadow-sm">Client Request</div>
                                <div className="w-px h-6 bg-zinc-300 relative">
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-r-2 border-b-2 border-zinc-300 rotate-45" />
                                </div>
                                <div className="flex gap-4">
                                    <div className="px-4 py-2 bg-zinc-100 border border-zinc-200 rounded text-[10px] font-mono text-zinc-500">Cache</div>
                                    <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded text-[10px] font-mono text-blue-700 font-semibold shadow-sm">Load Balancer</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-white border-t border-zinc-100">
                            <p className="text-sm font-medium text-zinc-900">Deterministic Mermaid-style flowcharts & nodes.</p>
                        </div>
                    </div>

                    {/* Mock 3: Data Dashboard */}
                    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[320px]">
                        <div className="p-4 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
                            <BarChart3 className="w-4 h-4 text-zinc-400" />
                            <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Data Dashboard</span>
                        </div>
                        <div className="flex-1 p-6 flex flex-col items-center justify-center bg-[#FAFAFA] group">
                            {/* Dashboard Mock */}
                            <div className="w-full max-w-[200px] grid grid-cols-2 gap-2 transform transition-transform group-hover:-translate-y-1">
                                <div className="bg-white border border-zinc-200 p-2 rounded-lg shadow-sm">
                                    <div className="text-[10px] text-zinc-400 mb-1">MRR</div>
                                    <div className="text-sm font-bold">$124k</div>
                                </div>
                                <div className="bg-white border border-zinc-200 p-2 rounded-lg shadow-sm">
                                    <div className="text-[10px] text-zinc-400 mb-1">Active</div>
                                    <div className="text-sm font-bold">14.2k</div>
                                </div>
                                <div className="col-span-2 bg-white border border-zinc-200 p-3 rounded-lg shadow-sm h-20 flex items-end gap-1 justify-between">
                                    {[30, 45, 25, 60, 50, 80, 65].map((h, i) => (
                                        <div key={i} className="w-full bg-blue-100 rounded-t-sm relative" style={{ height: `${h}%` }}>
                                            <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm" style={{ height: `${Math.max(20, h - 20)}%` }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-white border-t border-zinc-100">
                            <p className="text-sm font-medium text-zinc-900">Recharts integration with dynamic insights.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="w-full py-24 bg-white border-y border-zinc-200">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-2">How it works</h2>
                        <p className="text-zinc-500">A deterministic pipeline entirely separated from raw LLM output.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col gap-4 relative">
                            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-bold font-mono">1</div>
                            <h3 className="font-semibold text-zinc-900">Ask a question</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed">Natural language inputs are ingested as standard raw queries via secure API bindings.</p>
                            <ArrowRight className="absolute top-2 -right-4 text-zinc-300 hidden md:block" />
                        </div>
                        <div className="flex flex-col gap-4 relative">
                            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-bold font-mono">2</div>
                            <h3 className="font-semibold text-zinc-900">Intent is classified</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed">An upstream router maps the query to explicit schema targets (e.g. `intent: "diagram"`).</p>
                            <ArrowRight className="absolute top-2 -right-4 text-zinc-300 hidden md:block" />
                        </div>
                        <div className="flex flex-col gap-4 relative">
                            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-bold font-mono text-blue-600">3</div>
                            <h3 className="font-semibold text-zinc-900">Spec is rendered</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed">A validated JSON UI specification is streamed to the deterministic frontend React tree.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── DIFFERENTIATOR ── */}
            <section className="w-full py-24 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row gap-16 items-center">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">Not another AI wrapper.</h2>
                        <ul className="space-y-4">
                            {[
                                "No raw HTML execution",
                                "Strict JSON contracts & Zod validation",
                                "Allowlisted UI components only",
                                "Deterministic React rendering pipeline",
                                "Versioned output specs (v1.0)"
                            ].map((text, i) => (
                                <li key={i} className="flex items-center gap-3 text-zinc-600">
                                    <CheckCircle2 className="w-5 h-5 text-zinc-900 shrink-0" />
                                    <span className="font-medium text-sm">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex-1 w-full bg-zinc-900 rounded-xl p-6 shadow-2xl overflow-hidden border border-zinc-800">
                        {/* Fake Code Block */}
                        <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed overflow-x-auto">
                            <code className="block text-zinc-500 mb-2">// Generated Payload</code>
                            <span className="text-blue-400">{"{"}</span>{"\n"}
                            {"  "}<span className="text-blue-300">"version"</span>: <span className="text-emerald-300">"1.0"</span>,{"\n"}
                            {"  "}<span className="text-blue-300">"root"</span>: {"{"}{"\n"}
                            {"    "}<span className="text-blue-300">"type"</span>: <span className="text-emerald-300">"Dashboard"</span>,{"\n"}
                            {"    "}<span className="text-blue-300">"props"</span>: {"{"}{"\n"}
                            {"      "}<span className="text-blue-300">"metrics"</span>: [...],{"\n"}
                            {"      "}<span className="text-blue-300">"series"</span>: [...]{"\n"}
                            {"    "}{"}"}{"\n"}
                            {"  "}{"}"}{"\n"}
                            <span className="text-blue-400">{"}"}</span>
                        </pre>
                    </div>
                </div>
            </section>

            {/* ── PILLARS ── */}
            <section className="w-full py-24 bg-white border-y border-zinc-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-8 border border-zinc-200 rounded-xl bg-zinc-50 hover:bg-white transition-colors cursor-pointer group">
                            <Layers className="w-6 h-6 text-zinc-900 mb-4" />
                            <h3 className="text-lg font-bold text-zinc-900 mb-2">Interactive Science</h3>
                            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">Complex physical, chemical, or biological relationships generated automatically as interactive ray-diagrams, molecular explorers, and structured accordions.</p>
                            <span className="text-sm font-semibold text-zinc-900 group-hover:underline">View Example →</span>
                        </div>
                        <div className="p-8 border border-zinc-200 rounded-xl bg-zinc-50 hover:bg-white transition-colors cursor-pointer group">
                            <GitBranch className="w-6 h-6 text-zinc-900 mb-4" />
                            <h3 className="text-lg font-bold text-zinc-900 mb-2">Systems Architecture</h3>
                            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">Turn ambiguous structural dependencies into strict, zoomable web architectures, sequence diagrams, and class entity modules.</p>
                            <span className="text-sm font-semibold text-zinc-900 group-hover:underline">View Example →</span>
                        </div>
                        <div className="p-8 border border-zinc-200 rounded-xl bg-zinc-50 hover:bg-white transition-colors cursor-pointer group">
                            <BarChart3 className="w-6 h-6 text-zinc-900 mb-4" />
                            <h3 className="text-lg font-bold text-zinc-900 mb-2">Data Analysis</h3>
                            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">Parse high-volume CSV or JSON feeds directly into unified management dashboards, complete with top-level MRR/anomaly metrics.</p>
                            <span className="text-sm font-semibold text-zinc-900 group-hover:underline">View Example →</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ENTERPRISE READINESS ── */}
            <section className="w-full py-24 bg-[#FAFAFA]">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <ShieldCheck className="w-10 h-10 text-zinc-900 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">Built for teams that need control.</h2>
                    <p className="text-zinc-500 mb-10 max-w-xl mx-auto leading-relaxed">
                        Outform runs on a custom multi-agent routing topography (LangGraph) enforcing absolute contract adherence before rendering a single pixel.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                        <div className="bg-white p-4 border border-zinc-200 rounded-lg">
                            <CheckSquare className="w-4 h-4 text-zinc-400 mb-2" />
                            <div className="font-semibold text-sm text-zinc-900">Schema Validation</div>
                        </div>
                        <div className="bg-white p-4 border border-zinc-200 rounded-lg">
                            <Activity className="w-4 h-4 text-zinc-400 mb-2" />
                            <div className="font-semibold text-sm text-zinc-900">Observability Hooks</div>
                        </div>
                        <div className="bg-white p-4 border border-zinc-200 rounded-lg">
                            <Database className="w-4 h-4 text-zinc-400 mb-2" />
                            <div className="font-semibold text-sm text-zinc-900">Versioned Output</div>
                        </div>
                        <div className="bg-white p-4 border border-zinc-200 rounded-lg">
                            <Layers className="w-4 h-4 text-zinc-400 mb-2" />
                            <div className="font-semibold text-sm text-zinc-900">Safe Rendering</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="w-full bg-white border-t border-zinc-200 py-8 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Box className="w-4 h-4 text-zinc-400" />
                        <span className="text-zinc-500 text-xs font-semibold">Outform Engine</span>
                    </div>
                    <span className="text-zinc-400 text-xs text-center">Deterministic Structural Generation.</span>
                </div>
            </footer>
        </div>
    )
}
