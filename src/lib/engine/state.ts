import { BaseMessage } from "@langchain/core/messages";
import { StudioSpecV1 } from "../schema/studio-spec";

export interface ExperienceContext {
    history: any[];
    userEdits: Record<string, any>;
    previousSpec?: StudioSpecV1;
}

export interface QueryIntent {
    queryType: "architecture" | "explanation" | "comparison-two" | "comparison-multi" | "risk-audit" | "data-analysis" | "learning" | "planning" | "scoring" | "general";
    domain: string;
    subject: string;
    suggestedModules: string[];
    constraints: string[];
    isFollowUp: boolean;
}

export interface LayoutPlan {
    title: string;
    primarySlots: string[];
    moduleAssignments: Record<string, string>; // slot -> module name
}

export interface MultiChainGraphState {
    // Inputs
    query: string;
    mode: string;
    context: ExperienceContext;
    messages: BaseMessage[];
    startTime: number;

    // Chain outputs
    intent?: QueryIntent;
    layoutPlan?: LayoutPlan;

    // Per-slot generation
    slotDrafts: Record<string, any>;
    slotErrors: Record<string, string[]>;
    slotAttempts: Record<string, number>;

    // Assembly
    draftSpec?: StudioSpecV1;

    // Final
    computedBySlot?: Record<string, any>;
    finalSpec?: StudioSpecV1;
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

    globalAttempt: number;
}

// Backward-compat alias used by existing route.ts/tools.ts
export type StudioGraphState = MultiChainGraphState & {
    // old fields kept so old callers don't break
    attempt: number;
    validationErrors?: string[];
};
