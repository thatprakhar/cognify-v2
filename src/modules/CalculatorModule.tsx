'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/shadcn/card';
import {
    Table, TableHeader, TableBody, TableHead, TableRow, TableCell
} from '@/ui/shadcn/table';
import { Label } from '@/ui/shadcn/label';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { TrendingUp, Calculator as CalcIcon } from 'lucide-react';

/**
 * CalculatorModule — pre-built capability module for financial projections.
 * LLM provides the config (rates, amounts, labels). All computation is client-side deterministic.
 */

import { type CalculatorModuleConfig, type CalculatorInput } from './types';

import { computeCompoundGrowth, computeSavingsProjection } from '@/lib/computation/finance';

// --- Computation Engine (deterministic) ---

export const CalculatorModule: React.FC<CalculatorModuleConfig> = ({
    title = '',
    subtitle,
    inputs = [],
    formula = 'compound_growth',
    outputLabel,
    scenarios = [],
    isMockData,
}) => {
    // Build state from inputs
    const defaultValues: Record<string, number> = {};
    for (const inp of inputs) {
        defaultValues[inp.name] = inp.defaultValue;
    }
    const [values, setValues] = useState<Record<string, number>>(defaultValues);
    const [activeScenario, setActiveScenario] = useState<number | null>(null);

    const effectiveValues = useMemo(() => {
        if (activeScenario !== null && scenarios[activeScenario]) {
            return { ...values, ...scenarios[activeScenario].overrides };
        }
        return values;
    }, [values, activeScenario, scenarios]);

    // Compute data based on formula
    const computedData = useMemo(() => {
        const v = effectiveValues;
        switch (formula) {
            case 'compound_growth':
                return computeCompoundGrowth(
                    v.principal ?? v.initialAmount ?? 0,
                    v.monthlyContribution ?? v.monthlySavings ?? 0,
                    (v.annualRate ?? v.returnRate ?? 8) / 100,
                    v.years ?? 5,
                );
            case 'savings_projection':
                return computeSavingsProjection(
                    v.monthlySavings ?? v.monthlyContribution ?? 0,
                    (v.annualRate ?? v.returnRate ?? 5) / 100,
                    v.years ?? 5,
                );
            default:
                return [];
        }
    }, [effectiveValues, formula]);

    const finalValue = computedData.length > 0
        ? computedData[computedData.length - 1]
        : null;

    const updateValue = (name: string, val: number) => {
        setActiveScenario(null);
        setValues(prev => ({ ...prev, [name]: val }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <CalcIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                    </div>
                </div>
                {isMockData && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                        Default Parameters
                    </span>
                )}
            </div>

            {/* Input Controls */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    {inputs.map((inp) => (
                        <div key={inp.name}>
                            <div className="flex justify-between items-center mb-2">
                                <Label className="text-sm">{inp.label}</Label>
                                <span className="text-sm font-bold text-blue-600">
                                    {inp.unit === '$' && '$'}
                                    {(effectiveValues[inp.name] ?? inp.defaultValue).toLocaleString()}
                                    {inp.unit === '%' && '%'}
                                    {inp.unit && inp.unit !== '$' && inp.unit !== '%' && ` ${inp.unit}`}
                                </span>
                            </div>
                            <input
                                type="range"
                                min={inp.min}
                                max={inp.max}
                                step={inp.step}
                                value={effectiveValues[inp.name] ?? inp.defaultValue}
                                onChange={(e) => updateValue(inp.name, Number(e.target.value))}
                                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>{inp.unit === '$' ? `$${inp.min.toLocaleString()}` : inp.min}{inp.unit === '%' ? '%' : ''}</span>
                                <span>{inp.unit === '$' ? `$${inp.max.toLocaleString()}` : inp.max}{inp.unit === '%' ? '%' : ''}</span>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Scenario Buttons */}
            {scenarios.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {scenarios.map((s, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveScenario(activeScenario === idx ? null : idx)}
                            className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${activeScenario === idx
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                                }`}
                        >
                            {s.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Result Card */}
            {finalValue && (
                <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <TrendingUp className="w-8 h-8 shrink-0 opacity-80" />
                        <div>
                            <div className="text-sm font-medium opacity-80">{outputLabel || 'Projected Value'}</div>
                            <div className="text-3xl font-black">
                                ${'total' in finalValue
                                    ? finalValue.total.toLocaleString()
                                    : 'withInterest' in finalValue
                                        ? (finalValue as { withInterest: number }).withInterest.toLocaleString()
                                        : '—'}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Chart */}
            {computedData.length > 0 && (
                <Card>
                    <CardContent className="p-4 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={computedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }}
                                    tickFormatter={(v) => `Year ${v}`} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }}
                                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number | undefined) => [`$${(value ?? 0).toLocaleString()}`, '']}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: '20px' }} />
                                {'contributions' in (computedData[0] || {}) ? (
                                    <>
                                        <Area type="monotone" dataKey="total" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2.5} name="Total Value" />
                                        <Area type="monotone" dataKey="contributions" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} name="Contributions" />
                                    </>
                                ) : (
                                    <>
                                        <Area type="monotone" dataKey="withInterest" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2.5} name="With Interest" />
                                        <Area type="monotone" dataKey="saved" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} name="Saved (No Interest)" />
                                    </>
                                )}
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            {/* Data Table */}
            {computedData.length > 0 && (
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Year</TableHead>
                                    {'contributions' in (computedData[0] || {}) ? (
                                        <>
                                            <TableHead>Contributions</TableHead>
                                            <TableHead>Interest Earned</TableHead>
                                            <TableHead className="font-semibold">Total</TableHead>
                                        </>
                                    ) : (
                                        <>
                                            <TableHead>Saved</TableHead>
                                            <TableHead className="font-semibold">With Interest</TableHead>
                                        </>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {computedData.map((row, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>Year {row.year}</TableCell>
                                        {'contributions' in row ? (
                                            <>
                                                <TableCell>${(row as { contributions: number }).contributions.toLocaleString()}</TableCell>
                                                <TableCell>${(row as { interest: number }).interest.toLocaleString()}</TableCell>
                                                <TableCell className="font-semibold">${(row as { total: number }).total.toLocaleString()}</TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell>${(row as { saved: number }).saved.toLocaleString()}</TableCell>
                                                <TableCell className="font-semibold">${(row as { withInterest: number }).withInterest.toLocaleString()}</TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
