import { z } from "zod";

const ActionItemSchema = z.object({
    id: z.string().regex(/^[a-z0-9-]+$/).describe("Short hyphenated ID like 'setup-auth' or 'review-budget'"),
    title: z.string().describe("Action title, 3-8 words. Should be imperative e.g. 'Set up authentication'"),
    description: z.string().describe("Plaintext. 1-2 sentences. Specific and concrete — not vague advice."),
    priority: z.enum(["high", "medium", "low"]).describe("high: must do first. medium: important but not urgent. low: nice to have."),
    effort: z.enum(["low", "medium", "high"]).describe("low: hours. medium: days. high: weeks or more."),
});

const ActionPhaseSchema = z.object({
    id: z.string().regex(/^[a-z0-9-]+$/).describe("Phase ID like 'immediate' or 'phase-1'"),
    name: z.string().describe("Phase name e.g. 'Immediate', 'Short-term', 'Long-term', 'Phase 1'"),
    timeframe: z.string().describe("Human-readable timeframe e.g. 'This week', '1-3 months', '6+ months', 'Days 1-7'"),
    actions: z.array(ActionItemSchema).min(2).describe("2-5 concrete actions for this phase"),
});

export const ActionPlanConfigSchema = z.object({
    heading: z.string().describe("Section heading e.g. 'Your Action Plan' or 'Next Steps'"),
    context: z.string().describe("Plaintext. 1-2 sentences of situational framing for this plan."),
    phases: z.array(ActionPhaseSchema).min(2).max(4).describe("2-4 phases with concrete actions. Order from most immediate to longest-term."),
}).strict();

export type ActionPlanConfig = z.infer<typeof ActionPlanConfigSchema>;
