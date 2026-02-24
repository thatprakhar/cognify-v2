'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from '@/ui/shadcn/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

// --- CognifyWikiSection ---
// Renders markdown content safely (no raw HTML) using react-markdown.
// Supports simple/advanced view modes with collapsible content.

interface CognifyWikiSectionProps {
    heading: string;
    body: string;
    viewMode?: 'simple' | 'advanced';
}

export const CognifyWikiSection: React.FC<CognifyWikiSectionProps> = ({
    heading = '',
    body = '',
    viewMode = 'simple',
}) => {
    const [isExpanded, setIsExpanded] = useState(viewMode === 'advanced');

    useEffect(() => {
        setIsExpanded(viewMode === 'advanced');
    }, [viewMode]);

    return (
        <Card className="my-4">
            <div
                className="flex justify-between items-center cursor-pointer group p-6 pb-0"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="text-xl font-semibold text-foreground">{heading}</h2>
                <button className="text-muted-foreground group-hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
            </div>
            <CardContent className={isExpanded ? 'pt-4' : 'pt-4 max-h-[88px] overflow-hidden relative'}>
                <div className="prose prose-zinc max-w-none text-muted-foreground leading-relaxed prose-p:text-[15px] prose-headings:font-medium">
                    {/* Safe markdown rendering: skipHtml prevents raw HTML injection */}
                    <ReactMarkdown skipHtml>{body}</ReactMarkdown>
                </div>
                {!isExpanded && (
                    <div
                        className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent pointer-events-none"
                    />
                )}
            </CardContent>
            {!isExpanded && (
                <div className="px-6 pb-4">
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        Read deeper
                    </button>
                </div>
            )}
        </Card>
    );
};
