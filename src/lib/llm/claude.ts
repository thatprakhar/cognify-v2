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
        const { systemPrompt, userPrompt, schema, temperature = 0.7, maxTokens = 4000 } = options;

        const response = await this.client.messages.create({
            model: "claude-3-5-sonnet-latest",
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
            const parsed = JSON.parse(jsonStr);
            return schema.parse(parsed);
        } catch (error) {
            console.error("Claude Output Parsing or Validation Error:", error);
            console.error("Raw content:", content);
            throw new Error("Failed to parse or validate LLM response");
        }
    }
}
