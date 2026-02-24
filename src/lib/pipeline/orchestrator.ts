import { LLMProvider } from '../llm/provider';
import { AnswerAgent } from '../agents/answer';
import { IntentClassifierAgent } from '../agents/intent-classifier';
import { ExplainerAgent } from '../agents/explainer-agent';
import { ComparisonAgent } from '../agents/comparison-agent';
import { CalculatorAgent } from '../agents/calculator-agent';
import { SSEStreamer } from './stream';
import { ChatMessage } from './types';
import { enforceExperienceContract } from './contracts';

export class PipelineOrchestrator {
    private answerAgent: AnswerAgent;
    private intentAgent: IntentClassifierAgent;
    private explainerAgent: ExplainerAgent;
    private comparisonAgent: ComparisonAgent;
    private calculatorAgent: CalculatorAgent;

    constructor(provider: LLMProvider) {
        this.answerAgent = new AnswerAgent(provider);
        this.intentAgent = new IntentClassifierAgent(provider);
        this.explainerAgent = new ExplainerAgent(provider);
        this.comparisonAgent = new ComparisonAgent(provider);
        this.calculatorAgent = new CalculatorAgent(provider);
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

            // Check for CLARIFY mode
            if (answerSpec.mode === 'CLARIFY') {
                streamer.status('rendering', 'Requesting clarification');
                const uiSpec = {
                    version: "1.0",
                    title: "Clarification Needed",
                    theme: { accent: "blue" },
                    root: {
                        type: "Stack",
                        props: { gap: "6" },
                        children: [
                            {
                                type: "InfoCard",
                                props: {
                                    title: "I need a bit more detail to build this experience.",
                                    description: answerSpec.answerMarkdown || "Please answer the questions below so I can generate the right interactive module for you."
                                }
                            },
                            {
                                type: "Form",
                                props: {
                                    fields: answerSpec.followUpQuestions.map((q, i) => ({
                                        id: `q${i}`,
                                        name: `q${i}`,
                                        type: "textarea",
                                        label: q,
                                        placeholder: "Type your answer..."
                                    })),
                                    submitLabel: "Generate Experience"
                                }
                            }
                        ]
                    }
                };
                streamer.debug('rendering', uiSpec);
                streamer.complete(uiSpec);
                return;
            }

            // Stage 2: Intent Classification
            streamer.status('ux', 'Categorizing intent');
            const intentResult = await this.intentAgent.classify(query, answerSpec);
            streamer.debug('intent', intentResult);

            // Stage 3: Specialized Rendering
            streamer.status('rendering', `Generating ${intentResult.intent} module`);

            let uiSpec;

            if (intentResult.intent === 'comparison') {
                const config = await this.comparisonAgent.generateConfig(answerSpec, (chunk) => streamer.specChunk(chunk));
                uiSpec = {
                    version: "1.0",
                    title: config.title,
                    theme: { accent: "blue" },
                    root: {
                        type: "Stack",
                        props: { gap: "6" },
                        children: [{ type: "Comparison", props: config }]
                    }
                };
            } else if (intentResult.intent === 'calculation') {
                const config = await this.calculatorAgent.generateConfig(answerSpec, (chunk) => streamer.specChunk(chunk));

                streamer.status('rendering', 'Running Server-Side Computations...');
                // Server-side computation of default values as proof of concept
                try {
                    const { computeCompoundGrowth, computeSavingsProjection } = await import('@/lib/computation/finance');
                    const defaultValues: Record<string, number> = {};
                    for (const inp of config.inputs) {
                        defaultValues[inp.name] = inp.defaultValue;
                    }
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
                    streamer.debug('computation', { type: 'server-computed-data', length: precomputedData.length });
                } catch (err) {
                    console.error("Server compute failure:", err);
                }

                uiSpec = {
                    version: "1.0",
                    title: config.title,
                    theme: { accent: "green" },
                    root: {
                        type: "Stack",
                        props: { gap: "6" },
                        children: [{ type: "Calculator", props: config }]
                    }
                };
            } else {
                // Fallback to generic Explainer for 'explanation', 'generic', or anything else
                uiSpec = await this.explainerAgent.generateConfig(answerSpec, (chunk) => streamer.specChunk(chunk));

                // Only enforce generic contracts on Explainer outputs
                uiSpec = enforceExperienceContract(uiSpec, 'wiki');
            }

            streamer.debug('rendering', uiSpec);

            // Complete
            streamer.complete(uiSpec);
        } catch (error: any) {
            console.error("Pipeline Error:", error);
            streamer.error(error.message || "An error occurred during generation", "PIPELINE_ERROR");
        }
    }
}

