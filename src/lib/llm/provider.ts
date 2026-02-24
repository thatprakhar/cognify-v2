import { z } from 'zod';

export interface GenerateOptions<T extends z.ZodType> {
    systemPrompt: string;
    userPrompt: string;
    schema: T;
    temperature?: number;
    maxTokens?: number;
    onChunk?: (partialJson: string) => void;
    modelClass?: 'fast' | 'capable';
}

export abstract class LLMProvider {
    /**
    * Generates a structural JSON response from the LLM, validated against the provided Zod schema.
    */
    abstract generateJSON<T extends z.ZodType>(options: GenerateOptions<T>): Promise<z.infer<T>>;
}
