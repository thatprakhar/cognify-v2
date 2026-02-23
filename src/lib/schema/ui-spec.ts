import { z } from 'zod'

// --- Component Allowlist ---
// Only these component types can be rendered. The LLM cannot invent new ones.

export const LAYOUT_BLOCKS = ['Stack', 'Grid', 'Tabs', 'Accordion', 'Columns'] as const
export const CONTENT_BLOCKS = ['Hero', 'WikiSection', 'InfoCard', 'StatCard', 'Table', 'Image', 'Callout', 'Divider'] as const
export const INTERACTIVE_BLOCKS = ['Quiz', 'Form', 'FileUpload', 'Slider', 'Chart', 'ProgressTracker'] as const

export const ALL_BLOCKS = [...LAYOUT_BLOCKS, ...CONTENT_BLOCKS, ...INTERACTIVE_BLOCKS] as const
export type BlockType = typeof ALL_BLOCKS[number]

// Blocks that can contain children
export const PARENT_BLOCKS = new Set<string>(LAYOUT_BLOCKS)
// Blocks that are leaf-only (no children)
export const LEAF_BLOCKS = new Set<string>([...CONTENT_BLOCKS, ...INTERACTIVE_BLOCKS])

// --- Recursive UINode Schema ---

const UINodeBaseSchema = z.object({
 type: z.enum(ALL_BLOCKS),
 props: z.record(z.string(), z.unknown()).default({}),
})

export type UINodeSchema = z.infer<typeof UINodeBaseSchema> & {
 children?: UINodeSchema[]
}

// We use z.lazy for recursive types
export const UINodeSchema: z.ZodType<UINodeSchema> = UINodeBaseSchema.extend({
 children: z.lazy(() => z.array(UINodeSchema)).optional(),
}).superRefine((node, ctx) => {
 // Parent blocks must have children
 if (PARENT_BLOCKS.has(node.type) && (!node.children || node.children.length === 0)) {
 ctx.addIssue({
 code: z.ZodIssueCode.custom,
 message: `Layout block "${node.type}" must have at least one child`,
 });
 }
 // Leaf blocks cannot have children
 if (LEAF_BLOCKS.has(node.type) && node.children && node.children.length > 0) {
 ctx.addIssue({
 code: z.ZodIssueCode.custom,
 message: `Leaf block "${node.type}" cannot have children`,
 });
 }
})

// --- Agent 3: UISpec Schema ---

export const UISpecThemeSchema = z.object({
 accent: z.string().optional(),
})

export const UISpecSchema = z.object({
 version: z.string().default('1.0'),
 title: z.string(),
 theme: UISpecThemeSchema.optional(),
 root: UINodeSchema,
})
