import { z } from 'zod'

// --- Agent 2: UXPlan Schema ---

export const UXSectionSchema = z.object({
    id: z.string(),
    role: z.string(),
    purpose: z.string(),
}).strict()

export const UXPlanSchema = z.object({
    experienceType: z.enum(['quiz', 'dashboard', 'wiki', 'form']),
    layout: z.enum(['single-column', 'two-column', 'tabbed', 'step-by-step']),
    sections: z.array(UXSectionSchema).min(1),
    interactionModel: z.enum(['scroll-through', 'step-by-step', 'tabbed', 'interactive']),
    estimatedBlocks: z.number().int().min(4).max(12),
}).strict()
