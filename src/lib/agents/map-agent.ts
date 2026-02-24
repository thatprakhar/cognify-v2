import { z } from 'zod';
import { LLMProvider } from '../llm/provider';
import { AnswerSpecSchema } from '../schema/answer';
import { MapModuleConfigSchema } from '@/modules/types';

export class MapAgent {
    constructor(private provider: LLMProvider) { }

    async generateConfig(
        answerSpec: z.infer<typeof AnswerSpecSchema>,
        onChunk?: (partialJson: string) => void,
        overrides?: { temperature?: number; seed?: number }
    ): Promise<z.infer<typeof MapModuleConfigSchema>> {
        const systemPrompt = `
You are the Cognify Map Agent.
Your job is to read the provided AnswerSpec and extract geographical coordinates to configure an interactive Map component.

MODULE OVERVIEW:
The Map module renders a geographical map using Leaflet. It requires a center coordinate [lat, lng], an optional zoom level, and an optional array of markers to place on the map.

RULES:
- Output JSON ONLY matching the required schema. No prose.
- Extract latitudes and longitudes as precise numbers from the answerMarkdown or assumptions. Do NOT use strings for coordinates.
- Set a reasonable integer zoom level based on the context (e.g., 4 for a country, 10 for a city, 15 for a neighborhood).
- Add markers for specific places mentioned in the text.
- Do NOT output any HTML or markdown formatting in labels.
`;

        const userPrompt = `Query: ${answerSpec.query}\n\nAnswer Content:\n${answerSpec.answerMarkdown}\nAssumptions:\n${answerSpec.assumptions.join('\n')}`;

        return this.provider.generateJSON<typeof MapModuleConfigSchema>({
            systemPrompt,
            userPrompt,
            schema: MapModuleConfigSchema,
            maxTokens: 2000, // Should be small as it's just coordinates
            onChunk,
            modelClass: 'fast',
            ...overrides
        });
    }
}
