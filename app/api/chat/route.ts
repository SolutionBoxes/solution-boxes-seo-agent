import { anthropic } from "@ai-sdk/anthropic";
import { after } from "next/server";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { getSystemPrompt } from "@/lib/system-prompt";
import { CLAUDE_MODEL } from "@/lib/constants";
import { trackMessage, trackNewSession } from "@/lib/analytics";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  after(async () => {
    if (messages.length === 1) {
      await trackNewSession();
    }
    await trackMessage();
  });

  const result = streamText({
    model: anthropic(CLAUDE_MODEL),
    system: getSystemPrompt(),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
