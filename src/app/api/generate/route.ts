import { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit/limiter';
import { SSEStreamer } from '@/lib/pipeline/stream';
import { RunEngine } from '@/lib/agents/engine-types';
import { ExistingEngine } from '@/lib/agents/existing-engine';
import { LangGraphEngine } from '@/lib/agents/langgraph-engine';
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
        const streamer = new SSEStreamer();

        const useLangGraphHeader = req.headers.get('x-use-langgraph');
        const useLangGraph = useLangGraphHeader === 'true' || process.env.EXPERIMENT_LANGGRAPH_ENABLED === 'true';

        let engine: RunEngine;
        if (useLangGraph) {
            engine = new LangGraphEngine(provider);
        } else {
            engine = new ExistingEngine(provider);
        }

        // Run engine async, immediately return the stream
        engine.run(query, history, streamer).catch(console.error);

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
