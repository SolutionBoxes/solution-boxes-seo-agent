import { anthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModel } from "ai";
import { AI_MODEL, AI_PROVIDER } from "@/lib/constants";

// Google AI Studio labels its keys "GEMINI_API_KEY"; the AI SDK's default
// looks for "GOOGLE_GENERATIVE_AI_API_KEY". Accept either.
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY,
});

export function getChatModel(): LanguageModel {
  return AI_PROVIDER === "google" ? google(AI_MODEL) : anthropic(AI_MODEL);
}
