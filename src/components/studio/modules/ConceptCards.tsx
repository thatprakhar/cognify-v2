'use client';
import React, { useState } from 'react';
import { ConceptCardsConfig } from '../../../lib/schema/module-configs/concept-cards';

export function ConceptCards({ config = {} as any }: { config: ConceptCardsConfig; computed: any; slot: string }) {
    const cards = config.cards || [];
    const [active, setActive] = useState<string | null>(null);
    const displayMode = config.displayMode || 'grid';

    if (displayMode === 'spotlight' && cards.length > 0) {
        const [hero, ...rest] = cards;
        return (
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-zinc-100">
                    <h2 className="text-lg font-semibold text-zinc-900">{config.heading}</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                            {hero.icon && <span className="text-2xl flex-shrink-0">{hero.icon}</span>}
                            <div>
                                {hero.badge && <span className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1 block">{hero.badge}</span>}
                                <h3 className="font-bold text-blue-900 text-base">{hero.title}</h3>
                                <p className="text-sm text-blue-800 mt-1 leading-relaxed">{hero.body}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {rest.map(card => (
                            <div key={card.id} className="p-4 border border-zinc-200 rounded-lg bg-zinc-50 hover:bg-white hover:border-zinc-300 transition-all">
                                <div className="font-semibold text-zinc-900 text-sm">{card.title}</div>
                                <p className="text-xs text-zinc-500 mt-1 leading-snug">{card.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (displayMode === 'list') {
        return (
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-zinc-100">
                    <h2 className="text-lg font-semibold text-zinc-900">{config.heading}</h2>
                </div>
                <div className="divide-y divide-zinc-100">
                    {cards.map((card, i) => (
                        <div key={card.id} className="px-6 py-3 flex gap-4 items-start hover:bg-zinc-50 transition-colors">
                            <span className="text-sm font-black text-zinc-300 w-5 flex-shrink-0 pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-zinc-900 text-sm">{card.title}</span>
                                    {card.badge && <span className="text-[10px] bg-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded-full font-semibold">{card.badge}</span>}
                                </div>
                                <p className="text-sm text-zinc-500 mt-0.5 leading-snug">{card.body}</p>
                                {card.tags && card.tags.length > 0 && (
                                    <div className="flex gap-1 mt-1.5 flex-wrap">
                                        {card.tags.map(t => <span key={t} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{t}</span>)}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // grid (default)
    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-zinc-100">
                <h2 className="text-lg font-semibold text-zinc-900">{config.heading}</h2>
                <p className="text-sm text-zinc-500 mt-0.5">{cards.length} concepts</p>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cards.map(card => (
                        <button
                            key={card.id}
                            onClick={() => setActive(active === card.id ? null : card.id)}
                            className={`text-left p-4 rounded-xl border transition-all duration-150 ${active === card.id ? 'border-blue-300 bg-blue-50' : 'border-zinc-200 bg-zinc-50 hover:bg-white hover:border-zinc-300'}`}
                        >
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <span className="font-semibold text-zinc-900 text-sm leading-tight">{card.title}</span>
                                {card.badge && (
                                    <span className="text-[10px] bg-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0">{card.badge}</span>
                                )}
                            </div>
                            <p className={`text-xs text-zinc-500 leading-snug transition-all ${active === card.id ? '' : 'line-clamp-3'}`}>{card.body}</p>
                            {card.tags && card.tags.length > 0 && (
                                <div className="flex gap-1 mt-2 flex-wrap">
                                    {card.tags.map(t => <span key={t} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{t}</span>)}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
