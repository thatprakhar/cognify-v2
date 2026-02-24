import React from 'react';
import { TradeoffMatrixConfig } from '../../../lib/schema/module-configs/tradeoff-matrix';

export function TradeoffMatrix({ config = {} as any, computed, slot }: { config: TradeoffMatrixConfig, computed: any, slot: string }) {
    return (
        <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Tradeoff Matrix</h2>
            <pre className="p-4 bg-slate-50 text-xs text-slate-700 rounded overflow-auto">
                {JSON.stringify({ config, computed }, null, 2)}
            </pre>
        </div>
    );
}
