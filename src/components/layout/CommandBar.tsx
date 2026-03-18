'use client';

import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface CommandBarProps {
  value: string;
  onChange: (v: string) => void;
  onSend: (query: string) => void;
  isGenerating: boolean;
  statusSteps: { stage: string; message: string }[];
  currentStage: string | null;
  statusMessage: string | null;
}

export function CommandBar({
  value,
  onChange,
  onSend,
  isGenerating,
  statusSteps,
}: CommandBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const lastStep = statusSteps.length > 0 ? statusSteps[statusSteps.length - 1] : null;

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isGenerating) return;
    onSend(trimmed);
    onChange('');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-zinc-800/60">
      <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Ask anything..."
            className="flex-1 bg-zinc-900 border border-zinc-700/50 rounded-xl text-zinc-100 placeholder-zinc-500 font-mono text-sm px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-shadow duration-150"
          />
          <button
            onClick={handleSubmit}
            disabled={isGenerating || !value.trim()}
            className={`rounded-lg p-2 transition-colors duration-150 flex-shrink-0 ${
              isGenerating || !value.trim()
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
            aria-label="Send"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {isGenerating && lastStep && (
            <motion.div
              key="status"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse flex-shrink-0" />
              <span className="text-xs text-zinc-400 font-mono truncate">{lastStep.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
