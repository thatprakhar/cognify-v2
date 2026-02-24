import { z } from 'zod';
import { LLMProvider } from '../llm/provider';
import { AnswerSpecSchema } from '../schema/answer';
import { DiagramModuleConfigSchema } from '../../modules/types';

export class DiagramAgent {
    constructor(private provider: LLMProvider) { }

    async generateConfig(
        answerSpec: z.infer<typeof AnswerSpecSchema>,
        onChunk?: (chunk: string) => void,
        overrides?: { temperature?: number; seed?: number }
    ): Promise<z.infer<typeof DiagramModuleConfigSchema>> {
        const systemPrompt = `
Your job is to read the provided AnswerSpec and transform it into a strict JSON configuration for a Diagram capability module.

MODULE OVERVIEW:
The Diagram module renders Mermaid.js diagrams to visualize systems, architecture, algorithms, or sequence flows.

RULES FOR MERMAID CODE:
- Use valid Mermaid JS syntax.
- Do NOT wrap the mermaid code in markdown code blocks like \`\`\`mermaid. Provide the raw string exactly as it should be parsed.
- Default to graph TD or flowchart LR unless a sequence/state diagram makes more sense.
- Try to keep node labels concise.
- CRITICAL: You MUST wrap all node labels in double quotes inside the brackets. Example: \`NodeID["Label with & and /"]\` rather than \`NodeID[Label with & and /]\`. This prevents syntax errors from special characters.

OUTPUT FORMAT:
Return strictly a valid JSON object matching the \`DiagramModuleConfigSchema\`.
- \`title\`: A concise string title for the diagram.
- \`mermaidCode\`: The raw mermaid valid script.
`;

        const userPrompt = `Query: ${answerSpec.query}\n\nAnswer Content:\n${answerSpec.answerMarkdown}`;

        return this.provider.generateJSON<typeof DiagramModuleConfigSchema>({
            systemPrompt,
            userPrompt,
            schema: DiagramModuleConfigSchema,
            maxTokens: 1500,
            modelClass: 'capable',
            onChunk,
            ...overrides
        });
    }
}
