'use client';
import React from 'react';
import { ExplainerSectionConfig } from '../../../lib/schema/module-configs/explainer-section';

const CALLOUT_CONFIG = {
    tip:     { bg: 'bg-blue-50',    border: 'border-blue-200',   text: 'text-blue-800',   icon: '💡', label: 'Tip' },
    warning: { bg: 'bg-amber-50',   border: 'border-amber-200',  text: 'text-amber-800',  icon: '⚠️', label: 'Warning' },
    insight: { bg: 'bg-violet-50',  border: 'border-violet-200', text: 'text-violet-800', icon: '◈',  label: 'Insight' },
    fact:    { bg: 'bg-emerald-50', border: 'border-emerald-200',text: 'text-emerald-800',icon: '→',  label: 'Fact' },
};

export function ExplainerSection({ config = {} as any }: { config: ExplainerSectionConfig; computed: any; slot: string }) {
    const sections = config.sections || [];

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-zinc-100">
                <h2 className="text-lg font-semibold text-zinc-900">{config.heading}</h2>
                {config.summary && (
                    <p className="text-sm text-zinc-600 mt-2 leading-relaxed bg-zinc-50 rounded-lg px-3 py-2.5 border border-zinc-200">{config.summary}</p>
                )}
            </div>

            <div className="p-6 space-y-6">
                {sections.map((section, i) => (
                    <div key={section.id} className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-zinc-300 w-5 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                            <h3 className="font-semibold text-zinc-900">{section.title}</h3>
                        </div>
                        <p className="text-sm text-zinc-600 leading-relaxed pl-8">{section.body}</p>

                        {section.bulletPoints && section.bulletPoints.length > 0 && (
                            <ul className="pl-8 space-y-1.5">
                                {section.bulletPoints.map((bp, j) => (
                                    <li key={j} className="flex gap-2.5 text-sm text-zinc-600">
                                        <span className="text-blue-400 flex-shrink-0 font-bold">›</span>
                                        {bp}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {section.callout && (() => {
                            const c = CALLOUT_CONFIG[section.callout.type] ?? CALLOUT_CONFIG.tip;
                            return (
                                <div className={`ml-8 p-3 rounded-lg border ${c.bg} ${c.border}`}>
                                    <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${c.text} mb-1`}>
                                        <span>{c.icon}</span>{c.label}
                                    </div>
                                    <p className={`text-sm ${c.text}`}>{section.callout.text}</p>
                                </div>
                            );
                        })()}
                    </div>
                ))}

                {config.keyTakeaways && config.keyTakeaways.length > 0 && (
                    <div className="pt-4 border-t border-zinc-100">
                        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Key Takeaways</div>
                        <ul className="space-y-2">
                            {config.keyTakeaways.map((t, i) => (
                                <li key={i} className="flex gap-3 text-sm text-zinc-700">
                                    <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                                    {t}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
