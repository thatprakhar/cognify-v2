import { BaseMessage } from "@langchain/core/messages";
import { StudioSpecV1 } from "../schema/studio-spec";

export interface ExperienceContext {
    history: any[];
    userEdits: Record<string, any>;
}

export interface StudioGraphState {
    query: string;
    mode: string;
    context: ExperienceContext;
    draftSpec?: StudioSpecV1;
    validationErrors?: string[];
    attempt: number;
    finalSpec?: StudioSpecV1;
    messages: BaseMessage[];
    runMeta?: {
        engine: "langgraph";
        modelVersion: string;
        promptVersion: string;
        graphVersion: string;
        graphHash: string;
        registryVersion: string;
        computeVersion: string;
        latencyMs?: number;
        attemptCount?: number;
    };
}
