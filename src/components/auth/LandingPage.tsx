"use client"

import React, { useState, useEffect } from 'react';
import { Box, Layers, GitBranch, BarChart3, Database, ShieldCheck, CheckSquare, Activity, ArrowRight, X } from "lucide-react"

const PLACEHOLDERS = [
    "Design a scalable notification system.",
    "Explain nuclear fusion.",
    "Compare Kafka vs RabbitMQ.",
    "Project my net worth for 10 years."
];

export function LandingPage({ onTryDemo }: { onTryDemo: () => void }) {
    const [placeholderIdx, setPlaceholderIdx] = useState(0);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onTryDemo();
    };

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
            <section className="relative w-full pt-32 pb-20 px-6 overflow-hidden flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-[#FAFAFA] bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1] mb-6 max-w-4xl mx-auto">
                    Turn your ideas into <br /> interactive systems.
                </h1>

                <p className="text-lg text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                    Ask a complex question. Get a structured, visual, interactive experience.
                </p>

                {/* Main Input Interaction */}
                <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8 relative group">
                    <div className="absolute -inset-0.5 bg-zinc-200 rounded-xl blur opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 hidden" />
                    <div className="relative flex items-center w-full bg-white border-2 border-zinc-200 rounded-xl shadow-sm focus-within:border-zinc-900 focus-within:ring-4 focus-within:ring-zinc-100 transition-all duration-200 overflow-hidden">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={PLACEHOLDERS[placeholderIdx]}
                            className="w-full h-16 pl-6 pr-32 text-lg text-zinc-900 bg-transparent outline-none placeholder:text-zinc-400 transition-all duration-500"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 px-6 py-2.5 h-12 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
                        >
                            Generate
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </form>

                <div className="flex items-center justify-center gap-4 text-sm">
                    <span className="text-zinc-500 font-medium">Or try:</span>
                    <button onClick={onTryDemo} className="text-zinc-600 font-semibold hover:text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors">See Examples</button>
                </div>
            </section>

            {/* ── LIVE OUTPUT PREVIEW ── */}
            <section className="w-full px-6 pb-32 pt-8">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold tracking-wide text-zinc-600 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-zinc-400" /> Example: "Design a scalable ride-sharing platform."
                        </div>
                    </div>

                    {/* Mock Interface showing system output */}
                    <div className="bg-white rounded-2xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                        {/* Sidebar / TOC */}
                        <div className="w-full md:w-64 bg-zinc-50/50 border-r border-zinc-200 p-6 flex flex-col gap-6">
                            <div>
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Architecture</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm font-semibold text-zinc-900 bg-white p-2 border border-zinc-200 rounded-md shadow-sm">
                                        <GitBranch className="w-4 h-4 text-blue-500" /> System Map
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 p-2 cursor-not-allowed">
                                        <Database className="w-4 h-4 text-zinc-400" /> Data Models
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Evaluation</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 p-2 cursor-not-allowed">
                                        <BarChart3 className="w-4 h-4 text-zinc-400" /> Tradeoff Matrix
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 p-2 cursor-not-allowed">
                                        <ShieldCheck className="w-4 h-4 text-zinc-400" /> Risk Assessment
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Stage */}
                        <div className="flex-1 p-8 bg-[#FAFAFA] relative">
                            <div className="mb-8 border-b border-zinc-200 pb-6">
                                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Ride-Sharing Platform Architecture</h2>
                                <p className="text-zinc-500">High-level system design targeting 10M+ daily active riders, focusing on geospatial routing and real-time dispatch.</p>
                            </div>

                            {/* Fake Diagram Area */}
                            <div className="w-full h-64 bg-white border border-dashed border-zinc-300 rounded-xl mb-8 flex items-center justify-center relative overflow-hidden">
                                {/* Simulated elements of an architecture diagram */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:20px_20px]" />

                                <div className="relative z-10 flex gap-12 items-center">
                                    <div className="flex flex-col gap-4">
                                        <div className="px-4 py-3 bg-white border border-zinc-200 rounded-lg shadow-sm text-xs font-mono font-semibold text-zinc-700 flex items-center justify-center min-w-[120px]">Rider App</div>
                                        <div className="px-4 py-3 bg-white border border-zinc-200 rounded-lg shadow-sm text-xs font-mono font-semibold text-zinc-700 flex items-center justify-center min-w-[120px]">Driver App</div>
                                    </div>

                                    <div className="w-16 h-px bg-zinc-300 relative">
                                        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-zinc-400 rotate-45" />
                                    </div>

                                    <div className="px-6 py-6 bg-blue-50 border-2 border-blue-200 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2">
                                        <div className="text-xs font-bold text-blue-800 uppercase tracking-widest">API Gateway</div>
                                        <div className="text-[10px] text-blue-600 font-mono">Rate Limiting • Auth</div>
                                    </div>

                                    <div className="w-16 h-px bg-zinc-300 relative">
                                        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-zinc-400 rotate-45" />
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="px-6 py-4 bg-white border border-zinc-200 rounded-lg shadow-sm text-xs font-semibold text-zinc-900 flex flex-col items-center">
                                            Dispatch Service
                                            <span className="text-[10px] font-mono text-zinc-500 font-normal mt-1">QuadTree / Redis</span>
                                        </div>
                                        <div className="px-6 py-4 bg-white border border-zinc-200 rounded-lg shadow-sm text-xs font-semibold text-zinc-900 flex flex-col items-center">
                                            Pricing Engine
                                            <span className="text-[10px] font-mono text-zinc-500 font-normal mt-1">Kafka / ML Models</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fake Modular Details */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white p-5 border border-zinc-200 rounded-xl shadow-sm">
                                    <h4 className="text-sm font-bold text-zinc-900 mb-2 flex items-center gap-2"><Activity size={16} className="text-zinc-400" /> Component: Dispatch</h4>
                                    <p className="text-xs text-zinc-600 leading-relaxed">Handles mapping drivers to riders using geospatial indexing (e.g., Uber's H3 or Google S2). Must support extremely high pub/sub throughput to track location updates every 3 seconds.</p>
                                </div>
                                <div className="bg-white p-5 border border-zinc-200 rounded-xl shadow-sm">
                                    <h4 className="text-sm font-bold text-zinc-900 mb-2 flex items-center gap-2"><Database size={16} className="text-zinc-400" /> Database Choice</h4>
                                    <table className="w-full text-left border-collapse mt-3">
                                        <tbody>
                                            <tr className="border-b border-zinc-100"><td className="py-2 text-xs font-semibold text-zinc-700">Trip Data</td><td className="py-2 text-xs font-mono text-zinc-500">PostgreSQL</td></tr>
                                            <tr><td className="py-2 text-xs font-semibold text-zinc-700">Location State</td><td className="py-2 text-xs font-mono text-zinc-500">Redis Geospatial</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PILLARS ── */}
            <section className="w-full py-24 bg-white border-y border-zinc-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Pillar 1 */}
                        <div className="flex flex-col group">
                            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-6 border border-zinc-200">
                                <Layers className="w-6 h-6 text-zinc-900" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-3">Understand Science</h3>
                            <p className="text-zinc-500 mb-6 leading-relaxed flex-1">
                                Interactive modules with dynamic diagrams, clarifying misconception toggles, and multi-step quizzes to master complex concepts.
                            </p>
                            <div className="h-40 border border-zinc-200 rounded-lg bg-[#FAFAFA] flex items-center justify-center overflow-hidden relative">
                                {/* Optics visual abstract */}
                                <div className="w-full h-px bg-zinc-300 absolute top-1/2" />
                                <div className="w-1.5 h-16 bg-zinc-900 rounded-full z-10" />
                                <div className="w-32 h-px bg-zinc-400 absolute left-8 top-1/4 -rotate-12" />
                            </div>
                        </div>

                        {/* Pillar 2 */}
                        <div className="flex flex-col group">
                            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-6 border border-zinc-200">
                                <GitBranch className="w-6 h-6 text-zinc-900" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-3">Design Software Systems</h3>
                            <p className="text-zinc-500 mb-6 leading-relaxed flex-1">
                                Strict architecture maps, interactive tradeoff matrices, and risk panels generated from your high-level system requirements.
                            </p>
                            <div className="h-40 border border-zinc-200 rounded-lg bg-[#FAFAFA] flex items-center justify-center overflow-hidden">
                                <div className="flex gap-4 items-center">
                                    <div className="w-16 h-10 border border-zinc-300 bg-white rounded shadow-sm" />
                                    <div className="w-8 h-px bg-zinc-300" />
                                    <div className="flex flex-col gap-2">
                                        <div className="w-16 h-8 border border-zinc-300 bg-white rounded shadow-sm" />
                                        <div className="w-16 h-8 border border-zinc-300 bg-white rounded shadow-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pillar 3 */}
                        <div className="flex flex-col group">
                            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-6 border border-zinc-200">
                                <BarChart3 className="w-6 h-6 text-zinc-900" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-3">Analyze Data</h3>
                            <p className="text-zinc-500 mb-6 leading-relaxed flex-1">
                                Upload a CSV or JSON payload and instantly get full dashboards, anomaly detection trends, and comparative insights.
                            </p>
                            <div className="h-40 border border-zinc-200 rounded-lg bg-[#FAFAFA] flex items-end justify-center p-4 gap-2 overflow-hidden">
                                {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                                    <div key={i} className="w-6 bg-zinc-200 rounded-t border-t border-x border-zinc-300" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS (LIGHT) ── */}
            <section className="w-full py-32 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-16">From idea to interface in seconds.</h2>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                        <div className="flex-1 max-w-xs flex flex-col items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white border-2 border-zinc-200 flex items-center justify-center font-bold text-zinc-900 shadow-sm">1</div>
                            <h3 className="font-bold text-zinc-900">Ask a complex question.</h3>
                        </div>
                        <ArrowRight className="text-zinc-300 rotate-90 md:rotate-0" />
                        <div className="flex-1 max-w-xs flex flex-col items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white border-2 border-zinc-200 flex items-center justify-center font-bold text-zinc-900 shadow-sm">2</div>
                            <h3 className="font-bold text-zinc-900">We structure the problem.</h3>
                        </div>
                        <ArrowRight className="text-zinc-300 rotate-90 md:rotate-0" />
                        <div className="flex-1 max-w-xs flex flex-col items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-zinc-900 border-2 border-zinc-900 flex items-center justify-center font-bold text-white shadow-sm">3</div>
                            <h3 className="font-bold text-zinc-900">You get an interactive system.</h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── VISUAL COMPARISON ── */}
            <section className="w-full py-32 bg-white border-y border-zinc-200">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">This isn't a chat response.</h2>
                        <p className="mt-4 text-zinc-500 font-medium">Stop reading paragraphs. Start inspecting systems.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
                        {/* LEFT: Chat Wall */}
                        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 flex flex-col relative overflow-hidden h-[400px]">
                            <div className="absolute top-4 right-4 bg-zinc-200 text-zinc-500 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">The Old Way</div>

                            <div className="w-full max-w-[80%] bg-zinc-200/50 rounded-2xl rounded-bl-sm p-4 mb-6 blur-[1px]">
                                <div className="h-3 w-full bg-zinc-300/50 rounded mb-2" />
                                <div className="h-3 w-5/6 bg-zinc-300/50 rounded mb-2" />
                                <div className="h-3 w-4/6 bg-zinc-300/50 rounded" />
                            </div>

                            <div className="w-full max-w-[90%] bg-white border border-zinc-200 rounded-2xl rounded-tl-sm p-6 shadow-sm blur-[0.5px]">
                                <div className="h-4 w-1/3 bg-zinc-200 rounded mb-4" />
                                <div className="space-y-3">
                                    <div className="h-3 w-full bg-zinc-100 rounded" />
                                    <div className="h-3 w-full bg-zinc-100 rounded" />
                                    <div className="h-3 w-5/6 bg-zinc-100 rounded" />
                                    <div className="h-3 w-full bg-zinc-100 rounded" />
                                    <div className="h-3 w-4/6 bg-zinc-100 rounded" />
                                    <div className="h-3 w-full bg-zinc-100 rounded" />
                                    <div className="h-3 w-2/3 bg-zinc-100 rounded" />
                                </div>
                            </div>

                            {/* Overlay X */}
                            <div className="absolute inset-0 flex items-center justify-center bg-white/20">
                                <X className="w-32 h-32 text-zinc-300/50" />
                            </div>
                        </div>

                        {/* RIGHT: Structured Components */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col relative h-[400px] shadow-xl ring-1 ring-white/10">
                            <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-emerald-500/20">Outform</div>

                            <div className="grid grid-cols-2 gap-4 h-full mt-4">
                                <div className="col-span-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 flex items-center justify-between">
                                    <div className="h-4 w-32 bg-zinc-700 rounded" />
                                    <div className="flex gap-2">
                                        <div className="w-16 h-6 bg-zinc-700 rounded-full" />
                                        <div className="w-6 h-6 bg-zinc-700 rounded" />
                                    </div>
                                </div>

                                <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 flex flex-col justify-between">
                                    <div className="h-16 w-16 bg-blue-500/20 border border-blue-500/30 rounded-lg mx-auto flex items-center justify-center">
                                        <Activity className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <div className="space-y-2 mt-4">
                                        <div className="h-2 w-full bg-zinc-700 rounded" />
                                        <div className="h-2 w-2/3 bg-zinc-700 rounded" />
                                    </div>
                                </div>

                                <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 flex flex-col gap-3">
                                    <div className="w-full flex items-end gap-1 h-12">
                                        {[40, 70, 50, 90, 60].map((h, i) => (
                                            <div key={i} className="flex-1 bg-zinc-600 rounded-t" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                    <div className="h-3 w-24 bg-zinc-700 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SUBTLE INFRA CREDIBILITY ── */}
            <section className="w-full py-24 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-8 border-b border-zinc-200 pb-4 inline-block">Built on structured rendering.</h2>

                    <ul className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 mt-4">
                        <li className="flex items-center gap-2 text-zinc-600 font-medium text-sm">
                            <CheckSquare className="w-4 h-4 text-zinc-400" /> Validated components
                        </li>
                        <li className="flex items-center gap-2 text-zinc-600 font-medium text-sm">
                            <Box className="w-4 h-4 text-zinc-400" /> Structured output
                        </li>
                        <li className="flex items-center gap-2 text-zinc-600 font-medium text-sm">
                            <Layers className="w-4 h-4 text-zinc-400" /> Interactive modules
                        </li>
                        <li className="flex items-center gap-2 text-zinc-600 font-medium text-sm">
                            <ShieldCheck className="w-4 h-4 text-zinc-400" /> No raw HTML execution
                        </li>
                    </ul>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="w-full bg-white border-t border-zinc-200 py-10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <Box className="w-5 h-5 text-zinc-900" />
                        <span className="text-zinc-900 font-bold tracking-tight">Outform</span>
                    </div>

                    <div className="flex items-center gap-8">
                        <button onClick={onTryDemo} className="text-sm font-medium text-zinc-500 hover:text-zinc-900">Examples</button>
                        <span className="text-sm font-medium text-zinc-400 cursor-not-allowed">Docs (Soon)</span>
                        <a href="#" className="text-sm font-medium text-zinc-500 hover:text-zinc-900">About</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

