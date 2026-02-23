import { UXPlanSchema } from '../schema/ux-plan';
import { IntentSpecSchema } from '../schema/intent';
import { LLMProvider } from '../llm/provider';
import { z } from 'zod';

export class UXSelectorAgent {
 constructor(private provider: LLMProvider) { }

 async select(intentSpec: z.infer<typeof IntentSpecSchema>): Promise<z.infer<typeof UXPlanSchema>> {
 const systemPrompt = `You are a UX architect agent. Given an IntentSpec, decide the best interactive
experience structure. Rules:
- "understand" goals -> wiki or slides
- "decide" goals -> quiz or comparison
- "analyze" goals -> dashboard with charts
- "learn" goals -> quiz + wiki hybrid
- "create" goals -> form + result display

Output ONLY this JSON structure:
{ 
 "experienceType": "quiz" | "dashboard" | "wiki" | "form" | "comparison" | "slides" | "hybrid", 
 "layout": "single-column" | "two-column" | "tabbed" | "step-by-step", 
 "sections": [{ "role": "...", "purpose": "..." }],
 "interactionModel": "scroll-through" | "step-by-step" | "tabbed" | "interactive", 
 "estimatedBlocks": 8
}`;

 const userPrompt = `IntentSpec:\n${JSON.stringify(intentSpec, null, 2)}`;

 return this.provider.generateJSON({
 systemPrompt,
 userPrompt,
 schema: UXPlanSchema,
 });
 }
}
