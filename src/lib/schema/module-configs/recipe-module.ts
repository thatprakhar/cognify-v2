import { z } from "zod";

const IngredientSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.number(),
  unit: z.string(),
  notes: z.string().optional(),
});

const RecipeStepSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  instruction: z.string(),
  duration: z.string().optional(),
  tip: z.string().optional(),
});

export const RecipeModuleConfigSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  servings: z.number().default(4),
  totalTime: z.string().optional(),
  ingredients: z.array(IngredientSchema).min(3),
  steps: z.array(RecipeStepSchema).min(3),
});

export type RecipeModuleConfig = z.infer<typeof RecipeModuleConfigSchema>;
