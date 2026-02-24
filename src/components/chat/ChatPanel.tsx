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
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900 ">Outform</h1>
                    <p className="text-sm text-zinc-500 mt-1">Ask → Experience → Understand.</p>
                </div>
                <UserNav />
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4" ref={scrollRef}>
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
                        Outform turns your questions into interactive visual experiences.
                    </span>
                </div>
            </div>
        </div>
    );
};
