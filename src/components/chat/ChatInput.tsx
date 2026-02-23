'use client';

import React, { useState } from 'react';
import { SendHorizontal } from 'lucide-react';

interface ChatInputProps {
 onSend: (message: string) => void;
 disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
 const [input, setInput] = useState('');

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!input.trim() || disabled) return;
 onSend(input);
 setInput('');
 };

 return (
 <form onSubmit={handleSubmit} className="relative w-full">
 <input
 type="text"
 value={input}
 onChange={(e) => setInput(e.target.value)}
 disabled={disabled}
 placeholder={disabled ? "Generating experience..." : "Ask me anything..."}
 className="w-full px-6 py-4 pr-16 rounded-full bg-white border border-zinc-200 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 text-[15px]"
 />
 <button
 type="submit"
 disabled={!input.trim() || disabled}
 className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
 >
 <SendHorizontal className="w-5 h-5" />
 </button>
 </form>
 );
};
