'use client';

import React from 'react';
import { UISpec, IntentSpec, UXPlan } from '@/lib/pipeline/types';
import { BlockRenderer } from './BlockRenderer';
import { DebugPanel } from './DebugPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers } from 'lucide-react';

interface ExperiencePanelProps {
    uiSpec: UISpec | null;
    uiSpecRaw: string | null;
    intentSpec: IntentSpec | null;
    uxPlan: UXPlan | null;
    isGenerating: boolean;
}

export const ExperiencePanel: React.FC<ExperiencePanelProps> = ({ uiSpec, uiSpecRaw, intentSpec, uxPlan, isGenerating }) => {
    return (
        <div className="w-full h-full bg-[#FAFAFA] relative overflow-hidden">
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
                            Ask a question on the left, and watch Cognify build a custom interactive interface here.
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
                        <div className="max-w-4xl mx-auto">
                            <BlockRenderer node={uiSpec.root as any} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dev Mode Debug UI */}
            <DebugPanel
                intentSpec={intentSpec}
                uxPlan={uxPlan}
                uiSpec={uiSpec}
                uiSpecRaw={uiSpecRaw}
            />
        </div>
    );
};
