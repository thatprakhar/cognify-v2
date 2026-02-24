import { UISpecSchema } from '../schema/ui-spec';
import { UXPlanSchema } from '../schema/ux-plan';
import { IntentSpecSchema } from '../schema/intent';
import { LLMProvider } from '../llm/provider';
import { z } from 'zod';

export class RendererAgent {
    constructor(private provider: LLMProvider) { }

    async render(
        intentSpec: z.infer<typeof IntentSpecSchema>,
        uxPlan: z.infer<typeof UXPlanSchema>,
        onChunk?: (partialJson: string) => void
    ): Promise<z.infer<typeof UISpecSchema>> {
        const systemPrompt = `
You are Cognify RendererAgent.

TASK:
Given IntentSpec and UXPlan, output ONE UISpec JSON object that validates against UISpecSchema.

HARD RULES:
- Output JSON ONLY.
- Use ONLY the allowed component types listed below.
- Root MUST be a layout block and MUST have children.
- Leaf blocks MUST NOT have children.
- Parent layout blocks MUST have children.
- Do NOT include any HTML, scripts, iframes, or executable code.
- Do NOT include external URLs unless they are safe placeholders like "https://example.com/..." and the schema allows it.
- Do NOT claim real-world facts. If you need content, use:
  (a) user-provided text from intentSpec.query / intentSpec.contextFromChat
  (b) neutral templates
  (c) explicitly-labeled placeholders ("Example", "Mock", "Sample")

CHART DATA RULES:
- You MAY include mock data for charts/tables only if clearly labeled in props with "isMockData": true.
- Mock data must be simple and realistic but MUST NOT imply it is the user's real data.

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

ADAPTATION RULES:
- If intentSpec.mode="CLARIFY": render a Form to collect requiredInputs and show the clarifyingQuestions as Callouts.
- For career_quiz: include Quiz + ProgressTracker + results placeholder section.
- For expense_dashboard: include FileUpload + Chart/Table with isMockData=true until user uploads.
- For modern_wiki: include Hero + multiple WikiSection blocks.

OUTPUT SHAPE:
{
  "version": "1.0",
  "title": string,
  "theme": { "accent": string },
  "root": { "type": string, "props": object, "children": array }
}
`;

        const userPrompt = `IntentSpec:\n${JSON.stringify(intentSpec, null, 2)}\n\nUXPlan:\n${JSON.stringify(uxPlan, null, 2)}`;

        return this.provider.generateJSON({
            systemPrompt,
            userPrompt,
            schema: UISpecSchema,
            maxTokens: 8000,
            onChunk
        });
    }
}
