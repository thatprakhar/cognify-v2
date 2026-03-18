'use client';
import React, { useEffect, useRef, useState } from 'react';
import { DiagramModuleConfig } from '../../../lib/schema/module-configs/diagram-module';

export function DiagramModule({ config = {} as any }: { config: DiagramModuleConfig; computed: any; slot: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [rendered, setRendered] = useState(false);

    useEffect(() => {
        if (!config.mermaidCode || !containerRef.current) return;
        let cancelled = false;

        const render = async () => {
            try {
                const mermaid = (await import('mermaid')).default;
                mermaid.initialize({ startOnLoad: false, theme: 'neutral', fontFamily: 'inherit' });
                const id = `mermaid-${Math.random().toString(36).slice(2)}`;
                const { svg } = await mermaid.render(id, config.mermaidCode);
                if (!cancelled && containerRef.current) {
                    containerRef.current.innerHTML = svg;
                    setRendered(true);
                    setError(null);
                }
            } catch (e: any) {
                if (!cancelled) setError(e.message || 'Failed to render diagram');
            }
        };

        render();
        return () => { cancelled = true; };
    }, [config.mermaidCode]);

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-zinc-100 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-zinc-900">{config.heading}</h2>
                    {config.diagramType && (
                        <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded font-mono capitalize mt-1 inline-block">{config.diagramType}</span>
                    )}
                </div>
            </div>

            <div className="p-6">
                {error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="text-sm font-semibold text-red-700 mb-1">Diagram render failed</div>
                        <pre className="text-xs text-red-600 overflow-auto">{error}</pre>
                        <pre className="mt-3 text-xs text-zinc-500 bg-zinc-50 p-3 rounded overflow-auto">{config.mermaidCode}</pre>
                    </div>
                ) : (
                    <div
                        ref={containerRef}
                        className="flex justify-center overflow-x-auto [&>svg]:max-w-full [&>svg]:h-auto"
                    />
                )}
                {config.caption && (
                    <p className="text-xs text-zinc-400 text-center mt-3 italic">{config.caption}</p>
                )}
            </div>
        </div>
    );
}
