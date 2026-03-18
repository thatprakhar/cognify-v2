import { useState, useCallback } from 'react';
import { StudioSpecV1 } from '@/lib/schema/studio-spec';

export function useGenerate() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentStage, setCurrentStage] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [statusSteps, setStatusSteps] = useState<{ stage: string; message: string }[]>([]);

    const [studioSpec, setStudioSpec] = useState<StudioSpecV1 | null>(null);
    const [computedData, setComputedData] = useState<Record<string, any> | null>(null);
    const [runMetadata, setRunMetadata] = useState<any>(null);
    const [validationData, setValidationData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Legacy stubs for page.tsx compatibility
    const [uiSpec] = useState<any | null>(null);
    const [uiSpecRaw] = useState<string | null>(null);
    const [answerSpec] = useState<any | null>(null);
    const [uxPlan] = useState<any | null>(null);
    const html = null; // no longer used

    const generate = useCallback(async (query: string, history: any[] = []) => {
        setIsGenerating(true);
        setCurrentStage("intent");
        setStatusMessage("Analyzing intent and composing modules...");
        setError(null);
        setStudioSpec(null);
        setComputedData(null);
        setRunMetadata(null);
        setValidationData(null);
        setStatusSteps([{ stage: "intent", message: "Extracting intent" }]);

        try {
            const response = await fetch('/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, context: { history } }),
            });


            if (!response.ok || !response.body) {
                const text = await response.text();
                throw new Error(text || 'Failed to generate');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";


            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split("\n\n");
                buffer = parts.pop() ?? "";

                for (const part of parts) {
                    const eventLine = part.split("\n").find(l => l.startsWith("event:"));
                    const dataLine = part.split("\n").find(l => l.startsWith("data:"));
                    if (!eventLine || !dataLine) continue;

                    const eventName = eventLine.slice("event:".length).trim();
                    let payload: any;
                    try { payload = JSON.parse(dataLine.slice("data:".length).trim()); }
                    catch { continue; }


                    switch (eventName) {
                        case "status":
                            setCurrentStage(payload.stage);
                            setStatusMessage(payload.message);
                            setStatusSteps(prev => [...prev, { stage: payload.stage, message: payload.message }]);
                            break;

                        case "intent_ready":
                            setStatusSteps(prev => [...prev, { stage: "intent", message: `Intent: ${payload.intent?.queryType ?? "detected"}` }]);
                            break;

                        case "layout_ready":
                            setStatusSteps(prev => [...prev, { stage: "layout", message: `Layout: ${payload.layoutPlan?.primarySlots?.join(", ") ?? "planned"}` }]);
                            break;

                        case "slot_ready":
                            setStatusSteps(prev => [...prev, { stage: "slot", message: `Slot ready: ${payload.slot}` }]);
                            break;

                        case "run_complete":
                            setStudioSpec(payload.studioSpec);
                            setComputedData(payload.computed);
                            setRunMetadata(payload.runMeta);
                            setValidationData(payload.validation);
                            setCurrentStage("complete");
                            setStatusMessage("Finished");
                            setStatusSteps(prev => [...prev, { stage: "complete", message: "Studio rendered" }]);
                            break;

                        case "error":
                            throw new Error(payload.message || "Generation failed");
                    }
                }
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
            setCurrentStage("error");
            setStatusMessage("Failed");
        } finally {
            setIsGenerating(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {
        generate,
        isGenerating,
        currentStage,
        statusMessage,
        statusSteps,
        studioSpec,
        computedData,
        runMetadata,
        validationData,
        error,
        clearError,
        // legacy
        html,
        uiSpec,
        uiSpecRaw,
        answerSpec,
        uxPlan,
    };
}
