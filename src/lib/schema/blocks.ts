import { z } from 'zod';

// --- Layout Blocks Props ---
export const StackPropsSchema = z.object({
    gap: z.enum(['sm', 'md', 'lg', 'xl']).optional(),
});

export const GridPropsSchema = z.object({
    columns: z.number().min(1).max(4).optional(),
    gap: z.enum(['sm', 'md', 'lg']).optional(),
});

export const TabsPropsSchema = z.object({
    tabs: z.array(z.string()),
});

export const AccordionPropsSchema = z.object({
    allowMultiple: z.boolean().optional(),
});

export const ColumnsPropsSchema = z.object({
    layout: z.enum(['equal', 'sidebar-left', 'sidebar-right']).optional(),
});

// --- Content Blocks Props ---
export const HeroPropsSchema = z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    imageUrl: z.string().url().optional(),
});

export const WikiSectionPropsSchema = z.object({
    heading: z.string(),
    body: z.string(), // HTML or markdown
});

export const InfoCardPropsSchema = z.object({
    title: z.string(),
    content: z.string(),
    icon: z.string().optional(), // Lucide icon name
});

export const StatCardPropsSchema = z.object({
    label: z.string(),
    value: z.union([z.string(), z.number()]),
    trend: z.string().optional(),
});

export const TablePropsSchema = z.object({
    headers: z.array(z.string()),
    rows: z.array(z.array(z.union([z.string(), z.number()]))),
});

export const ImagePropsSchema = z.object({
    url: z.string().url(),
    alt: z.string(),
    caption: z.string().optional(),
});

export const CalloutPropsSchema = z.object({
    type: z.enum(['info', 'warning', 'success', 'error']),
    title: z.string(),
    message: z.string(),
});

export const DividerPropsSchema = z.object({
    style: z.enum(['solid', 'dashed', 'dotted']).optional(),
});

// --- Interactive Blocks Props ---
export const QuizPropsSchema = z.object({
    questions: z.array(
        z.object({
            question: z.string(),
            options: z.array(z.string()),
            correct: z.number(), // index
        })
    ),
});

export const FormPropsSchema = z.object({
    fields: z.array(
        z.object({
            name: z.string(),
            label: z.string(),
            type: z.enum(['text', 'email', 'number', 'select']),
            options: z.array(z.string()).optional(),
            required: z.boolean().optional(),
        })
    ),
    submitLabel: z.string(),
});

export const FileUploadPropsSchema = z.object({
    acceptedTypes: z.array(z.string()), // e.g. ['.csv']
    maxSizeMB: z.number().optional(),
});

export const SliderPropsSchema = z.object({
    label: z.string(),
    min: z.number(),
    max: z.number(),
    step: z.number().optional(),
    defaultValue: z.number().optional(),
});

export const ChartPropsSchema = z.object({
    type: z.enum(['bar', 'line', 'pie', 'area']),
    data: z.array(z.record(z.union([z.string(), z.number()]))),
    xKey: z.string(),
    yKeys: z.array(z.string()),
});

export const ProgressTrackerPropsSchema = z.object({
    steps: z.array(z.string()),
    currentStep: z.number(),
});
