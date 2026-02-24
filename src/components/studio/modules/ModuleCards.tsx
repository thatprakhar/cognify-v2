import React from 'react';
import { ModuleCardsConfig } from '../../../lib/schema/module-configs/module-cards';

export function ModuleCards({ config = {} as any, computed, slot }: { config: ModuleCardsConfig, computed: any, slot: string }) {
    return (
        <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Core Modules</h2>
            <div className="grid gap-4">
                {(config?.modules || []).map(m => (
                    <div key={m.id || Math.random()} className="p-4 border rounded shadow-sm">
                        <h3 className="font-bold">{m.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{m.description}</p>
                        <div className="text-xs">
                            <span className="font-semibold">Responsibility:</span> {m.responsibility}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
