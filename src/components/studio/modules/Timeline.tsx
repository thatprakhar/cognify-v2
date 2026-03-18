'use client';
import React from 'react';
import { TimelineConfig } from '../../../lib/schema/module-configs/timeline';

export function Timeline({ config = {} as any }: { config: TimelineConfig; computed: any; slot: string }) {
    const items = config.items || [];
    const orientation = config.orientation || 'vertical';

    if (orientation === 'horizontal') {
        return (
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-zinc-100">
                    <h2 className="text-lg font-semibold text-zinc-900">{config.heading}</h2>
                </div>
                <div className="p-6 overflow-x-auto">
                    <div className="flex gap-0 min-w-max">
                        {items.map((item, i) => (
                            <div key={item.id} className="flex flex-col items-center" style={{ minWidth: 160 }}>
                                <div className="text-xs font-bold text-zinc-400 mb-2">{item.date}</div>
                                <div className="flex items-center w-full">
                                    <div className={`flex-1 h-0.5 ${i === 0 ? 'bg-transparent' : 'bg-zinc-200'}`} />
                                    <div className={`w-3 h-3 rounded-full flex-shrink-0 border-2 border-white ring-2 ${item.isHighlighted ? 'bg-blue-500 ring-blue-300 scale-125' : 'bg-zinc-400 ring-zinc-200'}`} />
                                    <div className={`flex-1 h-0.5 ${i === items.length - 1 ? 'bg-transparent' : 'bg-zinc-200'}`} />
                                </div>
                                <div className={`mt-3 mx-2 p-3 rounded-lg border text-center ${item.isHighlighted ? 'bg-blue-50 border-blue-200' : 'bg-zinc-50 border-zinc-200'}`}>
                                    <div className="font-semibold text-zinc-900 text-xs leading-tight">{item.title}</div>
                                    <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Vertical (default)
    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-zinc-100">
                <h2 className="text-lg font-semibold text-zinc-900">{config.heading}</h2>
                <p className="text-sm text-zinc-500 mt-0.5">{items.length} events</p>
            </div>
            <div className="p-6">
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[17px] top-2 bottom-2 w-px bg-zinc-200" />

                    <div className="space-y-6">
                        {items.map((item, i) => (
                            <div key={item.id} className="flex gap-4 relative">
                                <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-white ring-2 z-10 ${item.isHighlighted ? 'bg-blue-500 ring-blue-200 text-white' : 'bg-zinc-100 ring-zinc-200 text-zinc-500'}`}>
                                    <span className="text-xs font-bold">{i + 1}</span>
                                </div>
                                <div className={`flex-1 pb-1 ${item.isHighlighted ? 'bg-blue-50 border border-blue-200 rounded-lg p-3 -mt-1' : ''}`}>
                                    <div className="flex items-baseline gap-3 flex-wrap">
                                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${item.isHighlighted ? 'bg-blue-100 text-blue-700' : 'bg-zinc-100 text-zinc-500'}`}>{item.date}</span>
                                        <span className={`font-semibold text-sm ${item.isHighlighted ? 'text-blue-900' : 'text-zinc-900'}`}>{item.title}</span>
                                    </div>
                                    <p className={`text-sm mt-1 leading-relaxed ${item.isHighlighted ? 'text-blue-800' : 'text-zinc-500'}`}>{item.description}</p>
                                    {item.tags && item.tags.length > 0 && (
                                        <div className="flex gap-1 mt-2 flex-wrap">
                                            {item.tags.map(t => (
                                                <span key={t} className="text-[10px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded-full">{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
