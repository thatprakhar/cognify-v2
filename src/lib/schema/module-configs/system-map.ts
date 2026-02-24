import { z } from "zod";

export const SystemMapNodeSchema = z.object({
    id: z.string(),
    label: z.string(),
    type: z.enum(["user", "service", "database", "external", "client", "worker", "queue"]),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    highlightOnHoverIds: z.array(z.string()).optional(),
}).strict();

export const SystemMapEdgeSchema = z.object({
    id: z.string(),
    from: z.string(),
    to: z.string(),
    type: z.enum(["sync", "async", "stream", "event"]),
    label: z.string().optional(),
}).strict();

export const SystemMapCalloutSchema = z.object({
    id: z.string(),
    relatedNodeIds: z.array(z.string()),
    title: z.string(),
    content: z.string(),
}).strict();

export const SystemMapLegendSchema = z.object({
    type: z.string(),
    label: z.string(),
}).strict();

export const SystemMapConfigSchema = z.object({
    nodes: z.array(SystemMapNodeSchema),
    edges: z.array(SystemMapEdgeSchema),
    callouts: z.array(SystemMapCalloutSchema).optional(),
    legend: z.array(SystemMapLegendSchema).optional(),
}).strict();

export type SystemMapConfig = z.infer<typeof SystemMapConfigSchema>;
