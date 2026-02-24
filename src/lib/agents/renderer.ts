import { UISpecSchema } from '../schema/ui-spec';
import { UXPlanSchema } from '../schema/ux-plan';
import { AnswerSpecSchema } from '../schema/answer';
import { LLMProvider } from '../llm/provider';
import { generateComponentPromptBlock } from '../schema/allowlist';
import { z } from 'zod';

export class RendererAgent {
  constructor(private provider: LLMProvider) { }

  async render(
    answerSpec: z.infer<typeof AnswerSpecSchema>,
    uxPlan: z.infer<typeof UXPlanSchema>,
    onChunk?: (partialJson: string) => void
  ): Promise<z.infer<typeof UISpecSchema>> {
    // Generate the component reference from code-defined allowlist (single source of truth)
    const componentBlock = generateComponentPromptBlock();

    const systemPrompt = `
You are Cognify RendererAgent.

TASK:
Given AnswerSpec and UXPlan, generate a complete UISpec JSON that validates against UISpecSchema.

HARD RULES:
- Output JSON ONLY. No prose, no wrapping, no markdown.
- Use ONLY the allowed component types listed below — no others.
- Root MUST be a layout block and MUST have children.
- Leaf blocks MUST NOT have children.
- Parent layout blocks MUST have children.
- Do NOT include raw HTML, scripts, iframes, or executable code.
- Do NOT include < or > characters in any text fields; use markdown formatting instead.
- No additional keys beyond what the schema defines — strict mode.

CONTENT RULES:
- Treat AnswerSpec.answerMarkdown as the single source of truth for content.
- Do NOT introduce new factual claims beyond AnswerSpec.
- You may split/structure the content for readability (headings, sections), but do not change meaning.
- If AnswerSpec.mode="CLARIFY": render a Form that asks AnswerSpec.followUpQuestions.

CHART/TABLE RULES:
- Only render charts/tables if UXPlan requires it AND AnswerSpec includes structured data.
- If data is synthesized or illustrative, you MUST set isMockData=true.

EXPERIENCE TYPE CONTRACTS:
The UXPlan specifies an experienceType (${uxPlan.experienceType}). You MUST include the following components based on the type:
- quiz: MUST include at least one Quiz block.
- dashboard: MUST include at least one Chart, StatCard, Calculator, or Table block.
- form: MUST include at least one Form block.
- wiki: MUST include at least one structured layout (Tabs, Accordion, Columns) or Callout/Comparison/Table. Do not just output text.

${componentBlock}

OUTPUT SHAPE:
{
  "version": "1.0",
  "title": string,
  "theme": { "accent": "blue"|"green"|"purple"|"orange" },
  "root": { "type": string, "props": object, "children": array }
}

Return ONLY the UISpec JSON object.
`;

    const userPrompt = `AnswerSpec:\n${JSON.stringify(answerSpec, null, 2)}\n\nUXPlan:\n${JSON.stringify(uxPlan, null, 2)}`;

    return this.provider.generateJSON({
      systemPrompt,
      userPrompt,
      schema: UISpecSchema,
      maxTokens: 8000,
      onChunk
    });
  }
}
