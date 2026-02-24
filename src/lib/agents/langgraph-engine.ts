import { StateGraph, Annotation, START, END } from '@langchain/langgraph';
import { LLMProvider } from '../llm/provider';
import { RunEngine, RunResult, RunMetadata, ValidationFailure, FailureType } from './engine-types';
import { ChatMessage } from '../pipeline/types';
import { SSEStreamer } from '../pipeline/stream';
import { AnswerAgent } from './answer';
import { IntentClassifierAgent } from './intent-classifier';
import { UINodeSchema } from '../schema/ui-spec';
import { createHash } from 'crypto';
import { ComparisonAgent } from './comparison-agent';
import { CalculatorAgent } from './calculator-agent';
import { DashboardAgent } from './dashboard-agent';
import { DiagramAgent } from './diagram-agent';
import { MapAgent } from './map-agent';
import { ExplainerAgent } from './explainer-agent';
import { validateUISpec } from '../../renderer/validateUISpec';
import { enforceExperienceContract } from '../pipeline/contracts';
import { csvStore } from '../data/store';

// The state schema that is passed between nodes
export const GraphState = Annotation.Root({
    query: Annotation<string>(),
    history: Annotation<ChatMessage[]>(),
    streamer: Annotation<SSEStreamer>(),

    // Extracted context and intent
    answerSpec: Annotation<any>(),
    intent: Annotation<'comparison' | 'calculation' | 'analysis' | 'diagram' | 'map' | 'explanation' | 'generic' | undefined>(),

    // Generation payload
    draftSpec: Annotation<any>(),

    // Validation
    validationFailures: Annotation<ValidationFailure[]>({
        reducer: (curr, next) => curr.concat(next),
        default: () => []
    }),
    retryCount: Annotation<number>({
        reducer: (curr, next) => curr + next,
        default: () => 0
    }),
    semanticDriftDetected: Annotation<boolean>({
        reducer: (curr, next) => curr || next,
        default: () => false
    }),

    // Final result
    finalSpec: Annotation<UINodeSchema | null>()
});

export class LangGraphEngine implements RunEngine {
    private provider: LLMProvider;
    private answerAgent: AnswerAgent;
    private intentAgent: IntentClassifierAgent;
    private graph: any;

    constructor(provider: LLMProvider) {
        this.provider = provider;
        this.answerAgent = new AnswerAgent(provider);
        this.intentAgent = new IntentClassifierAgent(provider);
        this.graph = this.buildGraph();
    }

    private buildGraph() {
        const builder = new StateGraph(GraphState)
            .addNode('answerNode', this.answerNode.bind(this))
            .addNode('classifierNode', this.classifierNode.bind(this))
            .addNode('generatorNode', this.generatorNode.bind(this))
            .addNode('validatorNode', this.validatorNode.bind(this))

            .addEdge(START, 'answerNode')
            .addEdge('answerNode', 'classifierNode')
            .addEdge('classifierNode', 'generatorNode')
            .addEdge('generatorNode', 'validatorNode')
            .addConditionalEdges('validatorNode', (state: typeof GraphState.State) => {
                if (state.finalSpec) return END;
                if (state.retryCount >= 3) return END; // Max retries hit
                return 'generatorNode';
            });

        return builder.compile();
    }

    private async answerNode(state: typeof GraphState.State): Promise<Partial<typeof GraphState.State>> {
        state.streamer.status('answer', 'Analyzing context (LangGraph)');
        const answerSpec = await this.answerAgent.answer(state.query, state.history);
        state.streamer.debug('answer', answerSpec);
        return { answerSpec };
    }

    private async classifierNode(state: typeof GraphState.State): Promise<Partial<typeof GraphState.State>> {
        state.streamer.status('ux', 'Categorizing intent deterministically (LangGraph)');

        // Fast deterministic regex heuristics as per upgrade constraint #3
        const q = state.query.toLowerCase();
        let intent: typeof state.intent = undefined;

        if (q.includes('compare') || q.includes('vs') || q.includes('difference')) {
            intent = 'comparison';
        } else if (q.includes('calculate') || q.includes('project') || q.includes('growth')) {
            intent = 'calculation';
        } else if (q.includes('<attachedfile')) {
            intent = 'analysis';
        } else if (q.includes('diagram') || q.includes('architecture') || q.includes('flowchart')) {
            intent = 'diagram';
        } else if (q.includes('map') || q.includes('where is') || q.includes('location')) {
            intent = 'map';
        }

        // Only fallback to LLM if ambiguous
        if (!intent) {
            const intentResult = await this.intentAgent.classify(state.query, state.answerSpec);
            intent = intentResult.intent as any;
        }

        state.streamer.debug('ux', { intent, routing: 'langgraph' });
        return { intent };
    }

