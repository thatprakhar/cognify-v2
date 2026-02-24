import { useState, useCallback } from 'react';
import { PipelineState, PipelineStage, UISpec, AnswerSpec, UXPlan } from '@/lib/pipeline/types';
import { parse as parsePartialJson } from 'partial-json';

export function useGenerate() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentStage, setCurrentStage] = useState<PipelineStage | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [uiSpec, setUiSpec] = useState<UISpec | null>(null);
    const [uiSpecRaw, setUiSpecRaw] = useState<string | null>(null);
    const [answerSpec, setAnswerSpec] = useState<AnswerSpec | null>(null);
    const [uxPlan, setUxPlan] = useState<UXPlan | null>(null);
    const [error, setError] = useState<string | null>(null);

    const generate = useCallback(async (query: string, history: any[] = []) => {
        setIsGenerating(true);
        setCurrentStage(null);
        setStatusMessage(null);
        setError(null);
        // We only clear uiSpec if we want to replace the current experience immediately.
        // Actually, let's keep it until the new one is ready or skeleton finishes playing.
        setUiSpec(null);
        setUiSpecRaw(null);
        setAnswerSpec(null);
        setUxPlan(null);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, history }),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Failed to generate');
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No reader stream");

            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n\n');

                // Keep the last incomplete part in the buffer
                buffer = lines.pop() || '';

                for (const block of lines) {
                    const eventMatch = block.match(/event: (.*)/);
                    const dataMatch = block.match(/data: (.*)/);

                    if (eventMatch && dataMatch) {
                        const event = eventMatch[1].trim();
                        const dataStr = dataMatch[1].trim();
                        if (!dataStr) continue;

                        try {
                            const data = JSON.parse(dataStr);
                            if (event === 'status') {
                                setCurrentStage(data.stage);
                                setStatusMessage(data.message);
                            } else if (event === 'debug') {
                                if (data.stage === 'answer') setAnswerSpec(data.data);
                                if (data.stage === 'ux') setUxPlan(data.data);
                                if (data.stage === 'rendering') setUiSpec(data.data); // optional extra safeguard
                            } else if (event === 'spec-chunk') {
                                setUiSpecRaw(data.partial);
                                try {
                                    const parsedPartial = parsePartialJson(data.partial);
                                    if (parsedPartial && typeof parsedPartial === 'object') {
                                        setUiSpec(parsedPartial as UISpec);
                                    }
                                } catch (e) {
                                    // ignore incomplete chunks that cannot be parsed
                                }
                            } else if (event === 'complete') {
                                setUiSpec(data.uiSpec);
                            } else if (event === 'error') {
                                setError(data.message);
                            }
                        } catch (err) {
                            console.error("Error parsing SSE JSON", err, dataStr);
                        }
                    }
                }
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsGenerating(false);
            setCurrentStage(null);
            setStatusMessage(null);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        generate,
        isGenerating,
        currentStage,
        statusMessage,
        uiSpec,
        uiSpecRaw,
        answerSpec,
        uxPlan,
        error,
        clearError
    };
}
