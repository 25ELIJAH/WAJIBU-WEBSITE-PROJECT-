/**
 * AI / language-model entry point (placeholder).
 *
 * Nothing in the site calls this route yet. When you are ready to add an AI chat
 * or assistant, this is the place:
 *
 *   1. npm install ai @ai-sdk/anthropic            (Vercel AI SDK + provider)
 *   2. set ANTHROPIC_API_KEY in .env.local / the hosting dashboard
 *   3. replace the 501 response below with:
 *
 *      import { streamText, convertToModelMessages } from "ai";
 *      import { anthropic } from "@ai-sdk/anthropic";
 *
 *      export async function POST(req: Request) {
 *        const { messages } = await req.json();
 *        const result = streamText({
 *          model: anthropic(process.env.AI_MODEL ?? "claude-sonnet-5-5"),
 *          system: "You are the WAJIBU ESG advisory assistant.",
 *          messages: convertToModelMessages(messages),
 *        });
 *        return result.toUIMessageStreamResponse();
 *      }
 *
 * Put prompts, tools and provider helpers in src/lib/ai/.
 */
export const runtime = "nodejs";

export async function POST() {
  return Response.json(
    { error: "AI chat is not enabled yet. See src/app/api/chat/route.ts." },
    { status: 501 }
  );
}
