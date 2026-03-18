import { z } from "zod";

type HierarchyNodeInput = {
  id: string;
  label: string;
  description?: string;
  children?: HierarchyNodeInput[];
};

const HierarchyNodeSchema: z.ZodType<HierarchyNodeInput> = z.lazy(() =>
  z.object({
    id: z.string(),
    label: z.string(),
    description: z.string().optional(),
    children: z.array(HierarchyNodeSchema).optional(),
  })
);

export const HierarchyTreeConfigSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  root: HierarchyNodeSchema,
});

export type HierarchyTreeConfig = z.infer<typeof HierarchyTreeConfigSchema>;
