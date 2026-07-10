import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import type { LanguageModel } from "ai";
import { AI_MODEL, AI_PROVIDER } from "@/lib/constants";

export function getChatModel(): LanguageModel {
  return AI_PROVIDER === "google" ? google(AI_MODEL) : anthropic(AI_MODEL);
}
