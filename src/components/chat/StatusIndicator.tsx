'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { PipelineStage } from '@/lib/pipeline/types';

interface StatusIndicatorProps {
    stage: PipelineStage | null;
    message: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ stage, message }) => {
    if (!stage) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800"
        >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 capitalize">
                    {stage} Phase
                </h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {message}
                </p>
            </div>
        </motion.div>
    );
};
