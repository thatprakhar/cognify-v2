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

RULES:
- Output JSON ONLY matching the required schema. No prose.
- Treat the AnswerSpec as the single source of truth.
- 'inputs': Define the variables the user can change. Common inputs for compound_growth: 'principal' (number), 'monthlyContribution' (number), 'annualRate' (percentage), 'years' (number). Use sensible defaults.
- 'formula': Must be one of ['compound_growth', 'loan_amortization', 'savings_projection', 'custom_table'].
- 'scenarios': Optional pre-defined alternative states (e.g., "Aggressive Savings", "Conservative Returns"). An override maps the input 'name' to a new 'defaultValue'.
- 'isMockData': Set to true if you are inventing parameters that were not explicitly discussed in the answer.
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
