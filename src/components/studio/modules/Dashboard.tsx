'use client';
import React from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DashboardConfig } from '../../../lib/schema/module-configs/dashboard';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

interface DashboardProps {
    config: DashboardConfig;
    computed: any;
    slot: string;
    csvData?: any[];
}

export function Dashboard({ config = {} as any, computed, csvData }: DashboardProps) {
    const charts = config.charts || [];
    const data = csvData || computed?.data || [];

    const renderChart = (chart: any, index: number) => {
        if (data.length === 0) {
            return (
                <div className="flex items-center justify-center h-40 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-center">
                        <div className="text-amber-600 text-sm font-semibold">No data available</div>
                        <div className="text-amber-500 text-xs mt-1">Upload a CSV file to populate this chart</div>
                    </div>
                </div>
            );
        }

        const commonProps = {
            data,
            margin: { top: 5, right: 10, left: -10, bottom: 5 },
        };

        switch (chart.type) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart {...commonProps}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                            <XAxis dataKey={chart.xAxisKey} tick={{ fontSize: 11, fill: '#71717a' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#71717a' }} />
                            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                            {(chart.yAxisKeys || []).map((key: string, i: number) => (
                                <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart {...commonProps}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                            <XAxis dataKey={chart.xAxisKey} tick={{ fontSize: 11, fill: '#71717a' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#71717a' }} />
                            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                            {(chart.yAxisKeys || []).map((key: string, i: number) => (
                                <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                );
            case 'area':
                return (
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart {...commonProps}>
                            <defs>
                                {(chart.yAxisKeys || []).map((key: string, i: number) => (
                                    <linearGradient key={key} id={`grad-${index}-${i}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.15} />
                                        <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                            <XAxis dataKey={chart.xAxisKey} tick={{ fontSize: 11, fill: '#71717a' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#71717a' }} />
                            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                            {(chart.yAxisKeys || []).map((key: string, i: number) => (
                                <Area key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={2} fill={`url(#grad-${index}-${i})`} />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                );
            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={data} dataKey={chart.yAxisKeys?.[0] || 'value'} nameKey={chart.xAxisKey} cx="50%" cy="50%" outerRadius={75} innerRadius={35}>
                                {data.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                            <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                        </PieChart>
                    </ResponsiveContainer>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-zinc-100 flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-zinc-900">{config.heading}</h2>
                    {config.description && <p className="text-sm text-zinc-500 mt-0.5">{config.description}</p>}
                </div>
                {config.isMockData && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0">Illustrative Data</span>
                )}
            </div>

            <div className="p-6">
                <div className={`grid gap-4 ${charts.length >= 2 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                    {charts.map((chart: any, i: number) => (
                        <div key={i} className="space-y-2">
                            <div className="text-sm font-semibold text-zinc-700">{chart.title}</div>
                            {chart.description && <p className="text-xs text-zinc-400">{chart.description}</p>}
                            {renderChart(chart, i)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
