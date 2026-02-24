import React from 'react';
import { RiskPanelConfig } from '../../../lib/schema/module-configs/risk-panel';

export function RiskPanel({ config = {} as any, computed, slot }: { config: RiskPanelConfig, computed: any, slot: string }) {
    return (
        <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Risk Panel</h2>
            <ul className="space-y-4">
                {(config?.risks || []).map(r => (
                    <li key={r.id || Math.random()} className="p-4 border border-red-200 bg-red-50 rounded-md">
                        <div className="font-bold text-red-900">{r.title}</div>
                        <p className="text-sm text-red-800">{r.description}</p>
                        <div className="mt-2 text-xs">
                            <span className="font-semibold">Mitigations:</span> {(r.mitigations || []).join(', ')}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
