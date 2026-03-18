import { z } from "zod";

export const QuizQuestionSchema = z.object({
    id: z.string().regex(/^[a-z0-9-]+$/).describe("Short hyphenated ID like 'q1' or 'activation-fn'"),
    question: z.string().describe("The question text. Should be clear and unambiguous."),
    options: z.array(z.string()).min(3).max(4).describe("Exactly 3 or 4 answer options. All options should be plausible — avoid obvious wrong answers."),
    correctIndex: z.number().min(0).max(3).describe("0-based index of the correct option in the options array"),
    explanation: z.string().describe("Plaintext. Shown after answering. Explains WHY the correct answer is right and why the others are wrong. 1-3 sentences."),
});

export const QuizModuleConfigSchema = z.object({
    heading: z.string().describe("Quiz heading e.g. 'Test Your Knowledge: Neural Networks'"),
    description: z.string().describe("Plaintext. 1-2 sentences setting context for what the quiz covers."),
    questions: z.array(QuizQuestionSchema).min(3).max(8).describe("3-8 questions. Vary difficulty from easy to challenging."),
    passingScore: z.number().min(50).max(100).default(70).describe("Passing percentage threshold e.g. 70 means 70% correct to pass"),
}).strict();

export type QuizModuleConfig = z.infer<typeof QuizModuleConfigSchema>;
