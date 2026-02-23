'use client';

import React from 'react';
import { ChatMessage } from '@/lib/pipeline/types';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
    message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.role === 'user';

    if (message.role === 'status') return null; // Statuses handled separately or inline

    return (
        <div className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-zinc-200 dark:bg-zinc-800' : 'bg-blue-600'}`}>
                {isUser ? <User className="w-5 h-5 text-zinc-600 dark:text-zinc-400" /> : <Bot className="w-5 h-5 text-white" />}
            </div>

            <div className={`p-4 rounded-2xl text-[15px] leading-relaxed ${isUser
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm text-zinc-800 dark:text-zinc-200'
                }`}>
                {message.content}
            </div>
        </div>
    );
};
