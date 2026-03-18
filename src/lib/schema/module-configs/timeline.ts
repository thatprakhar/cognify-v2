import { z } from "zod";

export const TimelineItemSchema = z.object({
    id: z.string().regex(/^[a-z0-9-]+$/).describe("Short hyphenated ID like 'event-1' or 'phase-launch'"),
    date: z.string().describe("Flexible date string: '1969', 'Q3 2024', 'Day 3', 'Phase 1', 'Week 2'"),
    title: z.string().describe("Short event title, 3-8 words"),
    description: z.string().describe("Plaintext only. No markdown. 1-3 sentences."),
    tags: z.array(z.string()).optional().describe("Optional tags e.g. ['milestone', 'turning-point', 'discovery', 'failure']"),
    isHighlighted: z.boolean().optional().describe("True for pivotal events that should be visually emphasized"),
});

export const TimelineConfigSchema = z.object({
    heading: z.string().describe("Section heading e.g. 'History of the Internet' or 'Project Phases'"),
    orientation: z.enum(["vertical", "horizontal"]).default("vertical").describe("vertical: top-to-bottom timeline. horizontal: left-to-right (use for fewer items)."),
    items: z.array(TimelineItemSchema).min(3).describe("3-10 chronological items ordered from earliest to latest"),
}).strict();

export type TimelineConfig = z.infer<typeof TimelineConfigSchema>;
