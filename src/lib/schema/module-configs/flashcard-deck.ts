import { z } from "zod";

const FlashcardSchema = z.object({
  id: z.string(),
  front: z.string(),
  back: z.string(),
  hint: z.string().optional(),
  category: z.string().optional(),
});

export const FlashcardDeckConfigSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  subject: z.string().optional(),
  cards: z.array(FlashcardSchema).min(4),
});

export type FlashcardDeckConfig = z.infer<typeof FlashcardDeckConfigSchema>;
