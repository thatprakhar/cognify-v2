'use client';

import React from 'react';
import { UISpec } from '@/lib/pipeline/types';
import { BlockRenderer } from './BlockRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers } from 'lucide-react';

interface ExperiencePanelProps {
    uiSpec: UISpec | null;
    isGenerating: boolean;
}

export const ExperiencePanel: React.FC<ExperiencePanelProps> = ({ uiSpec, isGenerating }) => {
    return (
        <div className="w-full h-full bg-zinc-50 dark:bg-zinc-900/40 relative overflow-hidden">
            <AnimatePresence mode="wait">
                {!uiSpec && !isGenerating && (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 p-8 text-center"
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
                        <div className="w-full h-full animate-pulse flex flex-col gap-6">
                            <div className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-2xl w-full"></div>
                            <div className="flex gap-6 h-64">
                                <div className="w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
                                <div className="w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded-2xl flex flex-col gap-4 p-6">
                                    <div className="h-6 bg-zinc-300 dark:bg-zinc-700 rounded w-1/3"></div>
                                    <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-full mt-auto"></div>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-1/4 h-32 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
                                <div className="w-1/4 h-32 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
                                <div className="w-1/4 h-32 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
                                <div className="w-1/4 h-32 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
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
        </div>
    );
};
