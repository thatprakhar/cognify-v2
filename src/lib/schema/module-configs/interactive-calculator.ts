import { z } from "zod";

const CalculatorInputSchema = z.object({
  id: z.string(),
  label: z.string(),
  unit: z.string().optional(),
  min: z.number(),
  max: z.number(),
  step: z.number(),
  defaultValue: z.number(),
});

const CalculatorOutputSchema = z.object({
  id: z.string(),
  label: z.string(),
  unit: z.string().optional(),
  formula: z.string(), // JS expression using input ids
  format: z.enum(["number", "currency", "percentage"]).default("number"),
});

export const InteractiveCalculatorConfigSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  inputs: z.array(CalculatorInputSchema).min(1),
  outputs: z.array(CalculatorOutputSchema).min(1),
});

export type InteractiveCalculatorConfig = z.infer<typeof InteractiveCalculatorConfigSchema>;
