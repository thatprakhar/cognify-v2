import { z } from 'zod'

// --- Agent 1: IntentSpec Schema ---

export const RequiredInputSchema = z.object({
    type: z.enum(['csv', 'text', 'selection']),
    label: z.string(),
    description: z.string(),
})

export const IntentSpecSchema = z.object({
    query: z.string(),
    flowId: z.enum(['career_quiz', 'expense_dashboard', 'modern_wiki']),
    mode: z.enum(['READY', 'CLARIFY']),
    goal: z.string(),
    intent: z.enum(['explanation', 'analysis', 'decision', 'creation', 'comparison', 'learning']),
    complexity: z.enum(['basic', 'intermediate', 'advanced']),
    requiredInputs: z.array(RequiredInputSchema).default([]),
    clarifyingQuestions: z.array(z.string()).max(3).default([]),
    contextFromChat: z.array(z.string()).default([]),
}).strict().superRefine((data, ctx) => {
    if (data.mode === 'CLARIFY' && (!data.clarifyingQuestions || data.clarifyingQuestions.length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "clarifyingQuestions must have at least 1 item when mode is 'CLARIFY'",
            path: ['clarifyingQuestions'],
        });
    }
    if (data.mode === 'READY' && data.clarifyingQuestions && data.clarifyingQuestions.length > 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "clarifyingQuestions must be empty when mode is 'READY'",
            path: ['clarifyingQuestions'],
        });
    }
})
