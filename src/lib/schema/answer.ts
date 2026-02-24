import { z } from 'zod'

// --- Agent 1: AnswerSpec Schema ---

export const SafetyFlagsSchema = z.object({
    needsRefusal: z.boolean(),
    policyCategory: z.enum(['none', 'self_harm', 'illegal', 'hate', 'sexual', 'privacy', 'other']),
}).strict()

export const AnswerSpecSchema = z.object({
    schemaVersion: z.literal('answer_spec.v1'),
    mode: z.enum(['READY', 'CLARIFY']),
    query: z.string(),
    answerMarkdown: z.string(),
    assumptions: z.array(z.string()).default([]),
    followUpQuestions: z.array(z.string()).default([]),
    safetyFlags: SafetyFlagsSchema,
    contentTags: z.array(z.string()).default([]),
}).strict().superRefine((data, ctx) => {
    if (data.mode === 'CLARIFY') {
        if (data.answerMarkdown !== '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "answerMarkdown must be empty when mode is 'CLARIFY'",
                path: ['answerMarkdown'],
            });
        }
        if (!data.followUpQuestions || data.followUpQuestions.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "followUpQuestions must have at least 1 item when mode is 'CLARIFY'",
                path: ['followUpQuestions'],
            });
        }
    }
    if (data.mode === 'READY') {
        if (!data.answerMarkdown || data.answerMarkdown.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "answerMarkdown must be non-empty when mode is 'READY'",
                path: ['answerMarkdown'],
            });
        }
    }
})
