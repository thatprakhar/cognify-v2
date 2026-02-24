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

import { UserNav } from '../auth/UserNav';

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
        <div className="flex flex-col h-full w-full max-w-2xl mx-auto bg-white/50 ">
            {/* Header */}
            <div className="flex-shrink-0 px-6 py-6 border-b border-zinc-100/80 bg-white/80 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900 ">Cognify</h1>
                    <p className="text-sm text-zinc-500 mt-1">Chat-in, UX-out.</p>
                </div>
                <UserNav />
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4" ref={scrollRef}>
                {messages.length === 0 && !isGenerating && (
                    <div className="flex flex-col items-start justify-end h-full space-y-4 opacity-80 pb-8">
                        <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center mb-2">
                            <span className="text-lg font-mono text-zinc-500">{'>_'}</span>
                        </div>
                        <h2 className="font-medium text-zinc-900 tracking-tight">System Ready</h2>
                        <ul className="text-[13px] text-zinc-500 space-y-2 font-mono">
                            <li className="flex gap-3">
                                <span className="text-zinc-300">01</span>
                                <span>Initialize rendering engine... OK</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-zinc-300">02</span>
                                <span>Awaiting parameters for UX synthesis.</span>
                            </li>
                            <li className="flex gap-3 text-blue-500 mt-4">
                                <span className="opacity-50">03</span>
                                <span>Enter prompt below to begin generation.</span>
                            </li>
                        </ul>
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
            <div className="flex-shrink-0 p-6 bg-white/80 backdrop-blur-xl relative border-t border-zinc-100/50">
                {/* Gradient fade to prevent sharp cutoff if scrolling under transparent elements */}
                <div className="absolute top-0 left-0 right-0 h-8 -translate-y-full bg-gradient-to-t from-white to-transparent pointer-events-none" />
                <ChatInput onSend={onSendMessage} disabled={isGenerating} />
                <div className="text-center mt-3">
                    <span className="text-xs text-zinc-400 ">
                        Cognify dynamically builds entire interfaces based on your query.
                    </span>
                </div>
            </div>
        </div>
    );
};
