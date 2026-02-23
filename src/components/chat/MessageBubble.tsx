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
 <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-zinc-200 ' : 'bg-blue-600'}`}>
 {isUser ? <User className="w-5 h-5 text-zinc-600 " /> : <Bot className="w-5 h-5 text-white" />}
 </div>

 <div className={`p-4 rounded-2xl text-[15px] leading-relaxed ${isUser
 ? 'bg-zinc-100 text-zinc-900 '
 : 'bg-white border border-zinc-200 shadow-sm text-zinc-800 '
 }`}>
 {message.content}
 </div>
 </div>
 );
};
