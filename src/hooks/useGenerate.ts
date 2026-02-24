import { useState, useCallback } from 'react';
import { StudioSpecV1 } from '@/lib/schema/studio-spec';

export function useGenerate() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentStage, setCurrentStage] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    // New Architecture States
    const [studioSpec, setStudioSpec] = useState<StudioSpecV1 | null>(null);
    const [computedData, setComputedData] = useState<Record<string, any> | null>(null);
    const [runMetadata, setRunMetadata] = useState<any>(null);
    const [validationData, setValidationData] = useState<any>(null);

    // Legacy support variables (to keep page.tsx compiling for now)
    const [uiSpec, setUiSpec] = useState<any | null>(null);
    const [uiSpecRaw, setUiSpecRaw] = useState<string | null>(null);
    const [answerSpec, setAnswerSpec] = useState<any | null>(null);
    const [uxPlan, setUxPlan] = useState<any | null>(null);
    const [statusSteps, setStatusSteps] = useState<{ stage: string; message: string }[]>([]);

    const [error, setError] = useState<string | null>(null);

    const generate = useCallback(async (query: string, history: any[] = []) => {
        setIsGenerating(true);
        setCurrentStage("planning");
        setStatusMessage("Analyzing intent and composing modules...");
        setError(null);

        setStatusSteps([{ stage: "planning", message: "Analyzing query and orchestrating modules" }]);

        try {
            // Pointing to the new Engine route
            const response = await fetch('/api/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-use-langgraph': 'true'
                },
                body: JSON.stringify({ query, context: { history } }),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Failed to generate');
            }

            const data = await response.json();

            // Map new architecture outputs
            setStudioSpec(data.studioSpec);
            setComputedData(data.computed);
            setRunMetadata(data.runMeta);
            setValidationData(data.validation);

            // Stub legacy properties if page.tsx still references them
            setUiSpec(data.studioSpec);

            setCurrentStage("complete");
            setStatusMessage("Finished");
            setStatusSteps(prev => [...prev, { stage: "complete", message: "Rendered System Studio" }]);

        } catch (err: any) {
            setError(err.message || 'An error occurred');
            setCurrentStage("error");
            setStatusMessage("Failed");
        } finally {
            setIsGenerating(false);
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

        // New exports
        studioSpec,
        computedData,

        // Legacy exports for page compatibility
        uiSpec,
        uiSpecRaw,
        answerSpec,
        uxPlan,

        runMetadata,
        statusSteps,
        validationData,
        error,
        clearError
    };
}
