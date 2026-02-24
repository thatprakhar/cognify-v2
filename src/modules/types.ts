import { z } from 'zod';

export const ComparisonModuleConfigSchema = z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    optionA: z.object({
        name: z.string(),
        description: z.string().optional(),
        pros: z.array(z.string()),
        cons: z.array(z.string()),
        stats: z.record(z.string(), z.string())
    }),
    optionB: z.object({
        name: z.string(),
        description: z.string().optional(),
        pros: z.array(z.string()),
        cons: z.array(z.string()),
        stats: z.record(z.string(), z.string())
    }),
    criteria: z.array(z.object({
        name: z.string(),
        optionAScore: z.number().min(0).max(10),
        optionBScore: z.number().min(0).max(10)
    })),
    recommendation: z.string().optional(),
    isMockData: z.boolean().optional()
}).strict();

export type ComparisonModuleConfig = z.infer<typeof ComparisonModuleConfigSchema>;

export const CalculatorInputSchema = z.object({
    name: z.string(),
    label: z.string(),
    type: z.enum(['slider', 'number']),
    min: z.number(),
    max: z.number(),
    step: z.number(),
    defaultValue: z.number(),
    unit: z.string().optional()
}).strict();

export const CalculatorModuleConfigSchema = z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    inputs: z.array(CalculatorInputSchema),
    formula: z.enum(['compound_growth', 'loan_amortization', 'savings_projection', 'custom_table']),
    outputLabel: z.string().optional(),
    scenarios: z.array(z.object({
        name: z.string(),
        overrides: z.record(z.string(), z.number())
    })).optional(),
    isMockData: z.boolean().optional()
}).strict();

export type CalculatorInput = z.infer<typeof CalculatorInputSchema>;
export type CalculatorModuleConfig = z.infer<typeof CalculatorModuleConfigSchema>;

export const DashboardModuleConfigSchema = z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    charts: z.array(z.object({
        type: z.enum(['bar', 'line', 'area', 'pie']),
        title: z.string(),
        xAxisKey: z.string(),
        yAxisKeys: z.array(z.string()),
        description: z.string().optional()
    })),
    dataGrid: z.object({
        columns: z.array(z.string()),
        defaultSortBy: z.string().optional(),
    }).optional(),
    isMockData: z.boolean().optional()
}).strict();

export type DashboardModuleConfig = z.infer<typeof DashboardModuleConfigSchema>;

export const DiagramModuleConfigSchema = z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    mermaidCode: z.string()
}).strict();

export type DiagramModuleConfig = z.infer<typeof DiagramModuleConfigSchema>;

export const MapModuleConfigSchema = z.object({
    center: z.tuple([z.number(), z.number()]),
    zoom: z.number().min(1).max(20).optional(),
    markers: z.array(z.object({
        lat: z.number(),
        lng: z.number(),
        label: z.string().optional()
    })).optional()
}).strict();

export type MapModuleConfig = z.infer<typeof MapModuleConfigSchema>;
