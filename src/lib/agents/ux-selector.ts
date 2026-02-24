import { UXPlanSchema } from '../schema/ux-plan';
import { AnswerSpecSchema } from '../schema/answer';
import { LLMProvider } from '../llm/provider';
import { z } from 'zod';

export class UXSelectorAgent {
  constructor(private provider: LLMProvider) { }

  async select(answerSpec: z.infer<typeof AnswerSpecSchema>): Promise<z.infer<typeof UXPlanSchema>> {
    const systemPrompt = `
You are Cognify UXSelectorAgent.

TASK:
Given an AnswerSpec (the content) and the original query, decide the best interactive presentation plan.
Output ONE JSON object that validates against UXPlanSchema.

HARD RULES:
- Output JSON ONLY.
- Do NOT add keys not in the schema.
- Choose an experienceType that matches the flow mapping:
  - If the answer is an explanation/learning: "wiki"
  - If the answer is decision support: "quiz"
  - If the answer involves data analysis or metrics: "dashboard"
  - If AnswerSpec.mode="CLARIFY": experienceType MUST be "form" and layout MUST be "step-by-step"

CONTENT RULES:
- Your plan must reference the AnswerSpec content structure (e.g., "Key ideas", "Steps", "Examples") so the renderer can lay it out.
- Keep it minimal: 3–6 sections max.

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

Return ONLY the JSON object.
`;

    const userPrompt = `AnswerSpec:\n${JSON.stringify(answerSpec, null, 2)}`;

    return this.provider.generateJSON({
      systemPrompt,
      userPrompt,
      schema: UXPlanSchema,
    });
  }
}

