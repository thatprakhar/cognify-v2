'use client';
import React from 'react';
import { ScorecardPanelConfig } from '../../../lib/schema/module-configs/scorecard-panel';

const STATUS_CONFIG = {
    strong:   { bg: 'bg-emerald-100', text: 'text-emerald-700', bar: 'bg-emerald-500', label: 'Strong' },
    adequate: { bg: 'bg-blue-100',    text: 'text-blue-700',    bar: 'bg-blue-500',    label: 'Adequate' },
    weak:     { bg: 'bg-amber-100',   text: 'text-amber-700',   bar: 'bg-amber-500',   label: 'Weak' },
    critical: { bg: 'bg-red-100',     text: 'text-red-700',     bar: 'bg-red-500',     label: 'Critical' },
};

export function ScorecardPanel({ config = {} as any, computed }: { config: ScorecardPanelConfig; computed: any; slot: string }) {
    const dimensions = config.dimensions || [];
    const overallScore = computed?.overallScore ?? (dimensions.reduce((s, d) => s + d.score, 0) / (dimensions.length || 1));
    const overallPct = Math.round((overallScore / 10) * 100);

    const overallStatus = overallScore >= 8 ? 'strong' : overallScore >= 5 ? 'adequate' : overallScore >= 3 ? 'weak' : 'critical';
    const overallCfg = STATUS_CONFIG[overallStatus];

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-zinc-100">
                <h2 className="text-lg font-semibold text-zinc-900">{config.heading}</h2>
                {config.subject && <p className="text-sm text-zinc-500 mt-0.5">Evaluating: <span className="font-medium text-zinc-700">{config.subject}</span></p>}
            </div>

            <div className="p-6 space-y-5">
                {/* Overall score hero */}
                <div className={`flex items-center gap-5 p-4 rounded-xl ${overallCfg.bg}`}>
                    <div className="relative w-16 h-16 flex-shrink-0">
                        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="white" strokeWidth="6" />
                            <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor"
                                className={overallCfg.text}
                                strokeWidth="6"
                                strokeDasharray={`${2 * Math.PI * 28}`}
                                strokeDashoffset={`${2 * Math.PI * 28 * (1 - overallPct / 100)}`}
                                strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-lg font-black ${overallCfg.text}`}>{overallScore.toFixed(1)}</span>
                        </div>
                    </div>
                    <div>
                        <div className={`text-xs font-bold uppercase tracking-widest ${overallCfg.text} mb-0.5`}>{overallCfg.label}</div>
                        <p className="text-sm text-zinc-700 leading-snug">{config.verdict}</p>
                    </div>
                </div>

                {/* Dimensions */}
                <div className="space-y-3">
                    {dimensions.map(dim => {
                        const cfg = STATUS_CONFIG[dim.status] ?? STATUS_CONFIG.adequate;
                        const pct = (dim.score / 10) * 100;
                        return (
                            <div key={dim.id} className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-sm font-medium text-zinc-800">{dim.name}</span>
                                        <p className="text-xs text-zinc-500 mt-0.5">{dim.rationale}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                                        <span className="text-sm font-black text-zinc-700 w-8 text-right">{dim.score}/10</span>
                                    </div>
                                </div>
                                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`} style={{ width: `${pct}%` }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
