'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/shadcn/card';
import {
    Table, TableHeader, TableBody, TableHead, TableRow, TableCell
} from '@/ui/shadcn/table';
import { Check, X, ArrowRight, Scale } from 'lucide-react';

/**
 * ComparisonModule — pre-built capability module.
 * LLM fills a typed config; this component handles all layout & interactivity.
 * No layout decisions needed from the LLM.
 */

import { type ComparisonModuleConfig } from './types';

export const ComparisonModule: React.FC<ComparisonModuleConfig> = ({
    title = '',
    subtitle,
    optionA,
    optionB,
    criteria = [],
    recommendation,
    isMockData,
}) => {
    const [activeView, setActiveView] = useState<'overview' | 'detailed'>('overview');

    if (!optionA || !optionB) return null;

    // Compute overall scores
    const totalA = criteria.reduce((sum, c) => sum + (c.optionAScore ?? 0), 0);
    const totalB = criteria.reduce((sum, c) => sum + (c.optionBScore ?? 0), 0);
    const maxScore = criteria.length * 10;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">{title}</h1>
                {subtitle && <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
                {isMockData && (
                    <span className="inline-block mt-2 bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                        Illustrative Data
                    </span>
                )}
            </div>

            {/* View Toggle */}
            <div className="flex justify-center">
                <div className="flex items-center bg-zinc-100 rounded-full p-0.5">
                    <button
                        onClick={() => setActiveView('overview')}
                        className={`px-5 py-1.5 text-sm font-medium rounded-full transition-all ${activeView === 'overview' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveView('detailed')}
                        className={`px-5 py-1.5 text-sm font-medium rounded-full transition-all ${activeView === 'detailed' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
                            }`}
                    >
                        Detailed
                    </button>
                </div>
            </div>

            {/* Score Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <Card className={`text-center ${totalA >= totalB ? 'ring-2 ring-blue-500' : ''}`}>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-foreground">{optionA.name}</h3>
                        <div className="text-4xl font-black text-blue-600 mt-2">{totalA}</div>
                        <div className="text-xs text-muted-foreground mt-1">/ {maxScore} points</div>
                        {optionA.description && (
                            <p className="text-sm text-muted-foreground mt-3">{optionA.description}</p>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
                        <Scale className="w-5 h-5 text-zinc-400" />
                    </div>
                </div>

                <Card className={`text-center ${totalB >= totalA ? 'ring-2 ring-emerald-500' : ''}`}>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-foreground">{optionB.name}</h3>
                        <div className="text-4xl font-black text-emerald-600 mt-2">{totalB}</div>
                        <div className="text-xs text-muted-foreground mt-1">/ {maxScore} points</div>
                        {optionB.description && (
                            <p className="text-sm text-muted-foreground mt-3">{optionB.description}</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Criteria Comparison Bars */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Criteria Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {criteria.map((c, idx) => (
                        <div key={idx} className="space-y-1.5">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-blue-600">{c.optionAScore}/10</span>
                                <span className="text-foreground">{c.name}</span>
                                <span className="text-emerald-600">{c.optionBScore}/10</span>
                            </div>
                            <div className="flex gap-1 h-2">
                                <div className="flex-1 bg-zinc-100 rounded-full overflow-hidden flex justify-end">
                                    <div
                                        className="bg-blue-500 rounded-full transition-all duration-500"
                                        style={{ width: `${(c.optionAScore / 10) * 100}%` }}
                                    />
                                </div>
                                <div className="flex-1 bg-zinc-100 rounded-full overflow-hidden">
                                    <div
                                        className="bg-emerald-500 rounded-full transition-all duration-500"
                                        style={{ width: `${(c.optionBScore / 10) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Detailed View — Pros/Cons + Stats */}
            {activeView === 'detailed' && (
                <>
                    {/* Pros & Cons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[optionA, optionB].map((option, oi) => (
                            <Card key={oi}>
                                <CardHeader>
                                    <CardTitle className="text-base">{option.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {option.pros?.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-emerald-700 mb-2">Advantages</h4>
                                            <ul className="space-y-1.5">
                                                {option.pros.map((pro, pi) => (
                                                    <li key={pi} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                                        {pro}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {option.cons?.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-red-700 mb-2">Disadvantages</h4>
                                            <ul className="space-y-1.5">
                                                {option.cons.map((con, ci) => (
                                                    <li key={ci} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                        <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                                        {con}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Stats Table */}
                    {Object.keys(optionA.stats || {}).length > 0 && (
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead>Metric</TableHead>
                                            <TableHead className="text-blue-600">{optionA.name}</TableHead>
                                            <TableHead className="text-emerald-600">{optionB.name}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.keys(optionA.stats).map((key) => (
                                            <TableRow key={key}>
                                                <TableCell className="font-medium">{key}</TableCell>
                                                <TableCell>{optionA.stats[key]}</TableCell>
                                                <TableCell>{optionB.stats?.[key] ?? '—'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}

            {/* Recommendation */}
            {recommendation && (
                <Card className="bg-zinc-900 text-white">
                    <CardContent className="p-6 flex items-start gap-4">
                        <ArrowRight className="w-5 h-5 mt-0.5 shrink-0 text-blue-400" />
                        <div>
                            <h4 className="font-semibold text-sm mb-1">Recommendation</h4>
                            <p className="text-sm text-zinc-300 leading-relaxed">{recommendation}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
