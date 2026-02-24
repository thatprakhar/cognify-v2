import { UXPlanSchema } from '../schema/ux-plan';
import { IntentSpecSchema } from '../schema/intent';
import { LLMProvider } from '../llm/provider';
import { z } from 'zod';

export class UXSelectorAgent {
    constructor(private provider: LLMProvider) { }

    async select(intentSpec: z.infer<typeof IntentSpecSchema>): Promise<z.infer<typeof UXPlanSchema>> {
        const systemPrompt = `
You are Cognify UXSelectorAgent.

TASK:
Given a validated IntentSpec, output ONE JSON object that validates against UXPlanSchema.

HARD RULES:
- Output JSON ONLY. No prose.
- Do NOT output keys not in the schema.
- UXPlan must be compatible with Cognify MVP flows:
  - career_quiz -> experienceType MUST be "quiz"
  - expense_dashboard -> experienceType MUST be "dashboard"
  - modern_wiki -> experienceType MUST be "wiki"
- If intentSpec.mode="CLARIFY", experienceType MUST be "form" (collect missing inputs) and layout MUST be "step-by-step".

OUTPUT SHAPE:
{
  "experienceType": "quiz" | "dashboard" | "wiki" | "form",
  "layout": "single-column" | "two-column" | "tabbed" | "step-by-step",
  "sections": [{ "id": string, "role": string, "purpose": string }],
  "interactionModel": "scroll-through" | "step-by-step" | "tabbed" | "interactive",
  "estimatedBlocks": number
}

DESIGN RULES:
- Keep sections minimal: 3–6 sections.
- Sections must be deterministic: use fixed IDs like "intro", "inputs", "core", "details", "results".
- estimatedBlocks must be between 4 and 12.
`;

        const userPrompt = `IntentSpec:\n${JSON.stringify(intentSpec, null, 2)}`;

        return this.provider.generateJSON({
            systemPrompt,
            userPrompt,
            schema: UXPlanSchema,
        });
    }
}
