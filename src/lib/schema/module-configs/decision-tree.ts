import { z } from "zod";

const LeafNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.literal("leaf"),
  recommendation: z.string(),
  reasoning: z.string(),
  nextSteps: z.array(z.string()).optional(),
});

const QuestionNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.literal("question"),
  question: z.string(),
  choices: z.array(z.object({ label: z.string(), nextId: z.string() })).min(2),
});

export const DecisionTreeConfigSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  rootId: z.string(),
  nodes: z.array(z.discriminatedUnion("type", [QuestionNodeSchema, LeafNodeSchema])).min(3),
});

export type DecisionTreeConfig = z.infer<typeof DecisionTreeConfigSchema>;
