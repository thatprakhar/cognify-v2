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

export type UINodeSchema = {
    type: BlockType;
    props: Record<string, unknown>;
    children?: UINodeSchema[];
};

// We construct a discriminated union to strongly type block structures
const LayoutNodeSchema: z.ZodType<UINodeSchema> = z.object({
    type: z.enum(LAYOUT_BLOCKS),
    props: z.record(z.string(), z.unknown()).default({}),
    children: z.lazy(() => z.array(UINodeSchema).min(1, "Layout blocks must have children")),
}).strict();

const LeafNodeSchema: z.ZodType<UINodeSchema> = z.object({
    type: z.enum([...CONTENT_BLOCKS, ...INTERACTIVE_BLOCKS] as unknown as [BlockType, ...BlockType[]]),
    props: z.record(z.string(), z.unknown()).default({}),
    // Strictly prevent children on leaf nodes
    children: z.undefined(),
}).strict().superRefine((data, ctx) => {
    // Inject strict mock data rules for Charts and Tables
    if (data.type === 'Chart' || data.type === 'Table') {
        if (data.props && data.props.isMockData !== undefined && typeof data.props.isMockData !== 'boolean') {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "isMockData must be a boolean" })
        }
    }
});

// The unified UINodeSchema
export const UINodeSchema: z.ZodType<UINodeSchema> = z.union([LayoutNodeSchema, LeafNodeSchema]);

// --- Agent 3: UISpec Schema ---

export const UISpecThemeSchema = z.object({
    accent: z.string().optional(),
}).strict();

export const UISpecSchema = z.object({
    version: z.string().default('1.0'),
    title: z.string(),
    theme: UISpecThemeSchema.optional(),
    root: LayoutNodeSchema, // Root MUST be a layout block
}).strict();
