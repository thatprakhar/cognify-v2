import { z } from "zod";

const ProsConsItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  weight: z.number().min(1).max(3).default(2),
});

const ProsConsOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  pros: z.array(ProsConsItemSchema).min(2),
  cons: z.array(ProsConsItemSchema).min(2),
});

export const ProsConsConfigSchema = z.object({
  title: z.string(),
  question: z.string(),
  options: z.array(ProsConsOptionSchema).min(1),
  recommendation: z.string().optional(),
});

export type ProsConsConfig = z.infer<typeof ProsConsConfigSchema>;
