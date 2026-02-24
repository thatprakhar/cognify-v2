import { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit/limiter';
import { auth } from '@/lib/auth/config';
import OpenAI from 'openai';

/**
 * Basic chat follow-up endpoint (for non-generative text responses if needed).
 */
export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        const userId = session?.user?.email || "anonymous";

        const rateLimitResult = await checkRateLimit(userId);
        if (!rateLimitResult.success) {
            return new Response(JSON.stringify({ error: rateLimitResult.error }), { status: 429 });
        }

        const body = await req.json();

        // MVP: Simple text echo or fast small model pass for "clarifications"
        // Just providing a simple JSON completion
        if (process.env.OPENAI_API_KEY) {
            const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            const response = await client.chat.completions.create({
                model: 'gpt-5.2',
                messages: body.history || [],
            });
            return new Response(JSON.stringify({ message: response.choices[0].message.content }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ message: "Chat follow-up endpoint." }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
