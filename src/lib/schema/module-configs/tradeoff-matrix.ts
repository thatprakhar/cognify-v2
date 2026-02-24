import { z } from "zod";

export const TradeoffOptionSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
}).strict();

export const TradeoffCriterionSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    isMoreBetter: z.boolean(),
}).strict();

export const TradeoffScoreSchema = z.object({
    optionId: z.string(),
    criterionId: z.string(),
    rawScore: z.number().int().min(1).max(5),
}).strict();

export const TradeoffRecommendationSchema = z.object({
    optionId: z.string(),
    keyReasons: z.array(z.string()),
    whatWouldChange: z.array(z.string()).optional(),
}).strict();

export const TradeoffMatrixConfigSchema = z.object({
    options: z.array(TradeoffOptionSchema),
    criteria: z.array(TradeoffCriterionSchema),
    scores: z.array(TradeoffScoreSchema),
    recommendation: TradeoffRecommendationSchema.optional(),
}).strict();

export type TradeoffMatrixConfig = z.infer<typeof TradeoffMatrixConfigSchema>;
