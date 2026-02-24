import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { StudioSpecV1Schema, ModuleInvocationSchema } from "../schema/studio-spec";

export const createSystemStudioSpecV1 = tool(
    async (input) => JSON.stringify(input),
    {
        name: "create_system_studio_spec_v1",
        description: "Generates a structured system architecture specification.",
        schema: StudioSpecV1Schema,
    }
);

export const repairSystemStudioSpecV1 = tool(
    async (input) => JSON.stringify(input.updatedSpec),
    {
        name: "repair_system_studio_spec_v1",
        description: "Repairs an invalid StudioSpec based on exact validation error codes.",
        schema: z.object({
            resolvedErrors: z.array(z.string().describe("Machine-readable error codes that were addressed")),
            updatedSpec: StudioSpecV1Schema
        }).strict(),
    }
);

export const regenerateSystemStudioSlotV1 = tool(
    async (input) => JSON.stringify(input.moduleInvocation),
    {
        name: "regenerate_system_studio_slot_v1",
        description: "Regenerates a single module invocation without modifying the rest of the spec.",
        schema: z.object({
            moduleInvocation: ModuleInvocationSchema
        }).strict(),
    }
);
