import React from 'react';
import { ChatMessage } from '@/lib/chat-types';
import { Terminal, Cpu } from 'lucide-react';

interface MessageBubbleProps {
    message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className="flex gap-4 w-full py-4 border-b border-zinc-100/60 last:border-0 group">
            <div className="flex-shrink-0 mt-0.5">
                {isUser ? (
                    <Terminal className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                ) : (
                    <Cpu className="w-4 h-4 text-blue-400 group-hover:text-blue-500 transition-colors" />
                )}
            </div>

            <div className={`flex-1 text-[14px] leading-relaxed ${isUser ? 'text-zinc-800 font-medium' : 'text-zinc-600'}`}>
                {message.content}
            </div>
        </div>
    );
};
