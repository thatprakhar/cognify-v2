/**
 * Cognify Allowlist Constants
 * Single source of truth for what the LLM is allowed to output.
 * Used by: renderer, validator, schema, and prompt generation.
 */

import { LAYOUT_BLOCKS, CONTENT_BLOCKS, INTERACTIVE_BLOCKS } from '@/lib/schema/ui-spec';

// Re-export from schema for convenience
export { LAYOUT_BLOCKS, CONTENT_BLOCKS, INTERACTIVE_BLOCKS };

// --- Theme accent allowlist ---
export const ACCENT_COLORS = ['blue', 'green', 'purple', 'orange'] as const;
export type AccentColor = typeof ACCENT_COLORS[number];
export const DEFAULT_ACCENT: AccentColor = 'blue';

// --- Chart type allowlist ---
export const CHART_TYPES = ['bar', 'line', 'pie', 'area'] as const;
export type ChartType = typeof CHART_TYPES[number];

// --- Experience type allowlist ---
export const EXPERIENCE_TYPES = ['quiz', 'dashboard', 'wiki', 'form'] as const;

// --- Content limits ---
export const MAX_NODE_COUNT = 500;
export const MAX_DEPTH = 10;
export const MAX_TITLE_LENGTH = 200;
export const MAX_BODY_LENGTH = 10000;
export const MAX_QUIZ_OPTIONS = 10;
export const MAX_QUIZ_QUESTIONS = 50;
export const MAX_TABLE_ROWS = 100;
export const MAX_TABLE_COLUMNS = 20;
export const MAX_FORM_FIELDS = 30;
export const MAX_SECTIONS = 50;

// --- Generate prompt-friendly component docs ---

interface ComponentDoc {
    name: string;
    category: 'layout' | 'content' | 'interactive';
    props: string;
    isLeaf: boolean;
}

export const COMPONENT_DOCS: ComponentDoc[] = [
    // Layout (require children)
    { name: 'Stack', category: 'layout', props: 'gap: sm|md|lg|xl', isLeaf: false },
    { name: 'Grid', category: 'layout', props: 'columns: 1-4, gap: sm|md|lg', isLeaf: false },
    { name: 'Tabs', category: 'layout', props: 'tabs: string[]', isLeaf: false },
    { name: 'Accordion', category: 'layout', props: 'allowMultiple: boolean', isLeaf: false },
    { name: 'Columns', category: 'layout', props: 'layout: equal|sidebar-left|sidebar-right', isLeaf: false },

    // Content (leaf — no children)
    { name: 'Hero', category: 'content', props: 'title: string, subtitle?: string', isLeaf: true },
    { name: 'WikiSection', category: 'content', props: 'heading: string, body: string (markdown, NO HTML)', isLeaf: true },
    { name: 'InfoCard', category: 'content', props: 'title: string, content: string (plain text), icon?: string (lucide name)', isLeaf: true },
    { name: 'StatCard', category: 'content', props: 'label: string, value: string|number, trend?: string', isLeaf: true },
    { name: 'Table', category: 'content', props: 'headers: string[], rows: (string|number)[][], isMockData?: boolean', isLeaf: true },
    { name: 'Image', category: 'content', props: 'url: string (https only), alt: string, caption?: string', isLeaf: true },
    { name: 'Callout', category: 'content', props: 'type: info|warning|success|error, title: string, message: string', isLeaf: true },
    { name: 'Divider', category: 'content', props: 'style?: solid|dashed|dotted', isLeaf: true },

    // Interactive (leaf — no children)
    { name: 'Quiz', category: 'interactive', props: 'questions: {question, options, correct}[]', isLeaf: true },
    { name: 'Form', category: 'interactive', props: 'fields: {name, label, type, options?, required?}[], submitLabel: string', isLeaf: true },
    { name: 'FileUpload', category: 'interactive', props: 'acceptedTypes: string[], maxSizeMB?: number', isLeaf: true },
    { name: 'Slider', category: 'interactive', props: 'label: string, min: number, max: number, step?: number, defaultValue?: number', isLeaf: true },
    { name: 'Chart', category: 'interactive', props: 'type: bar|line|pie|area, data: object[], xKey: string, yKeys: string[], isMockData?: boolean', isLeaf: true },
    { name: 'ProgressTracker', category: 'interactive', props: 'steps: string[], currentStep: number', isLeaf: true },

    // Capability Modules (leaf — self-contained interactive templates)
    { name: 'Comparison', category: 'module' as any, props: 'title, subtitle?, optionA: {name, description?, pros[], cons[], stats{}}, optionB: {same}, criteria: {name, optionAScore: 0-10, optionBScore: 0-10}[], recommendation?, isMockData?', isLeaf: true },
    { name: 'Calculator', category: 'module' as any, props: 'title, subtitle?, inputs: {name, label, type: slider|number, min, max, step, defaultValue, unit?}[], formula: compound_growth|savings_projection, outputLabel?, scenarios?: {name, overrides: {}}[], isMockData?', isLeaf: true },
    { name: 'Dashboard', category: 'module' as any, props: 'title, subtitle?, charts: {type: bar|line|area|pie, title, xAxisKey, yAxisKeys[], description?}[], dataGrid?: {columns[], defaultSortBy?}, isMockData?', isLeaf: true },
    { name: 'Diagram', category: 'module' as any, props: 'title, subtitle?, mermaidCode', isLeaf: true },
];

/**
 * Generate a prompt-friendly component reference from the allowlist.
 * Inject this into LLM system prompts to keep them aligned with code.
 */
export function generateComponentPromptBlock(): string {
    const sections: Record<string, string[]> = { layout: [], content: [], interactive: [], module: [] };

    for (const doc of COMPONENT_DOCS) {
        const childNote = doc.isLeaf ? '(leaf — no children)' : '(MUST have children)';
        sections[doc.category].push(`- ${doc.name} ${childNote}\n  Props: ${doc.props}`);
    }

    return `
AVAILABLE COMPONENTS:

Layout Blocks (require children):
${sections.layout.join('\n')}

Content Blocks (leaf — no children):
${sections.content.join('\n')}

Interactive Blocks (leaf — no children):
${sections.interactive.join('\n')}

Capability Modules (leaf — self-contained interactive templates, PREFERRED for complex intents):
${sections.module.join('\n')}

WHEN TO USE MODULES:
- Decision/comparison questions → use Comparison module (NOT a Table + WikiSections)
- Financial projections, calculations → use Calculator module (NOT a Chart + text description)
- Modules handle their own layout, interaction, and data visualization. You only fill the config.

ACCENT COLORS ALLOWED: ${ACCENT_COLORS.join(', ')}
CHART TYPES ALLOWED: ${CHART_TYPES.join(', ')}

LIMITS:
- Max ${MAX_NODE_COUNT} nodes total
- Max ${MAX_DEPTH} levels of nesting
- Max ${MAX_TITLE_LENGTH} chars for titles
- Max ${MAX_BODY_LENGTH} chars for body text
- Do NOT include < or > characters in any text fields; use markdown formatting instead.
- Charts and tables MUST set isMockData=true if data was synthesized.
`.trim();
}
