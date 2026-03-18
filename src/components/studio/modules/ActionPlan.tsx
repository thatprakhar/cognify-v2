'use client';
import React, { useState } from 'react';
import { ActionPlanConfig } from '../../../lib/schema/module-configs/action-plan';

const PRIORITY_CONFIG = {
    high:   { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500' },
    medium: { bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-400' },
    low:    { bg: 'bg-zinc-100',   text: 'text-zinc-600',   dot: 'bg-zinc-400' },
};

const EFFORT_CONFIG = {
    low:    { label: '○○○', title: 'Low effort' },
    medium: { label: '●○○', title: 'Medium effort' },
    high:   { label: '●●○', title: 'High effort' },
};

export function ActionPlan({ config = {} as any }: { config: ActionPlanConfig; computed: any; slot: string }) {
    const phases = config.phases || [];
    const [done, setDone] = useState<Set<string>>(new Set());
    const [activePhase, setActivePhase] = useState<string>(phases[0]?.id ?? '');

    const totalActions = phases.reduce((s, p) => s + (p.actions?.length ?? 0), 0);
    const doneCount = done.size;

    const toggleDone = (id: string) => {
        setDone(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-zinc-100">
                <h2 className="text-lg font-semibold text-zinc-900">{config.heading}</h2>
                {config.context && <p className="text-sm text-zinc-500 mt-1">{config.context}</p>}
                <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                            style={{ width: totalActions > 0 ? `${(doneCount / totalActions) * 100}%` : '0%' }} />
                    </div>
                    <span className="text-xs text-zinc-500 flex-shrink-0">{doneCount}/{totalActions} done</span>
                </div>
            </div>

            {/* Phase tabs */}
            <div className="flex gap-1 px-6 pt-4 pb-0 overflow-x-auto">
                {phases.map((phase, i) => {
                    const phaseDone = (phase.actions || []).filter(a => done.has(a.id)).length;
                    const isActive = activePhase === phase.id;
                    return (
                        <button key={phase.id} onClick={() => setActivePhase(phase.id)}
                            className={`flex-shrink-0 px-3 py-2 text-sm rounded-t-lg border-b-2 transition-all ${isActive ? 'border-blue-500 text-blue-700 font-semibold bg-blue-50' : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'}`}>
                            <span>{phase.name}</span>
                            {phaseDone > 0 && (
                                <span className="ml-1.5 text-[10px] bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded-full font-bold">{phaseDone}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="p-6">
                {phases.filter(p => p.id === activePhase).map(phase => (
                    <div key={phase.id}>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">{phase.timeframe}</span>
                            <span className="text-xs text-zinc-400">{(phase.actions || []).length} actions</span>
                        </div>
                        <div className="space-y-2">
                            {(phase.actions || []).map(action => {
                                const isDone = done.has(action.id);
                                const pri = PRIORITY_CONFIG[action.priority] ?? PRIORITY_CONFIG.medium;
                                const eff = EFFORT_CONFIG[action.effort] ?? EFFORT_CONFIG.medium;
                                return (
                                    <div key={action.id}
                                        className={`flex gap-3 p-3 rounded-lg border transition-all cursor-pointer ${isDone ? 'bg-emerald-50 border-emerald-200 opacity-60' : 'bg-zinc-50 border-zinc-200 hover:bg-white hover:border-zinc-300'}`}
                                        onClick={() => toggleDone(action.id)}>
                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${isDone ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-300'}`}>
                                            {isDone && <span className="text-white text-[10px] font-bold">✓</span>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`font-medium text-sm ${isDone ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>{action.title}</span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${pri.bg} ${pri.text}`}>
                                                    <span className={`w-1 h-1 rounded-full ${pri.dot}`} />{action.priority}
                                                </span>
                                                <span className="text-[10px] text-zinc-400 ml-auto" title={eff.title}>{eff.label}</span>
                                            </div>
                                            <p className="text-xs text-zinc-500 mt-0.5 leading-snug">{action.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
