import { z } from 'zod';
import { LLMProvider } from '../llm/provider';
import { AnswerSpecSchema } from '../schema/answer';
import { CalculatorModuleConfigSchema } from '@/modules/types';

export class CalculatorAgent {
    constructor(private provider: LLMProvider) { }

    async generateConfig(
        answerSpec: z.infer<typeof AnswerSpecSchema>,
        onChunk?: (partialJson: string) => void
    ): Promise<z.infer<typeof CalculatorModuleConfigSchema>> {
        const systemPrompt = `
You are the Cognify Calculator Agent.
Your job is to read the provided AnswerSpec and transform it into a strict JSON configuration for the Calculator capability module.

MODULE OVERVIEW:
The Calculator module renders an interactive financial or mathematical projection tool. It takes user 'inputs' (sliders), applies a built-in 'formula' (e.g., compound_growth), and renders a beautiful projection chart and table.
You do NOT do the math. You only configure the inputs, labels, and select the formula.

RULES FOR OUTPUT SHAPE:
- Output strictly JSON that matches the \`CalculatorModuleConfigSchema\`.
- \`title\`: A concise string title for the calculator (e.g., "Mortgage Calculator"). THIS IS REQUIRED.
- \`inputs\`: THIS MUST BE AN ARRAY OF OBJECTS, NOT A KEY-VALUE RECORD. Each object in the array must have:
  - \`name\`: programmatic key (e.g. 'principal')
  - \`label\`: human readable name
  - \`type\`: either 'slider' or 'number'
  - \`min\`, \`max\`, \`step\`, and \`defaultValue\`: all numbers
- \`formula\`: Must be exactly one of ['compound_growth', 'loan_amortization', 'savings_projection', 'custom_table'].
- \`scenarios\`: Optional array of pre-defined optional states.
- \`isMockData\`: Boolean boolean whether data is made up.
`;

        const userPrompt = `Query: ${answerSpec.query}\n\nAnswer Content:\n${answerSpec.answerMarkdown}`;

        return this.provider.generateJSON({
            systemPrompt,
            userPrompt,
            schema: CalculatorModuleConfigSchema,
            maxTokens: 4000,
            onChunk,
            modelClass: 'fast'
        });
    }
}
