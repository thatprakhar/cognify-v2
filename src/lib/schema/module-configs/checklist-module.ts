import { z } from "zod";

const ChecklistItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  description: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]).optional(),
});

const ChecklistSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  items: z.array(ChecklistItemSchema).min(1),
});

export const ChecklistModuleConfigSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  sections: z.array(ChecklistSectionSchema).min(1),
});

export type ChecklistModuleConfig = z.infer<typeof ChecklistModuleConfigSchema>;
