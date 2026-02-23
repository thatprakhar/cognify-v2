import { z } from 'zod'

// --- Agent 1: IntentSpec Schema ---

export const RequiredInputSchema = z.object({
 type: z.enum(['csv', 'text', 'selection']),
 label: z.string(),
 description: z.string(),
})

export const IntentSpecSchema = z.object({
 query: z.string(),
 intent: z.enum(['explanation', 'analysis', 'decision', 'creation', 'comparison', 'learning']),
 domain: z.string(),
 complexity: z.enum(['basic', 'intermediate', 'advanced']),
 goalType: z.enum(['understand', 'decide', 'analyze', 'create', 'compare', 'learn']),
 requiredInputs: z.array(RequiredInputSchema).default([]),
 contextFromChat: z.array(z.string()).default([]),
})
