import { z } from "zod";

const ScenarioMetricValueSchema = z.object({
  value: z.number(),
  label: z.string().optional(),
});

const ScenarioSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  isHighlighted: z.boolean().optional(),
  metrics: z.record(z.string(), ScenarioMetricValueSchema),
});

const MetricDefinitionSchema = z.object({
  id: z.string(),
  label: z.string(),
  unit: z.string().optional(),
  format: z.enum(["number", "currency", "percentage"]).default("number"),
  higherIsBetter: z.boolean().default(true),
});

export const ScenarioComparisonConfigSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  metrics: z.array(MetricDefinitionSchema).min(2),
  scenarios: z.array(ScenarioSchema).min(2),
  showChart: z.boolean().default(true),
});

export type ScenarioComparisonConfig = z.infer<typeof ScenarioComparisonConfigSchema>;
