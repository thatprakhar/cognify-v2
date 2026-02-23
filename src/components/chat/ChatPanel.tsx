'use client';

import React, { useRef, useEffect } from 'react';
import { ChatMessage, PipelineStage } from '@/lib/pipeline/types';
import { MessageBubble } from './MessageBubble';
import { StatusIndicator } from './StatusIndicator';
import { ChatInput } from './ChatInput';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatPanelProps {
    messages: ChatMessage[];
    onSendMessage: (query: string) => void;
    currentStage: PipelineStage | null;
    statusMessage: string | null;
    isGenerating: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
    messages,
    onSendMessage,
    currentStage,
    statusMessage,
    isGenerating
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, currentStage, statusMessage]);

    return (
        <div className="flex flex-col h-full w-full max-w-2xl mx-auto bg-white dark:bg-black">
            {/* Header */}
            <div className="flex-shrink-0 px-6 py-6 border-b border-zinc-100 dark:border-zinc-900">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Cognify</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Chat-in, UX-out.</p>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6" ref={scrollRef}>
                {messages.length === 0 && !isGenerating && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                            <span className="text-2xl">✨</span>
                        </div>
                        <p className="text-zinc-500">How can I help you today?</p>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map(msg => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <MessageBubble message={msg} />
                        </motion.div>
                    ))}

                    {isGenerating && currentStage && statusMessage && (
                        <motion.div
                            key="status"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <StatusIndicator stage={currentStage} message={statusMessage} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 p-6 bg-white dark:bg-black relative">
                {/* Gradient fade to prevent sharp cutoff if scrolling under transparent elements */}
                <div className="absolute top-0 left-0 right-0 h-6 -translate-y-full bg-gradient-to-t from-white dark:from-black to-transparent pointer-events-none" />
                <ChatInput onSend={onSendMessage} disabled={isGenerating} />
                <div className="text-center mt-3">
                    <span className="text-xs text-zinc-400 dark:text-zinc-600">
                        Cognify dynamically builds entire interfaces based on your query.
                    </span>
                </div>
            </div>
        </div>
    );
};
