'use client';

import React, { useState } from 'react';
import { CornerDownLeft } from 'lucide-react';

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
        <form onSubmit={handleSubmit} className="relative w-full flex items-center bg-white border border-zinc-200 shadow-sm rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-zinc-900 focus-within:border-zinc-900 transition-all">
            <div className="pl-4 pr-2 text-zinc-400 font-mono">{'>'}</div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={disabled}
                placeholder={disabled ? "Processing..." : "Ask anything..."}
                className="flex-1 py-3.5 pr-12 bg-transparent outline-none disabled:opacity-50 text-[14px] text-zinc-800 placeholder:text-zinc-400"
            />
            <button
                type="submit"
                disabled={!input.trim() || disabled}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-zinc-900 transition-colors"
            >
                <CornerDownLeft className="w-4 h-4" />
            </button>
        </form>
    );
};
