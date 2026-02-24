import { UISpecSchema } from '../schema/ui-spec';
import { UXPlanSchema } from '../schema/ux-plan';
import { AnswerSpecSchema } from '../schema/answer';
import { LLMProvider } from '../llm/provider';
import { z } from 'zod';

export class RendererAgent {
  constructor(private provider: LLMProvider) { }

  async render(
    answerSpec: z.infer<typeof AnswerSpecSchema>,
    uxPlan: z.infer<typeof UXPlanSchema>,
    onChunk?: (partialJson: string) => void
  ): Promise<z.infer<typeof UISpecSchema>> {
    const systemPrompt = `
You are Cognify RendererAgent.

TASK:
Given AnswerSpec and UXPlan, generate a complete UISpec JSON that validates against UISpecSchema.

HARD RULES:
- Output JSON ONLY. No prose.
- Use ONLY the allowed component types listed below.
- Root MUST be a layout block and MUST have children.
- Leaf blocks MUST NOT have children.
- Parent layout blocks MUST have children.
- Do NOT include raw HTML, scripts, iframes, or executable code.

CONTENT RULES:
- Treat AnswerSpec.answerMarkdown as the single source of truth for content.
- Do NOT introduce new factual claims beyond AnswerSpec.
- You may split/structure the content for readability (headings, sections), but do not change meaning.
- If AnswerSpec.mode="CLARIFY": render a Form that asks AnswerSpec.followUpQuestions.

CHART/TABLE RULES:
- Only render charts/tables if UXPlan requires it AND AnswerSpec includes structured data.
- Otherwise, avoid charts or mark any synthetic data clearly (isMockData=true) if schema supports it.

AVAILABLE COMPONENTS:

Layout Blocks:
- Stack (props: gap)
- Grid (props: columns, gap)
- Tabs (props: tabs)
- Accordion (props: allowMultiple)
- Columns (props: layout)

Content Blocks (leaf):
- Hero (props: title, subtitle, imageUrl)
- WikiSection (props: heading, body)
- InfoCard (props: title, content, icon)
- StatCard (props: label, value, trend)
- Table (props: headers, rows, isMockData)
- Image (props: url, alt, caption)
- Callout (props: type, title, message)
- Divider (props: style)

Interactive Blocks (leaf):
- Quiz (props: questions)
- Form (props: fields, submitLabel)
- FileUpload (props: acceptedTypes, maxSizeMB)
- Slider (props: label, min, max, step, defaultValue)
- Chart (props: type, data, xKey, yKeys, isMockData)
- ProgressTracker (props: steps, currentStep)

OUTPUT SHAPE:
{
  "version": "1.0",
  "title": string,
  "theme": { "accent": string },
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

