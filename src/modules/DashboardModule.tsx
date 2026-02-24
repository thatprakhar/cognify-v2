import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/shadcn/card';
import { CognifyChart } from '@/ui/cognify/chart';
import { CognifyTable } from '@/ui/cognify/content-blocks';
import { DashboardModuleConfig } from './types';

interface DashboardModuleProps extends DashboardModuleConfig {
    data?: any[];
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
    title,
    subtitle,
    charts,
    dataGrid,
    isMockData,
    data = []
}) => {
    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-1 px-1">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">{title}</h2>
                {subtitle && <p className="text-zinc-500">{subtitle}</p>}
            </div>

            {charts && charts.length > 0 && (
                <div className={`grid gap-6 ${charts.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                    {charts.map((chartConfig, idx) => (
                        <div key={idx} className="flex flex-col gap-2">
                            <h3 className="text-sm font-semibold text-zinc-700 px-1">{chartConfig.title}</h3>
                            {chartConfig.description && (
                                <p className="text-xs text-zinc-500 px-1">{chartConfig.description}</p>
                            )}
                            <CognifyChart
                                type={chartConfig.type}
                                data={data}
                                xKey={chartConfig.xAxisKey}
                                yKeys={chartConfig.yAxisKeys}
                                isMockData={isMockData}
                            />
                        </div>
                    ))}
                </div>
            )}

            {dataGrid && dataGrid.columns && dataGrid.columns.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-sm font-semibold text-zinc-700 px-1 mb-3">Data View</h3>
                    <CognifyTable
                        headers={dataGrid.columns}
                        rows={data.slice(0, 100).map(row =>
                            dataGrid.columns.map(col => {
                                const val = row[col];
                                if (typeof val === 'number') return val.toLocaleString(undefined, { maximumFractionDigits: 2 });
                                return String(val ?? '');
                            })
                        )}
                        caption={`Showing up to 100 rows.`}
                    />
                </div>
            )}
        </div>
    );
};