    private async generatorNode(state: typeof GraphState.State): Promise<Partial<typeof GraphState.State>> {
        state.streamer.status('rendering', `Generating ${state.intent} module (Attempt ${state.retryCount + 1})`);

        // Strict deterministic override to enforce output reliability
        const overrides = { temperature: 0, seed: 1337 };
        let draftSpec: any;

        try {
            if (state.intent === 'comparison') {
                const config = await new ComparisonAgent(this.provider).generateConfig(state.answerSpec, undefined, overrides);
                draftSpec = { version: "1.0", title: config.title, theme: { accent: "blue" }, root: { type: "Stack", props: { gap: "6" }, children: [{ type: "Comparison", props: config }] } };
            } else if (state.intent === 'calculation') {
                const config = await new CalculatorAgent(this.provider).generateConfig(state.answerSpec, undefined, overrides);

                // Server-side computation evaluation
                try {
                    const { computeCompoundGrowth, computeSavingsProjection } = await import('@/lib/computation/finance');
                    const defaultValues: Record<string, number> = {};
                    for (const inp of config.inputs) defaultValues[inp.name] = inp.defaultValue;
                    let precomputedData: any[] = [];
                    if (config.formula === 'compound_growth') {
                        precomputedData = computeCompoundGrowth(
                            defaultValues.principal ?? defaultValues.initialAmount ?? 0,
                            defaultValues.monthlyContribution ?? defaultValues.monthlySavings ?? 0,
                            (defaultValues.annualRate ?? defaultValues.returnRate ?? 8) / 100,
                            defaultValues.years ?? 5
                        );
                    } else if (config.formula === 'savings_projection') {
                        precomputedData = computeSavingsProjection(
                            defaultValues.monthlySavings ?? defaultValues.monthlyContribution ?? 0,
                            (defaultValues.annualRate ?? defaultValues.returnRate ?? 5) / 100,
                            defaultValues.years ?? 5
                        );
                    }
                } catch (err) {
                    console.error("Server compute failure:", err);
                }
                draftSpec = { version: "1.0", title: config.title, theme: { accent: "green" }, root: { type: "Stack", props: { gap: "6" }, children: [{ type: "Calculator", props: config }] } };
            } else if (state.intent === 'analysis') {
                const config = await new DashboardAgent(this.provider).generateConfig(state.answerSpec, undefined, overrides);
                let rawData: any[] = [];
                const fileIdMatch = state.query.match(/<AttachedFile id="([^"]+)"/);
                if (fileIdMatch) {
                    const parsedData = csvStore.get(fileIdMatch[1]);
                    if (parsedData) rawData = parsedData.data;
                }
                draftSpec = { version: "1.0", title: config.title, theme: { accent: "purple" }, root: { type: "Stack", props: { gap: "6" }, children: [{ type: "Dashboard", props: { ...config, data: rawData } }] } };
            } else if (state.intent === 'diagram') {
                const config = await new DiagramAgent(this.provider).generateConfig(state.answerSpec, undefined, overrides);
                draftSpec = { version: "1.0", title: config.title, theme: { accent: "blue" }, root: { type: "Stack", props: { gap: "6" }, children: [{ type: "Diagram", props: config }] } };
            } else if (state.intent === 'map') {
                const config = await new MapAgent(this.provider).generateConfig(state.answerSpec, undefined, overrides);
                draftSpec = { version: "1.0", title: "Geographic View", theme: { accent: "blue" }, root: { type: "Stack", props: { gap: "6" }, children: [{ type: "WikiSection", props: { heading: state.query, body: state.answerSpec.answerMarkdown } }, { type: "Map", props: config }] } };
            } else {
                draftSpec = await new ExplainerAgent(this.provider).generateConfig(state.answerSpec, undefined, overrides);
            }
        } catch (e: any) {
            draftSpec = { error: e.message };
        }

