'use client';

import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { Card, CardContent } from '@/ui/shadcn/card';
import { DiagramModuleConfig } from './types';
import { Maximize2, Minimize2 } from 'lucide-react';

interface DiagramModuleProps extends DiagramModuleConfig { }

export const DiagramModule: React.FC<DiagramModuleProps> = ({ title, subtitle, mermaidCode }) => {
    const [svgContent, setSvgContent] = useState<string>('');
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            securityLevel: 'loose',
            themeVariables: {
                primaryColor: '#f4f4f5',
                primaryTextColor: '#18181b',
                primaryBorderColor: '#e4e4e7',
                lineColor: '#52525b',
                secondaryColor: '#fff',
                tertiaryColor: '#fff'
            }
        });

        const renderDiagram = async () => {
            try {
                const id = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
                // mermaid.render returns an object with svg string
                const { svg } = await mermaid.render(id, mermaidCode);
                setSvgContent(svg);
            } catch (err) {
                console.error("Mermaid parsing failed", err);
                setSvgContent(`<div class="text-red-500 p-4 border border-red-200 rounded-md bg-red-50 text-sm">Syntax error in Mermaid diagram.<br/>Please ask for a correction.</div>`);
            }
        };

        if (mermaidCode) {
            renderDiagram();
        }
    }, [mermaidCode]);

    return (
        <div className="flex flex-col gap-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-1 px-1">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">{title}</h2>
                {subtitle && <p className="text-zinc-500">{subtitle}</p>}
            </div>

            <Card className={`relative overflow-hidden transition-all duration-300 ${isExpanded ? 'fixed inset-4 z-50 flex flex-col shadow-2xl bg-white' : 'my-2'}`}>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="absolute top-4 right-4 z-10 p-2 rounded-md bg-white/80 hover:bg-zinc-100 border border-zinc-200 text-zinc-600 transition-colors"
                >
                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <CardContent className={`p-6 flex items-center justify-center bg-zinc-50/50 ${isExpanded ? 'flex-1 overflow-auto' : 'min-h-[300px]'}`}>
                    <div
                        className="mermaid-container w-full h-full flex items-center justify-center flex-col"
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                    />
                </CardContent>
            </Card>
        </div>
    );
};
