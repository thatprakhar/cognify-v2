import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    trend?: string; // e.g. "+5%", "-2.3%", "0%"
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, trend }) => {
    let TrendIcon = Minus;
    let trendColor = 'text-zinc-500';

    if (trend) {
        if (trend.startsWith('+')) {
            TrendIcon = TrendingUp;
            trendColor = 'text-emerald-500 dark:text-emerald-400';
        } else if (trend.startsWith('-')) {
            TrendIcon = TrendingDown;
            trendColor = 'text-red-500 dark:text-red-400';
        }
    }

    return (
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                {label}
            </span>
            <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    {value}
                </span>
                {trend && (
                    <span className={`flex items-center text-sm font-medium ${trendColor} bg-opacity-10 px-2 py-0.5 rounded-full`}>
                        <TrendIcon className="w-4 h-4 mr-1" />
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );
};
