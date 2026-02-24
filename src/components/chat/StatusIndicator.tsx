'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, CircleDashed, CheckCircle2 } from 'lucide-react';
import { PipelineStage } from '@/lib/pipeline/types';

interface StatusIndicatorProps {
    stage: PipelineStage | null;
    message: string;
    isCurrent?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ stage, message, isCurrent = true }) => {
    if (!stage) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`flex gap-4 w-full py-2 ${isCurrent ? 'opacity-100' : 'opacity-60 grayscale'}`}
        >
            <div className="flex-shrink-0 mt-0.5 relative">
                {isCurrent ? (
                    <>
                        <CircleDashed className="w-4 h-4 text-amber-500 animate-[spin_3s_linear_infinite] opacity-50 absolute inset-0" />
                        <Zap className="w-4 h-4 text-amber-500 animate-pulse scale-75" />
                    </>
                ) : (
                    <CheckCircle2 className="w-4 h-4 text-zinc-400" />
                )}
            </div>
            <div className={`flex-1 ${!isCurrent && 'pb-2 border-b border-zinc-100/80 overflow-hidden'}`}>
                {isCurrent && (
                    <h4 className="text-[11px] font-semibold text-amber-600 uppercase tracking-widest mb-1">
                        {stage} Phase
                    </h4>
                )}
                <p className={`text-[14px] flex items-center gap-2 ${isCurrent ? 'text-zinc-600' : 'text-zinc-500'}`}>
                    {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                    {message}
                </p>
            </div>
        </motion.div>
    );
};
