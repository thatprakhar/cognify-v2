import { z } from 'zod';
import { LLMProvider } from '../llm/provider';
import { AnswerSpecSchema } from '../schema/answer';

export const IntentClassificationSchema = z.object({
    intent: z.enum(['calculation', 'comparison', 'explanation', 'generic', 'assessment', 'analysis']),
    confidence: z.number().min(0).max(1),
    reasoning: z.string()
}).strict();

export class IntentClassifierAgent {
    constructor(private provider: LLMProvider) { }

    async classify(
        query: string,
        answerSpec: z.infer<typeof AnswerSpecSchema>
    ): Promise<z.infer<typeof IntentClassificationSchema>> {
        const systemPrompt = `
You are the Cognify Intent Classifier.
Given a user's query and the generated answer content, classify the primary intent to determine the best interactive capability module to render.

Available Intents:
- 'calculation': The user is asking for financial projections, math, or interactive scenarios based on formulas (e.g., compound interest, net worth, amortization).
- 'comparison': The user is explicitly comparing two or more options, products, career paths, or ideas side-by-side.
- 'analysis': The user is asking to summarize, visualize, or analyze structured data (e.g., uploaded CSV/JSON files).
- 'explanation': The user wants a structured, educational breakdown of a topic, concept, or process (e.g., how things work, history, step-by-step guides).
- 'generic': The query does not fit into any specialized interactive module.

Output strictly valid JSON matching the required schema. You MUST include all three keys: "intent", "confidence" (number between 0 and 1), and "reasoning" (string).
`;

        const userPrompt = `Query: ${query}\n\nAnswer Markdown:\n${answerSpec.answerMarkdown}`;

        return this.provider.generateJSON({
            systemPrompt,
            userPrompt,
            schema: IntentClassificationSchema,
            maxTokens: 500,
            modelClass: 'fast'
        });
    }
}
