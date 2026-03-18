'use client';
import React, { useState } from 'react';
import { ComparisonPanelConfig } from '../../../lib/schema/module-configs/comparison-panel';

export function ComparisonPanel({ config = {} as any }: { config: ComparisonPanelConfig; computed: any; slot: string }) {
    const [tab, setTab] = useState<'overview' | 'criteria'>('overview');
    const { optionA, optionB, criteria = [], recommendation } = config;
    if (!optionA || !optionB) return null;

    const winner = recommendation?.winner;
    const winnerName = winner === 'optionA' ? optionA.name : winner === 'optionB' ? optionB.name : null;

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-zinc-100">
                <h2 className="text-lg font-semibold text-zinc-900">{config.heading}</h2>
                {config.context && <p className="text-sm text-zinc-500 mt-1">{config.context}</p>}
            </div>

            {/* Tab toggle */}
            <div className="flex border-b border-zinc-100 px-6">
                {(['overview', 'criteria'] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`py-2.5 px-4 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-blue-500 text-blue-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}>
                        {t}
                    </button>
                ))}
            </div>

            <div className="p-6">
                {tab === 'overview' && (
                    <div className="grid grid-cols-2 gap-4">
                        {[{ opt: optionA, key: 'optionA' }, { opt: optionB, key: 'optionB' }].map(({ opt, key }) => {
                            const isWinner = winner === key;
                            return (
                                <div key={key} className={`rounded-xl border p-4 ${isWinner ? 'border-blue-300 bg-blue-50 ring-1 ring-blue-200' : 'border-zinc-200 bg-zinc-50'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`font-bold text-sm ${isWinner ? 'text-blue-900' : 'text-zinc-900'}`}>{opt.name}</span>
                                        {opt.badge && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isWinner ? 'bg-blue-200 text-blue-700' : 'bg-zinc-200 text-zinc-600'}`}>{opt.badge}</span>}
                                        {isWinner && <span className="ml-auto text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-bold">Winner</span>}
                                    </div>
                                    <p className="text-xs text-zinc-500 mb-3 leading-snug">{opt.description}</p>

                                    {opt.pros.length > 0 && (
                                        <div className="mb-2">
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Pros</div>
                                            <ul className="space-y-0.5">
                                                {opt.pros.map((p, i) => <li key={i} className="text-xs text-zinc-700 flex gap-1.5"><span className="text-emerald-500">+</span>{p}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                    {opt.cons.length > 0 && (
                                        <div className="mb-3">
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-1">Cons</div>
                                            <ul className="space-y-0.5">
                                                {opt.cons.map((c, i) => <li key={i} className="text-xs text-zinc-700 flex gap-1.5"><span className="text-red-400">−</span>{c}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                    {Object.keys(opt.stats || {}).length > 0 && (
                                        <div className="pt-2 border-t border-zinc-200 space-y-1">
                                            {Object.entries(opt.stats).map(([k, v]) => (
                                                <div key={k} className="flex justify-between text-xs">
                                                    <span className="text-zinc-500">{k}</span>
                                                    <span className="font-semibold text-zinc-800">{v}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {tab === 'criteria' && (
                    <div className="space-y-3">
                        {criteria.map(c => {
                            const aScore = c.optionAScore;
                            const bScore = c.optionBScore;
                            const aWins = c.isMoreBetter ? aScore > bScore : aScore < bScore;
                            const bWins = c.isMoreBetter ? bScore > aScore : bScore < aScore;
                            return (
                                <div key={c.name} className="space-y-1">
                                    <div className="flex justify-between text-xs text-zinc-500">
                                        <span>{optionA.name}</span>
                                        <span className="font-semibold text-zinc-700">{c.name}</span>
                                        <span>{optionB.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-black w-5 text-right ${aWins ? 'text-blue-600' : 'text-zinc-400'}`}>{aScore}</span>
                                        <div className="flex-1 flex gap-0.5">
                                            <div className="flex-1 h-2 bg-zinc-100 rounded-l-full overflow-hidden flex justify-end">
                                                <div className={`h-full rounded-l-full transition-all ${aWins ? 'bg-blue-500' : 'bg-zinc-300'}`} style={{ width: `${(aScore / 5) * 100}%` }} />
                                            </div>
                                            <div className="flex-1 h-2 bg-zinc-100 rounded-r-full overflow-hidden">
                                                <div className={`h-full rounded-r-full transition-all ${bWins ? 'bg-blue-500' : 'bg-zinc-300'}`} style={{ width: `${(bScore / 5) * 100}%` }} />
                                            </div>
                                        </div>
                                        <span className={`text-xs font-black w-5 ${bWins ? 'text-blue-600' : 'text-zinc-400'}`}>{bScore}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {recommendation && (
                    <div className={`mt-4 p-4 rounded-lg border ${winner === 'depends' ? 'bg-zinc-50 border-zinc-200' : 'bg-blue-50 border-blue-200'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold uppercase tracking-widest ${winner === 'depends' ? 'text-zinc-500' : 'text-blue-600'}`}>
                                {winnerName ? `Recommend: ${winnerName}` : 'Context-Dependent'}
                            </span>
                        </div>
                        <p className="text-sm text-zinc-700">{recommendation.reasoning}</p>
                        {(recommendation.whenToChooseA || recommendation.whenToChooseB) && (
                            <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                                {recommendation.whenToChooseA && (
                                    <div><span className="font-semibold text-zinc-600">Choose {optionA.name} when:</span><p className="text-zinc-500 mt-0.5">{recommendation.whenToChooseA}</p></div>
                                )}
                                {recommendation.whenToChooseB && (
                                    <div><span className="font-semibold text-zinc-600">Choose {optionB.name} when:</span><p className="text-zinc-500 mt-0.5">{recommendation.whenToChooseB}</p></div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
