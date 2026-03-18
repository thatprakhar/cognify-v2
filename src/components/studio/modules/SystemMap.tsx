'use client';
import React, { useState } from 'react';
import { SystemMapConfig } from '../../../lib/schema/module-configs/system-map';

const NODE_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
    user:         { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-800',   dot: 'bg-blue-500' },
    service:      { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800', dot: 'bg-violet-500' },
    database:     { bg: 'bg-emerald-50',border: 'border-emerald-200',text: 'text-emerald-800',dot: 'bg-emerald-500' },
    external:     { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', dot: 'bg-orange-500' },
    client:       { bg: 'bg-sky-50',    border: 'border-sky-200',    text: 'text-sky-800',    dot: 'bg-sky-500' },
    worker:       { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-800',  dot: 'bg-amber-500' },
    queue:        { bg: 'bg-pink-50',   border: 'border-pink-200',   text: 'text-pink-800',   dot: 'bg-pink-500' },
    concept:      { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800', dot: 'bg-indigo-500' },
    process:      { bg: 'bg-teal-50',   border: 'border-teal-200',   text: 'text-teal-800',   dot: 'bg-teal-500' },
    person:       { bg: 'bg-rose-50',   border: 'border-rose-200',   text: 'text-rose-800',   dot: 'bg-rose-500' },
    organization: { bg: 'bg-slate-50',  border: 'border-slate-200',  text: 'text-slate-800',  dot: 'bg-slate-500' },
    event:        { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', dot: 'bg-yellow-500' },
};

const EDGE_STYLE: Record<string, { label: string; color: string }> = {
    sync:   { label: '→',  color: 'text-zinc-500' },
    async:  { label: '⇢',  color: 'text-amber-500' },
    stream: { label: '⟿',  color: 'text-blue-500' },
    event:  { label: '⊛',  color: 'text-violet-500' },
};

export function SystemMap({ config = {} as any }: { config: SystemMapConfig; computed: any; slot: string }) {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const nodes = config.nodes || [];
    const edges = config.edges || [];
    const callouts = config.callouts || [];
    const legend = config.legend || [];

    const getNodeColors = (type: string) => NODE_COLORS[type] || NODE_COLORS['service'];

    const nodeEdgeMap: Record<string, string[]> = {};
    for (const edge of edges) {
        if (!nodeEdgeMap[edge.from]) nodeEdgeMap[edge.from] = [];
        if (!nodeEdgeMap[edge.to]) nodeEdgeMap[edge.to] = [];
        nodeEdgeMap[edge.from].push(edge.to);
        nodeEdgeMap[edge.to].push(edge.from);
    }

    const isHighlighted = (nodeId: string) => {
        if (!hoveredNode) return true;
        return nodeId === hoveredNode || (nodeEdgeMap[hoveredNode] || []).includes(nodeId);
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-zinc-100">
                <h2 className="text-lg font-semibold text-zinc-900">System Map</h2>
                {nodes.length > 0 && (
                    <p className="text-sm text-zinc-500 mt-0.5">{nodes.length} components · {edges.length} connections</p>
                )}
            </div>

            <div className="p-6 space-y-6">
                {/* Nodes grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {nodes.map((node) => {
                        const colors = getNodeColors(node.type);
                        const highlighted = isHighlighted(node.id);
                        return (
                            <div
                                key={node.id}
                                onMouseEnter={() => setHoveredNode(node.id)}
                                onMouseLeave={() => setHoveredNode(null)}
                                className={`${colors.bg} ${colors.border} border rounded-lg p-3 cursor-default transition-all duration-150 ${highlighted ? 'opacity-100' : 'opacity-30'}`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                                    <span className={`text-xs font-semibold uppercase tracking-wide ${colors.text}`}>{node.type}</span>
                                </div>
                                <div className="font-medium text-zinc-900 text-sm leading-tight">{node.label}</div>
                                {node.description && (
                                    <p className="text-xs text-zinc-500 mt-1 leading-snug line-clamp-2">{node.description}</p>
                                )}
                                {node.tags && node.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {node.tags.map(tag => (
                                            <span key={tag} className="text-[10px] bg-white/70 border border-zinc-200 text-zinc-500 px-1.5 py-0.5 rounded-full">{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Edges */}
                {edges.length > 0 && (
                    <div>
                        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Connections</h3>
                        <div className="space-y-1.5">
                            {edges.map((edge) => {
                                const style = EDGE_STYLE[edge.type] || EDGE_STYLE['sync'];
                                const fromNode = nodes.find(n => n.id === edge.from);
                                const toNode = nodes.find(n => n.id === edge.to);
                                const active = !hoveredNode || hoveredNode === edge.from || hoveredNode === edge.to;
                                return (
                                    <div key={edge.id} className={`flex items-center gap-2 text-sm transition-opacity duration-150 ${active ? 'opacity-100' : 'opacity-20'}`}>
                                        <span className="font-medium text-zinc-700 text-xs min-w-[80px] truncate">{fromNode?.label || edge.from}</span>
                                        <span className={`text-base font-bold ${style.color}`}>{style.label}</span>
                                        <span className="font-medium text-zinc-700 text-xs truncate">{toNode?.label || edge.to}</span>
                                        {edge.label && <span className="text-xs text-zinc-400 ml-1 italic truncate">({edge.label})</span>}
                                        <span className="ml-auto text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">{edge.type}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Callouts */}
                {callouts.length > 0 && (
                    <div className="space-y-2">
                        {callouts.map((c) => (
                            <div key={c.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="font-semibold text-blue-900 text-sm">{c.title}</div>
                                <p className="text-xs text-blue-700 mt-0.5">{c.content}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Legend */}
                {legend.length > 0 && (
                    <div className="flex flex-wrap gap-3 pt-2 border-t border-zinc-100">
                        {legend.map((item, i) => {
                            const colors = getNodeColors(item.type);
                            return (
                                <div key={i} className="flex items-center gap-1.5 text-xs text-zinc-600">
                                    <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                                    {item.label}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
