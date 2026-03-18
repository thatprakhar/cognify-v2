import { z } from "zod";

const ProcessCalloutSchema = z.object({
  type: z.enum(["tip", "warning", "note", "info"]),
  text: z.string(),
});

const ProcessStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  detail: z.string().optional(),
  callout: ProcessCalloutSchema.optional(),
  substeps: z.array(z.string()).optional(),
});

export const NumberedProcessConfigSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  context: z.string().optional(),
  steps: z.array(ProcessStepSchema).min(3),
});

export type NumberedProcessConfig = z.infer<typeof NumberedProcessConfigSchema>;
