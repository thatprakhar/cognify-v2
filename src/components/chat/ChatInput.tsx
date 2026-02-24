'use client';

import React, { useState, useRef } from 'react';
import { CornerDownLeft, Paperclip, X, Loader2 } from 'lucide-react';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
    const [input, setInput] = useState('');
    const [attachedFile, setAttachedFile] = useState<{ fileId: string; summary: string; filename: string } | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && !attachedFile) || disabled || isUploading) return;

        let finalMessage = input.trim();
        if (attachedFile) {
            finalMessage = `${finalMessage}\n\n<AttachedFile id="${attachedFile.fileId}" name="${attachedFile.filename}">\n${attachedFile.summary}\n</AttachedFile>`;
        }


        onSend(finalMessage || `Analyze ${attachedFile?.filename}`);
        setInput('');
        setAttachedFile(null);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setAttachedFile({
                    fileId: data.fileId,
                    summary: data.summary,
                    filename: data.filename
                });
            } else {
                console.error("Upload failed:", data.error);
                alert("Upload failed: " + data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Upload failed.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full flex flex-col gap-2">
            {attachedFile && (
                <div className="self-start flex items-center gap-2 bg-[#F4F4F5] px-3 py-1.5 rounded-lg text-sm border border-zinc-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                    <span className="truncate max-w-[200px] text-zinc-700 font-medium">📄 {attachedFile.filename}</span>
                    <button
                        type="button"
                        onClick={() => setAttachedFile(null)}
                        className="p-0.5 hover:bg-zinc-200 rounded-md transition-colors text-zinc-500 hover:text-zinc-900"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
            <form onSubmit={handleSubmit} className="relative w-full flex items-center bg-white border border-zinc-200 shadow-sm rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-zinc-900 focus-within:border-zinc-900 transition-all">
                <div className="pl-4 pr-1 text-zinc-400 font-mono flex items-center gap-2">
                    {'>'}
                </div>

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={disabled || isUploading}
                    placeholder={isUploading ? "Uploading file..." : disabled ? "Processing..." : "Ask anything..."}
                    className="flex-1 py-3.5 pl-2 pr-[88px] bg-transparent outline-none disabled:opacity-50 text-[14px] text-zinc-800 placeholder:text-zinc-400"
                />

                <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    ref={fileInputRef}
                    accept=".csv,.json"
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled || isUploading || !!attachedFile}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 transition-colors"
                    >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                    </button>
                    <button
                        type="submit"
                        disabled={(!input.trim() && !attachedFile) || disabled || isUploading}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-zinc-900 transition-colors"
                    >
                        <CornerDownLeft className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};
