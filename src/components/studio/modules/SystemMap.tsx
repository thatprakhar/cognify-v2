import React from 'react';
import { SystemMapConfig } from '../../../lib/schema/module-configs/system-map';

export function SystemMap({ config = {} as any, computed, slot }: { config: SystemMapConfig, computed: any, slot: string }) {
    return (
        <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="font-semibold text-lg mb-4">System Map</h2>
            <pre className="p-4 bg-slate-50 text-xs text-slate-700 rounded overflow-auto">
                {JSON.stringify({ config, computed }, null, 2)}
            </pre>
        </div>
    );
}
