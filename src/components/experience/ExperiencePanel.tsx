'use client';

import React from 'react';
import { UISpec, AnswerSpec, UXPlan } from '@/lib/pipeline/types';
import { RenderRoot } from '@/renderer/renderNode';
import { DebugPanel } from './DebugPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Download, Copy } from 'lucide-react';
import { DEFAULT_ACCENT } from '@/lib/schema/allowlist';
import type { UINodeSchema } from '@/lib/schema/ui-spec';

import { ExperienceProvider } from './ExperienceContext';

interface ExperiencePanelProps {
    uiSpec: UISpec | null;
    uiSpecRaw: string | null;
    answerSpec: AnswerSpec | null;
    uxPlan: UXPlan | null;
    isGenerating: boolean;
    runMetadata: any;
    validationData: any;
    onSubmitClarification?: (answers: Record<string, string>) => void;
}

export const ExperiencePanel: React.FC<ExperiencePanelProps> = ({
    uiSpec,
    uiSpecRaw,
    answerSpec,
    uxPlan,
    isGenerating,
    runMetadata,
    validationData,
    onSubmitClarification
}) => {
    const [viewMode, setViewMode] = React.useState<'simple' | 'advanced'>('simple');

    // Auto-reset to simple mode when a new experience starts generating
    React.useEffect(() => {
        if (isGenerating) setViewMode('simple');
    }, [isGenerating]);

    const handleCopy = () => {
        if (uiSpecRaw) navigator.clipboard.writeText(uiSpecRaw);
    };

    const handleDownload = () => {
        if (!uiSpecRaw) return;
        const blob = new Blob([uiSpecRaw], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `experience-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Resolve accent color (scoped to this panel, not :root)
    const accent = uiSpec?.theme?.accent ?? DEFAULT_ACCENT;

    return (
        <div className="w-full h-full bg-[#FAFAFA] relative overflow-hidden" data-accent={accent}>
            <AnimatePresence mode="wait">
                {!uiSpec && !isGenerating && (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 p-8 text-center"
                    >
                        <Layers className="w-16 h-16 mb-4 opacity-20" />
                        <h2 className="text-xl font-medium mb-2 opacity-50">No Experience Generated</h2>
                        <p className="max-w-md opacity-50">
                            Upload your expenses on the left, and watch Cognify build your interactive experience here.
                        </p>
                    </motion.div>
                )}

                {isGenerating && !uiSpec && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 p-8 overflow-hidden"
                    >
                        {/* Skeleton Wireframe */}
                        <div className="w-full h-full flex flex-col gap-6 opacity-60">
                            <div className="h-40 bg-white border border-zinc-100 shadow-sm rounded-3xl w-full"></div>
                            <div className="flex gap-6 h-64">
                                <div className="w-1/3 bg-white border border-zinc-100 shadow-sm rounded-3xl"></div>
                                <div className="w-2/3 bg-white border border-zinc-100 shadow-sm rounded-3xl flex flex-col gap-4 p-8">
                                    <div className="h-6 bg-zinc-100 rounded-lg w-1/3"></div>
                                    <div className="h-4 bg-zinc-50 rounded w-full mt-auto"></div>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-1/4 h-32 bg-white border border-zinc-100 shadow-sm rounded-3xl"></div>
                                <div className="w-1/4 h-32 bg-white border border-zinc-100 shadow-sm rounded-3xl"></div>
                                <div className="w-1/4 h-32 bg-white border border-zinc-100 shadow-sm rounded-3xl"></div>
                                <div className="w-1/4 h-32 bg-white border border-zinc-100 shadow-sm rounded-3xl"></div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {uiSpec && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute inset-0 overflow-y-auto p-8 lg:p-12 scroll-smooth"
                    >
                        <div className="max-w-4xl mx-auto relative pt-4">
                            {/* Global Toolbar */}
                            <div className="absolute -top-4 right-0 z-20 flex justify-end">
                                <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xl border border-zinc-200/80 p-1.5 rounded-full shadow-sm">
                                    <div className="flex items-center bg-zinc-100/50 rounded-full p-0.5">
                                        <button
                                            onClick={() => setViewMode('simple')}
                                            className={`px-4 py-1.5 text-[12px] font-semibold rounded-full transition-all ${viewMode === 'simple' ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-700'}`}
                                        >
                                            Simple
                                        </button>
                                        <button
                                            onClick={() => setViewMode('advanced')}
                                            className={`px-4 py-1.5 text-[12px] font-semibold rounded-full transition-all ${viewMode === 'advanced' ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-700'}`}
                                        >
                                            Deep Dive
                                        </button>
                                    </div>
                                    <div className="w-px h-4 bg-zinc-200 mx-2" />
                                    <button onClick={handleCopy} className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100 transition-colors" title="Copy JSON">
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={handleDownload} className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-700 mr-1 rounded-full hover:bg-zinc-100 transition-colors" title="Download">
                                        <Download className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8">
                                <ExperienceProvider submitClarification={onSubmitClarification || (() => { })}>
                                    <RenderRoot root={uiSpec.root as UINodeSchema} viewMode={viewMode} />
                                </ExperienceProvider>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dev Mode Debug UI */}
            <DebugPanel
                answerSpec={answerSpec}
                uxPlan={uxPlan}
                uiSpec={uiSpec}
                uiSpecRaw={uiSpecRaw}
                runMetadata={runMetadata}
                validationData={validationData}
            />
        </div>
    );
};
