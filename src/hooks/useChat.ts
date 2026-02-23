import { useState, useCallback } from 'react';
import { ChatMessage, PipelineStage, UISpec } from '@/lib/pipeline/types';

export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const addMessage = useCallback((role: 'user' | 'system', content: string) => {
        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            role,
            content,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    return {
        messages,
        addMessage,
        clearMessages
    };
}
