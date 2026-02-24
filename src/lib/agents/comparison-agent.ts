import { z } from 'zod';
import { LLMProvider } from '../llm/provider';
import { AnswerSpecSchema } from '../schema/answer';
import { ComparisonModuleConfigSchema } from '@/modules/types';

export class ComparisonAgent {
    constructor(private provider: LLMProvider) { }

    async generateConfig(
        answerSpec: z.infer<typeof AnswerSpecSchema>,
        onChunk?: (partialJson: string) => void,
        overrides?: { temperature?: number; seed?: number }
    ): Promise<z.infer<typeof ComparisonModuleConfigSchema>> {
        const systemPrompt = `
You are the Cognify Comparison Agent.
Your job is to read the provided AnswerSpec and transform it into a strict JSON configuration for the Comparison capability module.

MODULE OVERVIEW:
The Comparison module renders a side-by-side breakdown of Option A vs Option B. It automatically handles the UI layout, criteria progress bars, pros/cons lists, and a final recommendation. You only need to provide the data.

RULES:
- Output JSON ONLY matching the required schema. No prose.
- Treat the AnswerSpec as the single source of truth. Do not invent factual data not supported by the answer.
- Ensure 'pros' and 'cons' are concise bullet points (max 4 per option).
- 'stats' should be a key-value record of short, comparable facts (e.g. {"Duration": "2 years", "Cost": "$100k"}).
- 'criteria' should score Option A and Option B numerically from 0 to 10 on important dimensions (e.g. {"name": "Flexibility", "optionAScore": 8, "optionBScore": 5}).
- 'recommendation' should be a brief, concluding verdict based strictly on the answer.
- Do NOT use markdown or HTML in any string fields within the JSON.
`;

        const userPrompt = `Query: ${answerSpec.query}\n\nAnswer Content:\n${answerSpec.answerMarkdown}`;

        return this.provider.generateJSON<typeof ComparisonModuleConfigSchema>({
            systemPrompt,
            userPrompt,
            schema: ComparisonModuleConfigSchema,
            maxTokens: 4000,
            onChunk,
            modelClass: 'fast',
            ...overrides
        });
    }
}