        return { draftSpec };
    }

    private async validatorNode(state: typeof GraphState.State): Promise<Partial<typeof GraphState.State>> {
        let semanticDriftDetected = state.semanticDriftDetected;

        if (state.draftSpec?.error) {
            state.streamer.debug('validation', { valid: false, failures: [state.draftSpec.error], retries: state.retryCount });
            const failures: ValidationFailure[] = [{
                type: FailureType.StructuralInvariantFailure,
                path: 'unknown',
                message: state.draftSpec.error,
                attemptNumber: state.retryCount + 1
            }];
            if (state.answerSpec) {
                state.answerSpec.answerMarkdown += `\n\n[SYSTEM FEEDBACK ON ATTEMPT ${state.retryCount + 1}]: Your UI JSON failed strict Zod Validation constraints. Errors: ${state.draftSpec.error}. Please fix these exact errors in your next output.`;
            }
            return {
                retryCount: 1, // reducer will add this to the total
                semanticDriftDetected,
                validationFailures: failures
            };
        }

        const result = validateUISpec(state.draftSpec?.root);

        if (result.valid) {
            let finalSpec = state.draftSpec;

            // Apply dynamic experience constraints if it fell back to Explainer/Wiki
            if (state.intent !== 'calculation' && state.intent !== 'comparison' && state.intent !== 'analysis' && state.intent !== 'diagram' && state.intent !== 'map') {
                finalSpec = enforceExperienceContract(finalSpec, 'wiki');
            }

            state.streamer.debug('validation', { valid: true, failures: [], retries: state.retryCount });
            return { finalSpec: finalSpec as UINodeSchema, semanticDriftDetected };
        } else {
            state.streamer.debug('validation', { valid: false, failures: result.errors, retries: state.retryCount });
            const failures: ValidationFailure[] = result.errors.map((err: string) => ({
                type: FailureType.StructuralInvariantFailure,
                path: 'unknown',
                message: err,
                attemptNumber: state.retryCount + 1
            }));

            // Feedback loop: push errors back into the context so the LLM attempts to fix them deterministically
            if (state.answerSpec) {
                state.answerSpec.answerMarkdown += `\n\n[SYSTEM FEEDBACK ON ATTEMPT ${state.retryCount + 1}]: Your UI JSON failed validation. Errors: ${result.errors.join(', ')}. Please fix these exact errors in your next output.`;
            }

            return {
                retryCount: 1, // reducer will add this to the total
                semanticDriftDetected,
                validationFailures: failures
            };
        }
    }

    async run(query: string, history: ChatMessage[], streamer: SSEStreamer): Promise<RunResult> {
        const startTime = Date.now();

        const finalState = await this.graph.invoke({
            query,
            history,
            streamer,
            retryCount: 0,
            semanticDriftDetected: false,
            validationFailures: []
        });

        const latencyMs = Date.now() - startTime;

        if (finalState.finalSpec) {
            streamer.complete(finalState.finalSpec);
        } else {
            const errUi = {
                version: "1.0",
                title: "Generation Failed",
                theme: { accent: "orange" },
                root: {
                    type: "Stack",
                    props: { gap: "6" },
                    children: [{
                        type: "Callout",
                        props: { type: "error", title: "Max Retries Reached", message: "LangGraph could not generate a structurally valid spec." }
                    }]
                }
            };
            streamer.complete(errUi);
        }

        const engineFingerprint = createHash('sha256')
            .update(`langgraph - v1 - ${this.provider.constructor.name} `) // Add registry version deep hash later
            .digest('hex');

        return {
            spec: finalState.finalSpec || {},
            metadata: {
                engine: 'langgraph',
                engineFingerprint,
                modelClass: 'capable',
                latencyMs,
                promptTokens: 0,
                completionTokens: 0,
                retryCount: finalState.retryCount,
                semanticDriftDetected: finalState.semanticDriftDetected,
                timestamp: new Date().toISOString(),
                sessionId: 'session-' + Date.now()
            },
            validationFailures: finalState.validationFailures
        };
    }
}
