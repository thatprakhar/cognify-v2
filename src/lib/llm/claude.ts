import Anthropic from '@anthropic-ai/sdk';
import { LLMProvider, GenerateOptions } from './provider';
import { z } from 'zod';

export class ClaudeProvider extends LLMProvider {
    private client: Anthropic;

    constructor() {
        super();
        this.client = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
    }

    async generateJSON<T extends z.ZodType>(options: GenerateOptions<T>): Promise<z.infer<T>> {
        const { systemPrompt, userPrompt, schema, temperature = 0.7, maxTokens = 4000, modelClass } = options;

        const modelToUse = modelClass === 'fast' ? "claude-3-haiku-20240307" : "claude-3-5-sonnet-latest";

        const response = await this.client.messages.create({
            model: modelToUse,
            system: systemPrompt,
            messages: [
                { role: "user", content: userPrompt }
            ],
            temperature,
            max_tokens: maxTokens,
        });

        const contentBlock = response.content.find((c) => c.type === 'text');
        if (!contentBlock || contentBlock.type !== 'text') {
            throw new Error("No text content returned from Claude");
        }

        const content = contentBlock.text;

        let jsonStr = content;
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            jsonStr = jsonMatch[1];
        }

        try {
            const parsed = JSON.parse(jsonStr); // Assuming 'jsonStr' is the intended variable for parsing, as 'fullContent' is not defined.
            return schema.parse(parsed);
        } catch (error) {
            console.error("Claude Output Parsing or Validation Error:", error);
            console.error("Raw content:", content); // Using 'content' as 'fullContent' is not defined.
            if (error instanceof z.ZodError) {
                const details = ((error as any).errors || (error as any).issues || []).map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
                throw new Error(`Failed to parse or validate LLM response: ${details}`);
            }
            throw new Error(`Failed to parse or validate LLM response: ${(error as Error).message}`);
        }
    }
}
