import OpenAI from 'openai';
import { LLMProvider, GenerateOptions } from './provider';
import { z } from 'zod';

export class OpenAIProvider extends LLMProvider {
    private client: OpenAI;

    constructor() {
        super();
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async generateJSON<T extends z.ZodType>(options: GenerateOptions<T>): Promise<z.infer<T>> {
        const { systemPrompt, userPrompt, schema, temperature = 0.7, maxTokens = 4000 } = options;

        const response = await this.client.chat.completions.create({
            model: "gpt-5-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            max_completion_tokens: maxTokens,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error("No content returned from OpenAI");

        try {
            const parsed = JSON.parse(content);
            return schema.parse(parsed);
        } catch (error) {
            console.error("OpenAI Output Parsing or Validation Error:", error);
            console.error("Raw content:", content);
            throw new Error("Failed to parse or validate LLM response");
        }
    }
}
