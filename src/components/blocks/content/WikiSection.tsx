import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WikiSectionProps {
    heading: string;
    body: string;
    viewMode?: 'simple' | 'advanced';
}

export const WikiSection: React.FC<WikiSectionProps> = ({ heading = '', body = '', viewMode = 'simple' }) => {
    const [isExpanded, setIsExpanded] = useState(viewMode === 'advanced');

    useEffect(() => {
        setIsExpanded(viewMode === 'advanced');
    }, [viewMode]);

    // Make code blocks collapsible by default and lower contrast
    const formattedBody = typeof body === 'string'
        ? body.replace(/<pre([^>]*)>([\s\S]*?)<\/pre>/gi, (match, attrs, content) => {
            return `<details class="group my-5 rounded-xl border border-zinc-200/50 bg-zinc-50/50 overflow-hidden"><summary class="cursor-pointer px-4 py-3 text-[13px] font-medium text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/50 transition-colors list-none flex items-center justify-between select-none"><span>View Code Snippet</span><svg class="w-4 h-4 text-zinc-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></summary><div class="px-4 pb-4 pt-1 opacity-90 text-[13px] overflow-x-auto"><pre${attrs} class="bg-transparent! m-0! p-0!">${content}</pre></div></details>`;
        })
        : body;

    return (
        <section className="my-8 bg-white border border-zinc-200/80 rounded-2xl p-6 lg:p-8 shadow-sm">
            <div
                className="flex justify-between items-center cursor-pointer group"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="text-xl font-semibold text-zinc-900">
                    {heading}
                </h2>
                <button className="text-zinc-400 group-hover:text-zinc-800 transition-colors p-1 bg-zinc-50 rounded-full">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
            </div>

            <AnimatePresence initial={false}>
                {isExpanded ? (
                    <motion.div
                        key="expanded"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div
                            className="pt-4 prose prose-zinc max-w-none text-zinc-700 leading-relaxed prose-p:text-[15px] prose-headings:font-medium"
                            dangerouslySetInnerHTML={{ __html: formattedBody }}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="collapsed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative cursor-pointer mt-4"
                        onClick={() => setIsExpanded(true)}
                    >
                        <div
                            className="prose prose-zinc max-w-none text-zinc-700 leading-relaxed max-h-[88px] overflow-hidden"
                            style={{ maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)' }}
                            dangerouslySetInnerHTML={{ __html: formattedBody }}
                        />
                        <div className="absolute bottom-0 left-0 text-blue-600 text-[13px] font-medium hover:text-blue-700 px-1 pb-1">
                            Read deeper
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
