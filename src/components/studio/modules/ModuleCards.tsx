'use client';
import React, { useState } from 'react';
import { ModuleCardsConfig } from '../../../lib/schema/module-configs/module-cards';

const QUALITY_CONFIG = {
    good:     { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    warning:  { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500' },
    critical: { bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-500' },
};

export function ModuleCards({ config = {} as any }: { config: ModuleCardsConfig; computed: any; slot: string }) {
    const modules = config.modules || [];
    const groups = config.groups || [];
    const qualities = config.qualities || [];
    const [selected, setSelected] = useState<string | null>(null);

    const selectedModule = modules.find(m => m.id === selected);

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-zinc-100 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-zinc-900">Core Modules</h2>
                    <p className="text-sm text-zinc-500 mt-0.5">{modules.length} modules{groups.length > 0 ? ` · ${groups.length} groups` : ''}</p>
                </div>
                {qualities.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {qualities.map(q => {
                            const cfg = QUALITY_CONFIG[q.status];
                            return (
                                <span key={q.id} className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1.5 ${cfg.bg} ${cfg.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{q.name}
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {modules.map((mod) => (
                        <button
                            key={mod.id}
                            onClick={() => setSelected(selected === mod.id ? null : mod.id)}
                            className={`text-left p-4 rounded-lg border transition-all duration-150 ${selected === mod.id ? 'border-blue-300 bg-blue-50 ring-1 ring-blue-200' : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-white'}`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="font-semibold text-zinc-900 text-sm">{mod.name}</div>
                                {(mod.dependsOnModuleIds?.length ?? 0) > 0 && (
                                    <span className="text-[10px] bg-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded flex-shrink-0">{mod.dependsOnModuleIds?.length} deps</span>
                                )}
                            </div>
                            <p className="text-xs text-zinc-500 mt-1 leading-snug">{mod.responsibility || mod.description}</p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {(mod.apis?.length ?? 0) > 0 && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{mod.apis?.length} APIs</span>}
                                {(mod.dataStores?.length ?? 0) > 0 && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">{mod.dataStores?.length} stores</span>}
                                {(mod.failureModes?.length ?? 0) > 0 && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded">{mod.failureModes?.length} failure modes</span>}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Detail panel for selected module */}
                {selectedModule && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="font-semibold text-blue-900 mb-2">{selectedModule.name}</div>
                        {selectedModule.description && <p className="text-sm text-blue-800 mb-3">{selectedModule.description}</p>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            {(selectedModule.keyDecisions?.length ?? 0) > 0 && (
                                <div>
                                    <div className="font-semibold text-blue-600 uppercase tracking-wide mb-1">Key Decisions</div>
                                    <ul className="space-y-0.5 text-blue-800">
                                        {selectedModule.keyDecisions?.map((d, i) => <li key={i}>• {d}</li>)}
                                    </ul>
                                </div>
                            )}
                            {(selectedModule.failureModes?.length ?? 0) > 0 && (
                                <div>
                                    <div className="font-semibold text-red-500 uppercase tracking-wide mb-1">Failure Modes</div>
                                    <ul className="space-y-0.5 text-red-700">
                                        {selectedModule.failureModes?.map((f, i) => <li key={i}>• {f}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
