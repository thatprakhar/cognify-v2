import { LLMProvider } from '../llm/provider';
import { IntentAgent } from '../agents/intent';
import { UXSelectorAgent } from '../agents/ux-selector';
import { RendererAgent } from '../agents/renderer';
import { SSEStreamer } from './stream';
import { ChatMessage } from './types';

export class PipelineOrchestrator {
    private intentAgent: IntentAgent;
    private uxAgent: UXSelectorAgent;
    private renderAgent: RendererAgent;

    constructor(provider: LLMProvider) {
        this.intentAgent = new IntentAgent(provider);
        this.uxAgent = new UXSelectorAgent(provider);
        this.renderAgent = new RendererAgent(provider);
    }

    /**
     * Runs the 3-agent pipeline sequentially and streams status updates
     * to the provided SSEStreamer.
     */
    async run(query: string, history: ChatMessage[], streamer: SSEStreamer) {
        try {
            // Stage 1: Intent
            streamer.status('intent', 'Understanding your query...');
            const intentSpec = await this.intentAgent.extract(query, history);
            streamer.debug('intent', intentSpec);

            // Stage 2: UX Selection
            streamer.status('ux', 'Designing the best experience...');
            const uxPlan = await this.uxAgent.select(intentSpec);
            streamer.debug('ux', uxPlan);

            // Stage 3: Rendering
            streamer.status('rendering', 'Building your interactive experience...');
            const uiSpec = await this.renderAgent.render(intentSpec, uxPlan, (chunk) => {
                streamer.specChunk(chunk);
            });
            streamer.debug('rendering', uiSpec);

            // Complete
            streamer.complete(uiSpec);
        } catch (error: any) {
            console.error("Pipeline Error:", error);
            streamer.error(error.message || "An error occurred during generation", "PIPELINE_ERROR");
        }
    }
}
