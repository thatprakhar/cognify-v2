import type { UINodeSchema } from '../schema/ui-spec';
import type { ChatMessage } from '../pipeline/types';
import type { SSEStreamer } from '../pipeline/stream';

export type EngineType = 'existing' | 'langgraph';

export interface RunMetadata {
    engine: EngineType;
    engineFingerprint: string; // SHA256 of engine_type + graph_structure + prompt_version + model_version + registry_version
    modelClass: 'fast' | 'capable';
    latencyMs: number;
    promptTokens: number;
    completionTokens: number;
    retryCount: number;
    seed?: number; // Crucial for enforcing determinism
    semanticDriftDetected?: boolean; // True if the repair loop downgraded or changed a moduleType
    timestamp: string;
    sessionId: string;
}

export enum FailureType {
    SchemaParseFailure = 'SchemaParseFailure',
    StructuralInvariantFailure = 'StructuralInvariantFailure',
    ExperienceContractFailure = 'ExperienceContractFailure',
    ComputeInjectionFailure = 'ComputeInjectionFailure',
    SemanticDriftDetected = 'SemanticDriftDetected'
}

export interface ValidationFailure {
    type: FailureType;
    path: string;
    message: string;
    attemptNumber: number;
}

export interface AnalyticsEvent {
    type: 'run_completed' | 'run_failed' | 'validation_error' | 'module_rendered';
    engine: EngineType;
    engineFingerprint: string;
    moduleType?: string; // e.g., 'Comparison', 'Calculator', 'Form', 'Wiki'
    durationMs: number;
    retries: number;
    // Objective Quality Metrics
    moduleDiversityCount: number;
    interactiveDensity: number;
}

export interface RunResult {
    spec: UINodeSchema;
    metadata: RunMetadata;
    validationFailures: ValidationFailure[];
}

export interface RunEngine {
    run(query: string, history: ChatMessage[], streamer: SSEStreamer): Promise<RunResult>;
}
