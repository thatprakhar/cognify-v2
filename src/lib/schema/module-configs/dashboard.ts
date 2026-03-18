import { z } from "zod";

const ChartConfigSchema = z.object({
    type: z.enum(["bar", "line", "area", "pie"]).describe("Chart type"),
    title: z.string().describe("Chart title"),
    xAxisKey: z.string().describe("Column name from the uploaded CSV to use as X axis / labels"),
    yAxisKeys: z.array(z.string()).min(1).describe("Column names from the uploaded CSV to use as Y axis values"),
    description: z.string().optional().describe("Optional 1-sentence description of what this chart shows"),
});

export const DashboardConfigSchema = z.object({
    heading: z.string().describe("Dashboard section heading e.g. 'Expense Analysis'"),
    description: z.string().optional().describe("Optional 1-2 sentences describing the data being analyzed"),
    charts: z.array(ChartConfigSchema).min(1).max(4).describe("1-4 charts. Each chart references column names from the user's uploaded CSV."),
    dataGrid: z.object({
        columns: z.array(z.string()).describe("Column names from the CSV to display in the summary data table"),
    }).optional().describe("Optional summary data table"),
    isMockData: z.boolean().default(false).describe("Set true if generating illustrative data rather than using user-uploaded CSV"),
}).strict();

export type DashboardConfig = z.infer<typeof DashboardConfigSchema>;
