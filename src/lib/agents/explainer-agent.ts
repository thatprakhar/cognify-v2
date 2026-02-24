import { z } from 'zod';
import { LLMProvider } from '../llm/provider';
import { AnswerSpecSchema } from '../schema/answer';
import { UISpecSchema } from '../schema/ui-spec';
import { generateComponentPromptBlock } from '../schema/allowlist';

export class ExplainerAgent {
    constructor(private provider: LLMProvider) { }

    async generateConfig(
        answerSpec: z.infer<typeof AnswerSpecSchema>,
        onChunk?: (partialJson: string) => void,
        overrides?: { temperature?: number; seed?: number }
    ): Promise<z.infer<typeof UISpecSchema>> {
        const componentBlock = generateComponentPromptBlock();

        const systemPrompt = `
You are the Cognify Explainer Agent.
Your job is to read the provided AnswerSpec and transform it into a strict JSON configuration matching the UISpecSchema.

MODULE OVERVIEW:
This is for general knowledge, explanation, and educational queries. You are not building a calculator or a side-by-side comparison; you are building an interactive "Wiki" or structured document.
Break the information down using Tabs, Accordions, Columns, and WikiSections to make it highly readable and engaging. Do not just output a wall of text.

RULES:
- Output JSON ONLY matching the required schema. No prose.
- Treat the AnswerSpec as the single source of truth.
- Root MUST be a layout block (e.g. Stack) and MUST have children.
- If AnswerSpec.mode="CLARIFY": render a Form that asks AnswerSpec.followUpQuestions.
- Do NOT include raw HTML or markdown formatting inside string fields aimed at React components unless it's explicitly supported (like WikiSection).
- Charts/Tables only if structured data is present. Use isMockData=true if you invent illustrative numbers.

${componentBlock}

OUTPUT SHAPE:
{
  "version": "1.0",
  "title": string,
  "theme": { "accent": "blue"|"green"|"purple"|"orange" },
  "root": { "type": string, "props": object, "children": array }
}
`;

        const userPrompt = `Query: ${answerSpec.query}\n\nAnswer Content:\n${answerSpec.answerMarkdown}`;

        return this.provider.generateJSON<typeof UISpecSchema>({
            systemPrompt,
            userPrompt,
            schema: UISpecSchema,
            maxTokens: 8000,
            onChunk,
            modelClass: 'fast',
            ...overrides
        });
    }
}
