import { z } from "zod";

export const SystemRiskSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    severity: z.enum(["low", "medium", "high", "critical"]),
    likelihood: z.enum(["low", "medium", "high"]),
    mitigations: z.array(z.string()),
    detectionSignals: z.array(z.string()).optional(),
    relatedNodeIds: z.array(z.string()).optional(),
    relatedModuleIds: z.array(z.string()).optional(),
}).strict();

export const RiskPanelConfigSchema = z.object({
    risks: z.array(SystemRiskSchema),
    spotlightRiskId: z.string().optional(),
}).strict();

export type RiskPanelConfig = z.infer<typeof RiskPanelConfigSchema>;
