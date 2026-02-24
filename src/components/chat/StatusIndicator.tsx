'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, CircleDashed } from 'lucide-react';
import { PipelineStage } from '@/lib/pipeline/types';

interface StatusIndicatorProps {
    stage: PipelineStage | null;
    message: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ stage, message }) => {
    if (!stage) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-4 w-full py-4 border-b border-zinc-100/60"
        >
            <div className="flex-shrink-0 mt-0.5 relative">
                <CircleDashed className="w-4 h-4 text-amber-500 animate-[spin_3s_linear_infinite] opacity-50 absolute inset-0" />
                <Zap className="w-4 h-4 text-amber-500 animate-pulse scale-75" />
            </div>
            <div className="flex-1">
                <h4 className="text-[11px] font-semibold text-amber-600 uppercase tracking-widest mb-1">
                    {stage} Phase
                </h4>
                <p className="text-[14px] text-zinc-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    {message}
                </p>
            </div>
        </motion.div>
    );
};
