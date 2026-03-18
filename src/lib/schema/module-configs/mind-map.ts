import { z } from "zod";

const MindMapTopicSchema = z.object({
  id: z.string(),
  label: z.string(),
  detail: z.string().optional(),
});

const MindMapBranchSchema = z.object({
  id: z.string(),
  label: z.string(),
  color: z.string().optional(),
  topics: z.array(MindMapTopicSchema).min(1),
});

export const MindMapConfigSchema = z.object({
  title: z.string(),
  centerLabel: z.string(),
  description: z.string().optional(),
  branches: z.array(MindMapBranchSchema).min(2),
});

export type MindMapConfig = z.infer<typeof MindMapConfigSchema>;
