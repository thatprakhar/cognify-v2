"use client"

import React, { useState, useEffect } from 'react';
import { ArrowRight, GitBranch, BarChart3, Layers, Activity, CheckSquare, Box, ShieldCheck } from "lucide-react"

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
        <div className="min-h-screen w-full font-sans text-zinc-900 selection:bg-blue-900/30 selection:text-blue-200">

            {/* ── NAV ── */}
            <nav className="w-full border-b border-zinc-800/60 bg-zinc-950 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
                    <span className="text-sm font-mono font-medium tracking-widest text-zinc-100 uppercase">
                        Outform
                    </span>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onTryDemo}
                            className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                            Sign in
                        </button>
                        <button
                            onClick={onTryDemo}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                        >
                            Try free <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="w-full bg-zinc-950 pt-28 pb-24 px-6 flex flex-col items-center text-center relative overflow-hidden">
                {/* Subtle grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700/60 text-xs font-mono text-zinc-400 mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        Chat-in. Experience-out.
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-100 leading-[1.05] mb-6 max-w-4xl font-mono">
                        Ask anything.<br />
                        <span className="text-zinc-500">Get an experience.</span>
                    </h1>

                    <p className="text-base md:text-lg text-zinc-500 max-w-xl mx-auto mb-12 leading-relaxed">
                        Type a question. Outform generates a structured, visual, interactive breakdown — not a wall of text.
                    </p>

                    {/* CommandBar-styled input */}
                    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-6">
                        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700/50 rounded-xl px-4 py-2.5 focus-within:ring-1 focus-within:ring-blue-500/50 transition-shadow">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={PLACEHOLDERS[placeholderIdx]}
                                className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-600 font-mono text-sm outline-none transition-all duration-500"
                            />
                            <button
                                type="submit"
                                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono rounded-lg transition-colors"
                            >
                                Generate <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </form>

                    <div className="flex flex-wrap justify-center gap-2">
                        {["TCP/IP networking", "React vs Vue", "Startup risks"].map(p => (
                            <button
                                key={p}
                                onClick={onTryDemo}
                                className="px-3 py-1.5 text-xs font-mono text-zinc-500 border border-zinc-800 rounded-full hover:border-zinc-600 hover:text-zinc-300 transition-colors"
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PREVIEW MOCK ── */}
            <section className="w-full bg-[#F9F8F6] px-6 py-24">
                <div className="max-w-5xl mx-auto">
                    <p className="text-center text-xs font-mono uppercase tracking-widest text-zinc-400 mb-8">
                        Example output for &quot;Design a scalable ride-sharing platform.&quot;
                    </p>

                    {/* App shell mock */}
                    <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-2xl shadow-zinc-300/40 pointer-events-none select-none">

                        {/* Mock nav bar */}
                        <div className="h-10 bg-zinc-950 border-b border-zinc-800/60 flex items-center px-4 gap-3">
                            <span className="text-[11px] font-mono font-medium text-zinc-100 uppercase tracking-widest flex-shrink-0">Outform</span>
                            <div className="flex gap-1 flex-1 h-full items-center overflow-hidden">
                                <div className="px-3 h-full flex items-center text-[10px] font-mono text-zinc-100 relative flex-shrink-0">
                                    ride-sharing platform...
                                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-400" />
                                </div>
                                <div className="px-3 h-full flex items-center text-[10px] font-mono text-zinc-600">compare kafka vs...</div>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-500 hidden sm:block flex-shrink-0">⚡ 1.4s · LANGGRAPH · 0 retries</span>
                        </div>

                        {/* Mock canvas — clipped with fade */}
                        <div className="bg-[#F9F8F6] relative" style={{ maxHeight: 640, overflowY: 'hidden' }}>
                            <div className="p-6 space-y-4">
                                <h2 className="text-xl font-bold text-zinc-900">Ride-Sharing Platform Architecture</h2>

                                {/* ── System Map ── */}
                                <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                                    <div className="px-5 pt-4 pb-3 border-b border-zinc-100 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-semibold text-zinc-900">System Map</h3>
                                            <p className="text-xs text-zinc-500 mt-0.5">7 components · 8 connections</p>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mb-4">
                                            {[
                                                { label: 'Rider App',        sub: 'client',   bg: 'bg-sky-50',     border: 'border-sky-200',     text: 'text-sky-800',     dot: 'bg-sky-500' },
                                                { label: 'Driver App',       sub: 'client',   bg: 'bg-sky-50',     border: 'border-sky-200',     text: 'text-sky-800',     dot: 'bg-sky-500' },
                                                { label: 'API Gateway',      sub: 'service',  bg: 'bg-violet-50',  border: 'border-violet-200',  text: 'text-violet-800',  dot: 'bg-violet-500' },
                                                { label: 'Dispatch Svc',     sub: 'service',  bg: 'bg-violet-50',  border: 'border-violet-200',  text: 'text-violet-800',  dot: 'bg-violet-500' },
                                                { label: 'Pricing Engine',   sub: 'service',  bg: 'bg-violet-50',  border: 'border-violet-200',  text: 'text-violet-800',  dot: 'bg-violet-500' },
                                                { label: 'Location Store',   sub: 'database', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', dot: 'bg-emerald-500' },
                                                { label: 'Trip DB',          sub: 'database', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', dot: 'bg-emerald-500' },
                                                { label: 'Event Bus',        sub: 'queue',    bg: 'bg-pink-50',    border: 'border-pink-200',    text: 'text-pink-800',    dot: 'bg-pink-500' },
                                            ].map(n => (
                                                <div key={n.label} className={`${n.bg} border ${n.border} rounded-lg px-3 py-2.5 flex items-start gap-2`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${n.dot} mt-1 flex-shrink-0`} />
                                                    <div>
                                                        <div className={`text-xs font-semibold leading-tight ${n.text}`}>{n.label}</div>
                                                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{n.sub}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t border-zinc-100 pt-3 space-y-1.5">
                                            {[
                                                ['Rider App', '→', 'API Gateway', 'REST / HTTPS'],
                                                ['API Gateway', '⇢', 'Dispatch Svc', 'gRPC'],
                                                ['Dispatch Svc', '⟿', 'Event Bus', 'Kafka stream'],
                                                ['Event Bus', '⇢', 'Pricing Engine', 'async'],
                                            ].map(([from, arrow, to, label]) => (
                                                <div key={`${from}-${to}`} className="flex items-center gap-2 text-[11px]">
                                                    <span className="text-zinc-500 font-mono w-24 truncate">{from}</span>
                                                    <span className={`font-mono ${arrow === '⟿' ? 'text-blue-500' : arrow === '⇢' ? 'text-amber-500' : 'text-zinc-400'}`}>{arrow}</span>
                                                    <span className="text-zinc-500 font-mono w-24 truncate">{to}</span>
                                                    <span className="text-zinc-400 text-[10px]">{label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* ── Core Modules ── */}
                                <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                                    <div className="px-5 pt-4 pb-3 border-b border-zinc-100 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-semibold text-zinc-900">Core Modules</h3>
                                            <p className="text-xs text-zinc-500 mt-0.5">4 modules · 2 groups</p>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Trip Service
                                            </span>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Dispatch
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="grid grid-cols-2 gap-2.5">
                                            {[
                                                { name: 'Dispatch Service', desc: 'Matches riders to drivers via geospatial index. Uses H3 hexagons for spatial bucketing.', apis: 3, stores: 1, failures: 2 },
                                                { name: 'Pricing Engine',   desc: 'Dynamic surge pricing based on real-time demand/supply ratio and city zone multipliers.', apis: 2, stores: 2, failures: 1 },
                                                { name: 'Trip Service',     desc: 'Manages the full trip lifecycle: request → match → active → complete → rated.', apis: 4, stores: 1, failures: 1 },
                                                { name: 'Driver Registry',  desc: 'Driver profiles, real-time availability state, ratings aggregation, and compliance docs.', apis: 3, stores: 2, failures: 2 },
                                            ].map(m => (
                                                <div key={m.name} className="text-left p-3.5 rounded-lg border border-zinc-200 bg-zinc-50">
                                                    <div className="font-semibold text-zinc-900 text-xs mb-1">{m.name}</div>
                                                    <p className="text-[11px] text-zinc-500 leading-snug mb-2">{m.desc}</p>
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{m.apis} APIs</span>
                                                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">{m.stores} stores</span>
                                                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded">{m.failures} failure modes</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* ── Tradeoff Matrix ── */}
                                <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                                    <div className="px-5 pt-4 pb-3 border-b border-zinc-100">
                                        <h3 className="text-sm font-semibold text-zinc-900">Tradeoff Matrix</h3>
                                        <p className="text-xs text-zinc-500 mt-0.5">3 options · 4 criteria</p>
                                    </div>
                                    <div className="p-5 overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr>
                                                    <th className="text-left text-[10px] font-semibold text-zinc-400 uppercase tracking-wide pb-3 pr-4 min-w-[130px]">Criterion</th>
                                                    {['PostgreSQL', 'Redis Cluster', 'Cassandra'].map(o => (
                                                        <th key={o} className="text-center text-xs font-semibold text-zinc-700 pb-3 px-3 min-w-[90px]">{o}</th>
                                                    ))}
                                                    <th className="text-left text-[10px] font-semibold text-zinc-400 uppercase tracking-wide pb-3 pl-3">Weight</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-zinc-100">
                                                {[
                                                    { name: 'Read Latency',       hint: '↑ more is better', scores: [4, 5, 2] },
                                                    { name: 'Write Throughput',   hint: '↑ more is better', scores: [3, 5, 5] },
                                                    { name: 'Horizontal Scale',   hint: '↑ more is better', scores: [2, 4, 5] },
                                                    { name: 'Operational Cost',   hint: '↓ less is better', scores: [4, 2, 3] },
                                                ].map((c, ci) => (
                                                    <tr key={c.name}>
                                                        <td className="py-2.5 pr-4">
                                                            <div className="font-medium text-zinc-800">{c.name}</div>
                                                            <div className="text-[10px] text-zinc-400 mt-0.5">{c.hint}</div>
                                                        </td>
                                                        {c.scores.map((s, si) => {
                                                            const cls = s >= 4 ? 'bg-emerald-100 text-emerald-800' : s === 3 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800';
                                                            return (
                                                                <td key={si} className="py-2.5 px-3 text-center">
                                                                    <span className={`inline-flex w-7 h-7 rounded-lg text-xs font-bold items-center justify-center ${cls}`}>{s}</span>
                                                                </td>
                                                            );
                                                        })}
                                                        <td className="py-2.5 pl-3">
                                                            <div className="w-14 h-1 bg-zinc-200 rounded-full">
                                                                <div className="h-full bg-blue-400 rounded-full" style={{ width: ci === 0 ? '100%' : ci === 1 ? '67%' : ci === 2 ? '100%' : '50%' }} />
                                                            </div>
                                                            <span className="text-[10px] text-zinc-400 mt-1 block">×{ci === 0 ? '2' : ci === 1 ? '1.5' : ci === 2 ? '2' : '1'}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="border-t-2 border-zinc-200">
                                                <tr>
                                                    <td className="pt-3 pr-4 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">Weighted Total</td>
                                                    {[['26.5', 62], ['31.0', 73], ['28.5', 67]].map(([total, pct], i) => (
                                                        <td key={i} className="pt-3 px-3 text-center">
                                                            <div className={`text-base font-black ${i === 1 ? 'text-blue-600' : 'text-zinc-700'}`}>{total}</div>
                                                            <div className="mt-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden w-full">
                                                                <div className={`h-full rounded-full ${i === 1 ? 'bg-blue-500' : 'bg-zinc-300'}`} style={{ width: `${pct}%` }} />
                                                            </div>
                                                            <div className="text-[10px] text-zinc-400 mt-0.5">{pct}%</div>
                                                        </td>
                                                    ))}
                                                    <td />
                                                </tr>
                                            </tfoot>
                                        </table>
                                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3.5">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Recommendation</span>
                                                <span className="bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Redis Cluster</span>
                                            </div>
                                            <ul className="text-[11px] text-blue-800 space-y-0.5">
                                                <li className="flex gap-1.5"><span className="text-blue-400">›</span>Best read latency and write throughput for real-time dispatch</li>
                                                <li className="flex gap-1.5"><span className="text-blue-400">›</span>Horizontal scaling handles location updates at 10M+ DAU</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Risk Panel ── */}
                                <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                                    <div className="px-5 pt-4 pb-3 border-b border-zinc-100">
                                        <h3 className="text-sm font-semibold text-zinc-900">Risk Panel</h3>
                                        <div className="flex gap-2 mt-1.5">
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800">1 Critical</span>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">2 High</span>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">1 Medium</span>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-zinc-100">
                                        {[
                                            { title: 'Driver Supply Crunch',     sev: 'Critical', sevCls: 'bg-red-100 text-red-800',    bar: 'bg-red-500',    lik: '●●●', likLabel: 'High',   desc: 'Cold-start in new cities. No drivers → no riders → no drivers. Requires aggressive supply-side subsidies at launch.' },
                                            { title: 'GPS Accuracy Failures',    sev: 'High',     sevCls: 'bg-orange-100 text-orange-800', bar: 'bg-orange-500', lik: '●●○', likLabel: 'Medium', desc: 'Poor GPS in dense urban areas causes wrong pickup locations, increasing cancellations and driver frustration.' },
                                            { title: 'Surge Pricing Backlash',  sev: 'High',     sevCls: 'bg-orange-100 text-orange-800', bar: 'bg-orange-500', lik: '●○○', likLabel: 'Low',   desc: 'Public perception risk during peak events. Requires transparent communication and algorithmic caps.' },
                                            { title: 'Payment Gateway Timeout', sev: 'Medium',   sevCls: 'bg-amber-100 text-amber-800',  bar: 'bg-amber-400',  lik: '●○○', likLabel: 'Low',   desc: 'Trip completion blocked if payment fails silently. Requires async charge retry with idempotency.' },
                                        ].map(r => (
                                            <div key={r.title} className="px-5 py-3.5 flex items-start gap-3">
                                                <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${r.bar}`} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-semibold text-zinc-900 text-xs">{r.title}</span>
                                                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${r.sevCls}`}>{r.sev}</span>
                                                        <span className="text-[10px] text-zinc-400">{r.lik} {r.likLabel} likelihood</span>
                                                    </div>
                                                    <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{r.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Fade out hint */}
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F9F8F6] to-transparent pointer-events-none" />
                        </div>

                        {/* Mock command bar */}
                        <div className="bg-zinc-950 border-t border-zinc-800/60 px-4 py-3">
                            <div className="max-w-4xl mx-auto flex items-center gap-3">
                                <div className="flex-1 bg-zinc-900 border border-zinc-700/50 rounded-xl px-4 py-2 text-xs font-mono text-zinc-600">
                                    Ask anything...
                                </div>
                                <div className="p-2 bg-zinc-800 rounded-lg text-zinc-600">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PILLARS ── */}
            <section className="w-full bg-white border-y border-zinc-100 py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <p className="text-center text-xs font-mono uppercase tracking-widest text-zinc-400 mb-16">What you can explore</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <GitBranch className="w-5 h-5 text-zinc-900" />,
                                title: "Design Software Systems",
                                body: "Architecture maps, tradeoff matrices, and risk panels generated from your requirements.",
                                preview: (
                                    <div className="flex gap-3 items-center justify-center">
                                        <div className="w-12 h-8 border border-zinc-200 bg-zinc-50 rounded" />
                                        <div className="w-6 h-px bg-zinc-300" />
                                        <div className="flex flex-col gap-1.5">
                                            <div className="w-12 h-6 border border-zinc-200 bg-zinc-50 rounded" />
                                            <div className="w-12 h-6 border border-zinc-200 bg-zinc-50 rounded" />
                                        </div>
                                    </div>
                                )
                            },
                            {
                                icon: <Layers className="w-5 h-5 text-zinc-900" />,
                                title: "Understand Science",
                                body: "Dynamic diagrams, concept cards, and multi-step quizzes to master complex topics.",
                                preview: (
                                    <div className="flex flex-col gap-2 w-full px-4">
                                        {[80, 55, 70].map((w, i) => (
                                            <div key={i} className="h-2 bg-zinc-200 rounded-full" style={{ width: `${w}%` }} />
                                        ))}
                                    </div>
                                )
                            },
                            {
                                icon: <BarChart3 className="w-5 h-5 text-zinc-900" />,
                                title: "Analyze Data",
                                body: "Upload a CSV and get dashboards, anomaly detection, and comparative insights.",
                                preview: (
                                    <div className="flex items-end gap-1.5 h-full px-4">
                                        {[40, 65, 30, 80, 50, 90, 70].map((h, i) => (
                                            <div key={i} className="flex-1 bg-zinc-200 rounded-t" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                )
                            }
                        ].map(({ icon, title, body, preview }) => (
                            <div key={title} className="flex flex-col">
                                <div className="w-10 h-10 bg-zinc-100 border border-zinc-200 rounded-xl flex items-center justify-center mb-5">
                                    {icon}
                                </div>
                                <h3 className="text-base font-bold text-zinc-900 mb-2">{title}</h3>
                                <p className="text-sm text-zinc-500 leading-relaxed mb-5 flex-1">{body}</p>
                                <div className="h-28 border border-zinc-100 rounded-lg bg-zinc-50 flex items-center justify-center overflow-hidden">
                                    {preview}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="w-full bg-zinc-950 py-28 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-12">How it works</p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                        {[
                            ["01", "Ask a complex question"],
                            ["02", "We structure the problem"],
                            ["03", "You get an interactive system"],
                        ].map(([num, label], i) => (
                            <React.Fragment key={num}>
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-mono font-bold text-sm ${i === 2 ? 'bg-blue-600 text-white' : 'bg-zinc-900 border border-zinc-700 text-zinc-400'}`}>
                                        {num}
                                    </div>
                                    <p className="text-sm text-zinc-300 font-medium max-w-[140px]">{label}</p>
                                </div>
                                {i < 2 && <ArrowRight className="text-zinc-700 rotate-90 md:rotate-0 flex-shrink-0" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── COMPARISON ── */}
            <section className="w-full bg-[#F9F8F6] border-y border-zinc-100 py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 font-mono">
                            Not a chat response.
                        </h2>
                        <p className="mt-3 text-zinc-500">Stop reading paragraphs. Start inspecting systems.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                        {/* Left: Old way */}
                        <div className="bg-white border border-zinc-200 rounded-2xl p-7 relative h-64 overflow-hidden opacity-60">
                            <div className="absolute top-3 right-3 text-[9px] font-mono uppercase tracking-widest text-zinc-400 bg-zinc-100 px-2 py-1 rounded">Before</div>
                            <div className="space-y-2 mt-4">
                                {[100, 90, 100, 75, 100, 85, 60].map((w, i) => (
                                    <div key={i} className="h-2.5 bg-zinc-100 rounded-full" style={{ width: `${w}%` }} />
                                ))}
                            </div>
                        </div>

                        {/* Right: Outform */}
                        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-7 relative h-64 overflow-hidden shadow-xl ring-1 ring-white/5">
                            <div className="absolute top-3 right-3 text-[9px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">Outform</div>
                            <div className="grid grid-cols-2 gap-3 mt-4 h-[calc(100%-2rem)]">
                                <div className="col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-center justify-between">
                                    <div className="h-2 w-24 bg-zinc-700 rounded" />
                                    <div className="flex gap-1.5">
                                        <div className="w-12 h-4 bg-zinc-700 rounded-full" />
                                        <div className="w-4 h-4 bg-zinc-700 rounded" />
                                    </div>
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex flex-col gap-2">
                                    <div className="h-6 w-6 bg-blue-500/20 border border-blue-500/30 rounded flex items-center justify-center">
                                        <Activity className="w-3 h-3 text-blue-400" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-1.5 w-full bg-zinc-700 rounded" />
                                        <div className="h-1.5 w-2/3 bg-zinc-700 rounded" />
                                    </div>
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-end gap-1">
                                    {[40, 70, 50, 90, 60].map((h, i) => (
                                        <div key={i} className="flex-1 bg-zinc-600 rounded-t" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TRUST STRIP ── */}
            <section className="w-full bg-white py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <ul className="flex flex-wrap justify-center gap-8">
                        {[
                            [<CheckSquare key="cs" className="w-4 h-4" />, "Validated components"],
                            [<Box key="b" className="w-4 h-4" />, "Structured output"],
                            [<Layers key="l" className="w-4 h-4" />, "Interactive modules"],
                            [<ShieldCheck key="sc" className="w-4 h-4" />, "No raw HTML execution"],
                        ].map(([icon, label]) => (
                            <li key={String(label)} className="flex items-center gap-2 text-sm text-zinc-500 font-mono">
                                <span className="text-zinc-400">{icon}</span>
                                {label}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="w-full bg-zinc-950 py-28 px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold font-mono text-zinc-100 tracking-tight mb-4">
                    Try it now.
                </h2>
                <p className="text-zinc-500 mb-10 text-base">No signup required to see a demo.</p>
                <button
                    onClick={onTryDemo}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm rounded-xl transition-colors shadow-lg shadow-blue-900/30"
                >
                    Launch Outform <ArrowRight className="w-4 h-4" />
                </button>
            </section>

            {/* ── FOOTER ── */}
            <footer className="w-full bg-zinc-950 border-t border-zinc-800/60 py-8 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Outform</span>
                    <div className="flex items-center gap-8">
                        <button onClick={onTryDemo} className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors">Examples</button>
                        <span className="text-xs font-mono text-zinc-700 cursor-not-allowed">Docs (soon)</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}
