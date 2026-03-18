'use client';
import React, { useState } from 'react';
import { RiskPanelConfig } from '../../../lib/schema/module-configs/risk-panel';

const SEVERITY_CONFIG = {
    low:      { label: 'Low',      bg: 'bg-emerald-100', text: 'text-emerald-800', bar: 'bg-emerald-400', rank: 1 },
    medium:   { label: 'Medium',   bg: 'bg-amber-100',   text: 'text-amber-800',   bar: 'bg-amber-400',   rank: 2 },
    high:     { label: 'High',     bg: 'bg-orange-100',  text: 'text-orange-800',  bar: 'bg-orange-500',  rank: 3 },
    critical: { label: 'Critical', bg: 'bg-red-100',     text: 'text-red-800',     bar: 'bg-red-500',     rank: 4 },
};

const LIKELIHOOD_CONFIG = {
    low:    { label: 'Low',    dots: 1 },
    medium: { label: 'Medium', dots: 2 },
    high:   { label: 'High',   dots: 3 },
};

export function RiskPanel({ config = {} as any }: { config: RiskPanelConfig; computed: any; slot: string }) {
    const risks = config.risks || [];
    const [expanded, setExpanded] = useState<string | null>(config.spotlightRiskId || null);

    const sorted = [...risks].sort((a, b) => {
        const sa = SEVERITY_CONFIG[a.severity]?.rank ?? 0;
        const sb = SEVERITY_CONFIG[b.severity]?.rank ?? 0;
        return sb - sa;
    });

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-zinc-100">
                <h2 className="text-lg font-semibold text-zinc-900">Risk Panel</h2>
                <div className="flex gap-3 mt-2">
                    {(['critical','high','medium','low'] as const).map(s => {
                        const count = risks.filter(r => r.severity === s).length;
                        if (count === 0) return null;
                        const cfg = SEVERITY_CONFIG[s];
                        return (
                            <span key={s} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                                {count} {cfg.label}
                            </span>
                        );
                    })}
                </div>
            </div>

            <div className="divide-y divide-zinc-100">
                {sorted.map((risk) => {
                    const sev = SEVERITY_CONFIG[risk.severity] ?? SEVERITY_CONFIG.medium;
                    const lik = LIKELIHOOD_CONFIG[risk.likelihood] ?? LIKELIHOOD_CONFIG.medium;
                    const isExpanded = expanded === risk.id;
                    const isSpotlight = risk.id === config.spotlightRiskId;

                    return (
                        <div key={risk.id} className={`transition-colors ${isSpotlight ? 'bg-red-50/50' : ''}`}>
                            <button
                                className="w-full text-left px-6 py-4 flex items-start gap-4 hover:bg-zinc-50 transition-colors"
                                onClick={() => setExpanded(isExpanded ? null : risk.id)}
                            >
                                <div className={`mt-0.5 w-1 self-stretch rounded-full flex-shrink-0 ${sev.bar}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-zinc-900 text-sm">{risk.title}</span>
                                        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${sev.bg} ${sev.text}`}>{sev.label}</span>
                                        <span className="text-xs text-zinc-400 flex items-center gap-0.5">
                                            {'●'.repeat(lik.dots)}{'○'.repeat(3 - lik.dots)}
                                            <span className="ml-1">{lik.label} likelihood</span>
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-500 mt-1 leading-snug">{risk.description}</p>
                                </div>
                                <span className={`text-zinc-400 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
                            </button>

                            {isExpanded && (
                                <div className="px-6 pb-4 pl-12 space-y-3">
                                    {risk.mitigations?.length > 0 && (
                                        <div>
                                            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Mitigations</div>
                                            <ul className="space-y-1">
                                                {risk.mitigations.map((m, i) => (
                                                    <li key={i} className="text-sm text-zinc-700 flex gap-2">
                                                        <span className="text-emerald-500 flex-shrink-0">✓</span>{m}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {(risk.detectionSignals?.length ?? 0) > 0 && (
                                        <div>
                                            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Detection Signals</div>
                                            <ul className="space-y-1">
                                                {risk.detectionSignals?.map((s, i) => (
                                                    <li key={i} className="text-sm text-zinc-700 flex gap-2">
                                                        <span className="text-blue-400 flex-shrink-0">◎</span>{s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
