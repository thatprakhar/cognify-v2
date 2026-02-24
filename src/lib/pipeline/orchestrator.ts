import { LLMProvider } from '../llm/provider';
import { AnswerAgent } from '../agents/answer';
import { UXSelectorAgent } from '../agents/ux-selector';
import { RendererAgent } from '../agents/renderer';
import { SSEStreamer } from './stream';
import { ChatMessage } from './types';

export class PipelineOrchestrator {
    private answerAgent: AnswerAgent;
    private uxAgent: UXSelectorAgent;
    private renderAgent: RendererAgent;

    constructor(provider: LLMProvider) {
        this.answerAgent = new AnswerAgent(provider);
        this.uxAgent = new UXSelectorAgent(provider);
        this.renderAgent = new RendererAgent(provider);
    }

    /**
    * Runs the 3-agent pipeline sequentially and streams status updates
    * to the provided SSEStreamer.
    */
    async run(query: string, history: ChatMessage[], streamer: SSEStreamer) {
        try {
            // Stage 1: Answer
            streamer.status('answer', 'Analyzing topic structure');
            const answerSpec = await this.answerAgent.answer(query, history);
            streamer.debug('answer', answerSpec);

            // Stage 2: UX Selection
            streamer.status('ux', 'Mapping core relationships');
            const uxPlan = await this.uxAgent.select(answerSpec);
            streamer.debug('ux', uxPlan);

            // Stage 3: Rendering
            streamer.status('rendering', 'Rendering interactive layout');
            const uiSpec = await this.renderAgent.render(answerSpec, uxPlan, (chunk) => {
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

