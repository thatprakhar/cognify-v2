import { z } from "zod";

export const DiagramModuleConfigSchema = z.object({
    heading: z.string().describe("Section heading e.g. 'Authentication Flow' or 'Class Hierarchy'"),
    diagramType: z.enum(["flowchart", "sequence", "class", "er", "gantt", "mindmap"]).describe("Type of Mermaid diagram to render"),
    mermaidCode: z.string().describe("Valid Mermaid diagram syntax. CRITICAL: ALL node labels MUST use double quotes e.g. A[\"My Label\"] not A[My Label]. Start with the diagram type declaration e.g. 'flowchart TD' or 'sequenceDiagram'."),
    caption: z.string().optional().describe("Plaintext. Brief explanation of what this diagram shows. 1-2 sentences."),
}).strict();

export type DiagramModuleConfig = z.infer<typeof DiagramModuleConfigSchema>;
