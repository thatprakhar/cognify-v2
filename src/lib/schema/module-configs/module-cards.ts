import { z } from "zod";

export const ModuleCardItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
});

export const ModuleCardSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    responsibility: z.string(),
    apis: z.array(ModuleCardItemSchema).optional(),
    dataStores: z.array(ModuleCardItemSchema).optional(),
    keyDecisions: z.array(z.string()).optional(),
    failureModes: z.array(z.string()).optional(),
    dependsOnModuleIds: z.array(z.string()).optional(),
}).strict();

export const ModuleGroupSchema = z.object({
    id: z.string(),
    name: z.string(),
    moduleIds: z.array(z.string()),
}).strict();

export const SystemQualitySchema = z.object({
    id: z.string(),
    name: z.string(),
    status: z.enum(["good", "warning", "critical"]),
    description: z.string(),
}).strict();

export const ModuleCardsConfigSchema = z.object({
    modules: z.array(ModuleCardSchema),
    groups: z.array(ModuleGroupSchema).optional(),
    qualities: z.array(SystemQualitySchema).optional(),
}).strict();

export type ModuleCardsConfig = z.infer<typeof ModuleCardsConfigSchema>;
