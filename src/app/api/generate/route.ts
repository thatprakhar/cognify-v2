import { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit/limiter';
import { PipelineOrchestrator } from '@/lib/pipeline/orchestrator';
import { SSEStreamer } from '@/lib/pipeline/stream';
import { OpenAIProvider } from '@/lib/llm/openai';
import { ClaudeProvider } from '@/lib/llm/claude';
import { auth } from '@/lib/auth/config';

export const maxDuration = 60; // Optional Vercel setting

export async function POST(req: NextRequest) {
 try {
 const session = await auth();
 // Use user email or fallback to IP for rate limiting
 const userId = session?.user?.email
 || req.headers.get('x-forwarded-for')
 || req.headers.get('x-real-ip')
 || "anonymous";

 const rateLimitResult = await checkRateLimit(userId);
 if (!rateLimitResult.success) {
 return new Response(JSON.stringify({ error: rateLimitResult.error }), {
 status: 429,
 headers: { 'Content-Type': 'application/json' }
 });
 }

 const body = await req.json();
 const query = body.query;
 const history = body.history || [];

 if (!query) {
 return new Response("Missing query", { status: 400 });
 }

 const provider = process.env.ANTHROPIC_API_KEY ? new ClaudeProvider() : new OpenAIProvider();
 const orchestrator = new PipelineOrchestrator(provider);
 const streamer = new SSEStreamer();

 // Run pipeline async, immediately return the stream
 orchestrator.run(query, history, streamer).catch(console.error);

 return new Response(streamer.stream, {
 headers: {
 'Content-Type': 'text/event-stream',
 'Cache-Control': 'no-cache, no-transform',
 'Connection': 'keep-alive',
 },
 });

 } catch (e: any) {
 return new Response(JSON.stringify({ error: e.message }), { status: 500 });
 }
}
