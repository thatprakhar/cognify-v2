import { LLMProvider } from '../llm/provider';
import { PipelineOrchestrator } from '../pipeline/orchestrator';
import { ChatMessage } from '../pipeline/types';
import { SSEStreamer } from '../pipeline/stream';
import { RunEngine, RunResult, EngineType, RunMetadata } from './engine-types';
import { createHash } from 'crypto';

export class ExistingEngine implements RunEngine {
    private orchestrator: PipelineOrchestrator;
    private provider: LLMProvider;

    constructor(provider: LLMProvider) {
        this.provider = provider;
        this.orchestrator = new PipelineOrchestrator(provider);
    }

    async run(query: string, history: ChatMessage[], streamer: SSEStreamer): Promise<RunResult> {
        const startTime = Date.now();
        let finalSpec: any = null;

        const originalComplete = streamer.complete.bind(streamer);
        streamer.complete = (spec: any) => {
            finalSpec = spec;
            const latencyMs = Date.now() - startTime;
            const engineFingerprint = createHash('sha256').update(`existing-v1-${this.provider.constructor.name}`).digest('hex');

            const metadata: RunMetadata = {
                engine: 'existing',
                engineFingerprint,
                modelClass: 'capable',
                latencyMs,
                promptTokens: 0,
                completionTokens: 0,
                retryCount: 0,
                timestamp: new Date().toISOString(),
                sessionId: 'session-' + Date.now()
            };

            streamer.metadata(metadata);
            originalComplete(spec);
        };

        await this.orchestrator.run(query, history, streamer);

        const latencyMs = Date.now() - startTime;
        const engineFingerprint = createHash('sha256').update(`existing-v1-${this.provider.constructor.name}`).digest('hex');

        const metadata: RunMetadata = {
            engine: 'existing',
            engineFingerprint,
            modelClass: 'capable',
            latencyMs,
            promptTokens: 0,
            completionTokens: 0,
            retryCount: 0,
            timestamp: new Date().toISOString(),
            sessionId: 'session-' + Date.now()
        };

        return {
            spec: finalSpec,
            metadata,
            validationFailures: [] // Currently, existing pipeline throws catastrophically or gracefully degrades internally, but we don't expose failure taxonomies easily.
        };
    }
}
