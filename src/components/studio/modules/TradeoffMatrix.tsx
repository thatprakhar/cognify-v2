'use client';
import React, { useState } from 'react';
import { TradeoffMatrixConfig } from '../../../lib/schema/module-configs/tradeoff-matrix';

export function TradeoffMatrix({ config = {} as any, computed }: { config: TradeoffMatrixConfig; computed: any; slot: string }) {
    const options = config.options || [];
    const criteria = config.criteria || [];
    const scores = config.scores || [];
    const recommendation = config.recommendation;

    const [weights, setWeights] = useState<Record<string, number>>(() => {
        const init: Record<string, number> = {};
        criteria.forEach(c => { init[c.id] = 1; });
        return init;
    });

    const getScore = (optionId: string, criterionId: string) =>
        scores.find(s => s.optionId === optionId && s.criterionId === criterionId)?.rawScore ?? 0;

    const getWeightedTotal = (optionId: string) =>
        criteria.reduce((sum, c) => {
            const raw = getScore(optionId, c.id);
            const w = weights[c.id] ?? 1;
            return sum + (c.isMoreBetter ? raw : 6 - raw) * w;
        }, 0);

    const maxTotal = criteria.reduce((sum, c) => sum + 5 * (weights[c.id] ?? 1), 0);

    const ranked = [...options].sort((a, b) => getWeightedTotal(b.id) - getWeightedTotal(a.id));

    const scoreColor = (raw: number, isMoreBetter: boolean) => {
        const effective = isMoreBetter ? raw : 6 - raw;
        if (effective >= 4) return 'bg-emerald-100 text-emerald-800';
        if (effective === 3) return 'bg-amber-100 text-amber-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-zinc-100">
                <h2 className="text-lg font-semibold text-zinc-900">Tradeoff Matrix</h2>
                <p className="text-sm text-zinc-500 mt-0.5">{options.length} options · {criteria.length} criteria</p>
            </div>

            <div className="p-6 space-y-6 overflow-x-auto">
                {/* Scoring table */}
                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            <th className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wide pb-3 pr-4 min-w-[140px]">Criterion</th>
                            {options.map(o => (
                                <th key={o.id} className="text-center text-xs font-semibold text-zinc-700 pb-3 px-3 min-w-[90px]">{o.name}</th>
                            ))}
                            <th className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wide pb-3 pl-4">Weight</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {criteria.map(c => (
                            <tr key={c.id} className="group">
                                <td className="py-2.5 pr-4">
                                    <div className="font-medium text-zinc-800 text-sm leading-tight">{c.name}</div>
                                    {c.description && <div className="text-xs text-zinc-400 mt-0.5 leading-tight">{c.description}</div>}
                                    <div className="text-[10px] text-zinc-400 mt-0.5">{c.isMoreBetter ? '↑ more is better' : '↓ less is better'}</div>
                                </td>
                                {options.map(o => {
                                    const raw = getScore(o.id, c.id);
                                    return (
                                        <td key={o.id} className="py-2.5 px-3 text-center">
                                            <span className={`inline-block w-8 h-8 rounded-lg text-sm font-bold leading-8 ${scoreColor(raw, c.isMoreBetter)}`}>
                                                {raw}
                                            </span>
                                        </td>
                                    );
                                })}
                                <td className="py-2.5 pl-4">
                                    <input
                                        type="range" min={0.5} max={3} step={0.5}
                                        value={weights[c.id] ?? 1}
                                        onChange={e => setWeights(prev => ({ ...prev, [c.id]: parseFloat(e.target.value) }))}
                                        className="w-16 accent-blue-600"
                                    />
                                    <span className="text-xs text-zinc-400 ml-1">×{weights[c.id] ?? 1}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="border-t-2 border-zinc-200">
                        <tr>
                            <td className="pt-3 pr-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Weighted Total</td>
                            {options.map((o, i) => {
                                const total = getWeightedTotal(o.id);
                                const pct = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
                                const isWinner = ranked[0]?.id === o.id;
                                return (
                                    <td key={o.id} className="pt-3 px-3 text-center">
                                        <div className={`text-lg font-black ${isWinner ? 'text-blue-600' : 'text-zinc-700'}`}>{total.toFixed(1)}</div>
                                        <div className="mt-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden w-full">
                                            <div className={`h-full rounded-full transition-all duration-500 ${isWinner ? 'bg-blue-500' : 'bg-zinc-300'}`} style={{ width: `${pct}%` }} />
                                        </div>
                                        <div className="text-xs text-zinc-400 mt-0.5">{pct}%</div>
                                    </td>
                                );
                            })}
                            <td />
                        </tr>
                    </tfoot>
                </table>

                {/* Recommendation */}
                {recommendation && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Recommendation</span>
                            <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                {options.find(o => o.id === recommendation.optionId)?.name ?? recommendation.optionId}
                            </span>
                        </div>
                        {recommendation.keyReasons?.length > 0 && (
                            <ul className="text-sm text-blue-800 space-y-0.5">
                                {recommendation.keyReasons.map((r, i) => <li key={i} className="flex gap-2"><span className="text-blue-400">›</span>{r}</li>)}
                            </ul>
                        )}
                        {(recommendation.whatWouldChange?.length ?? 0) > 0 && (
                            <div className="mt-2 pt-2 border-t border-blue-200">
                                <div className="text-xs text-blue-600 font-semibold mb-1">What would change this:</div>
                                <ul className="text-xs text-blue-700 space-y-0.5">
                                    {recommendation.whatWouldChange?.map((w, i) => <li key={i}>• {w}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
