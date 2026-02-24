'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Card, CardContent } from '@/ui/shadcn/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import 'katex/dist/katex.min.css';

// --- CognifyWikiSection V2 ---
// Renders rich markdown safely (no raw HTML) using react-markdown.
// Supports:
// - GitHub Flavored Markdown (tables, strikethrough, task lists)
// - Code syntax highlighting (react-syntax-highlighter)
// - Inline and block Math equations (remark-math, rehype-katex)

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
        <Card className="my-6 shadow-sm border-zinc-200 overflow-hidden transition-all duration-300">
            <div
                className="flex justify-between items-center cursor-pointer group p-5 bg-zinc-50/50 border-b border-zinc-100"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="text-[1.15rem] font-semibold text-zinc-900 tracking-tight">{heading}</h2>
                <button className="text-zinc-400 group-hover:text-zinc-600 transition-colors p-1 rounded-full hover:bg-zinc-100">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
            </div>
            <CardContent className={isExpanded ? 'pt-5 pb-6 px-6' : 'pt-5 px-6 max-h-[120px] overflow-hidden relative'}>
                <div className="prose prose-zinc max-w-none text-zinc-600 leading-[1.7] 
                                prose-headings:font-semibold prose-headings:text-zinc-900 prose-headings:tracking-tight
                                prose-p:text-[15px] prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                                prose-li:marker:text-zinc-400 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50/50
                                prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:text-zinc-700
                                prose-th:bg-zinc-100 prose-th:p-2 prose-td:p-2 prose-table:border prose-table:border-zinc-200">

                    {/* Safe markdown rendering: skipHtml prevents raw HTML injection */}
                    <ReactMarkdown
                        skipHtml
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                            // Custom code block renderer for Syntax Highlighting
                            code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <div className="my-4 rounded-md overflow-hidden border border-zinc-200">
                                        <div className="bg-zinc-100 px-4 py-1.5 text-xs font-mono text-zinc-500 border-b border-zinc-200 flex justify-between items-center">
                                            <span>{match[1]}</span>
                                        </div>
                                        <SyntaxHighlighter
                                            {...props}
                                            style={oneLight}
                                            language={match[1]}
                                            PreTag="div"
                                            className="text-sm m-0! bg-zinc-50/50!"
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    </div>
                                ) : (
                                    <code {...props} className={`${className} bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded-md text-[0.9em] font-medium font-mono`}>
                                        {children}
                                    </code>
                                );
                            },
                            // Custom table wrapper for horizontal scrolling
                            table({ children, ...props }: any) {
                                return (
                                    <div className="overflow-x-auto my-6 rounded-lg border border-zinc-200">
                                        <table className="w-full text-sm text-left m-0!" {...props}>
                                            {children}
                                        </table>
                                    </div>
                                );
                            }
                        }}
                    >
                        {body}
                    </ReactMarkdown>
                </div>
                {!isExpanded && (
                    <div
                        className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"
                    />
                )}
            </CardContent>
            {!isExpanded && (
                <div className="px-6 pb-4 pt-2 bg-white flex justify-center border-t border-zinc-50">
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-1.5 rounded-full transition-colors"
                    >
                        Read Full Section
                    </button>
                </div>
            )}
        </Card>
    );
};
