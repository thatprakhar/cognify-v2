import OpenAI from 'openai';
import { LLMProvider, GenerateOptions } from './provider';
import { z } from 'zod';

export class OpenAIProvider extends LLMProvider {
 private client: OpenAI;

 constructor() {
 super();
 this.client = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY,
 });
 }

 async generateJSON<T extends z.ZodType>(options: GenerateOptions<T>): Promise<z.infer<T>> {
 const { systemPrompt, userPrompt, schema, temperature = 0.7, maxTokens = 4000, onChunk } = options;

 const response = await this.client.chat.completions.create({
 model: "gpt-5-mini",
 messages: [
 { role: "system", content: systemPrompt },
 { role: "user", content: userPrompt }
 ],
 response_format: { type: "json_object" },
 max_completion_tokens: maxTokens,
 stream: !!onChunk,
 });

 let fullContent = '';

 if (onChunk) {
 for await (const chunk of response as any) {
 const text = chunk.choices[0]?.delta?.content || "";
 if (text) {
 fullContent += text;
 onChunk(fullContent);
 }
 }
 } else {
 fullContent = (response as any).choices[0]?.message?.content || "";
 }
 if (!fullContent) throw new Error("No content returned from OpenAI");

 try {
 const parsed = JSON.parse(fullContent);
 return schema.parse(parsed);
 } catch (error) {
 console.error("OpenAI Output Parsing or Validation Error:", error);
 console.error("Raw content:", fullContent);
 throw new Error("Failed to parse or validate LLM response");
 }
 }
}
