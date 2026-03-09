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
        const { systemPrompt, userPrompt, schema, temperature = 0.7, maxTokens = 4000, onChunk, modelClass } = options;

        const modelToUse = modelClass === 'fast' ? "claude-haiku-4-5-20251001" : "claude-sonnet-4-6";

        let fullContent = '';

        if (onChunk) {
            const stream = await this.client.messages.create({
                model: modelToUse,
                system: systemPrompt,
                messages: [
                    { role: "user", content: userPrompt }
                ],
                temperature,
                max_tokens: maxTokens,
                stream: true,
            });

            for await (const event of stream) {
                if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                    fullContent += event.delta.text;
                    onChunk(fullContent);
                }
            }
        } else {
            const response = await this.client.messages.create({
                model: modelToUse,
                system: systemPrompt,
                messages: [
                    { role: "user", content: userPrompt }
                ],
                temperature,
                max_tokens: maxTokens,
            });

            const contentBlock = response.content.find((c: { type: string }) => c.type === 'text');
            if (!contentBlock || contentBlock.type !== 'text') {
                throw new Error("No text content returned from Claude");
            }
            fullContent = contentBlock.text;
        }

        if (!fullContent) throw new Error("No content returned from Claude");

        let jsonStr = fullContent;
        const jsonMatch = fullContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            jsonStr = jsonMatch[1];
        }

        try {
            const parsed = JSON.parse(jsonStr);
            return schema.parse(parsed);
        } catch (error) {
            console.error("Claude Output Parsing or Validation Error:", error);
            console.error("Raw content:", fullContent);
            if (error instanceof z.ZodError) {
                const details = ((error as any).errors || (error as any).issues || []).map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
                throw new Error(`Failed to parse or validate LLM response: ${details}`);
            }
            throw new Error(`Failed to parse or validate LLM response: ${(error as Error).message}`);
        }
    }
}
