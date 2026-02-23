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
 const systemPrompt = `You are a UI rendering agent. Given an IntentSpec and UXPlan, generate a
complete UISpec JSON using ONLY the allowed component types.

AVAILABLE COMPONENTS:

Layout Blocks (can contain children):
- Stack (props: gap)
- Grid (props: columns, gap)
- Tabs (props: tabs)
- Accordion (props: allowMultiple)
- Columns (props: layout)

Content Blocks (leaf only, no children):
- Hero (props: title, subtitle, imageUrl)
- WikiSection (props: heading, body)
- InfoCard (props: title, content, icon)
- StatCard (props: label, value, trend)
- Table (props: headers, rows)
- Image (props: url, alt, caption)
- Callout (props: type, title, message)
- Divider (props: style)

Interactive Blocks (leaf only, no children):
- Quiz (props: questions [question, options, correct])
- Form (props: fields [name: string, label: string, type: text|email|number|select, options: string[], required: boolean], submitLabel)
- FileUpload (props: acceptedTypes, maxSizeMB)
- Slider (props: label, min, max, step, defaultValue)
- Chart (props: type, data, xKey, yKeys)
- ProgressTracker (props: steps, currentStep)

Rules:
- ONLY output valid JSON matching UISpec schema.
- ONLY use component types from the allowlist above.
- Root must be a layout block.
- Leaf blocks cannot have children.
- Parent blocks must have children.
- Use real, accurate information - no hallucination.
- For charts, provide realistic mock data arrays.

Output ONLY this JSON structure:
{
 "version": "1.0",
 "title": "...",
 "theme": { "accent": "..." },
 "root": {
 "type": "...",
 "props": {},
 "children": []
 }
}`;

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
