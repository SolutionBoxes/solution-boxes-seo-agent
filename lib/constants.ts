export const APP_NAME = "Solution Boxes SEO Agent";

/**
 * "google" uses Gemini's free API tier — no billing required, good for testing.
 * "anthropic" uses Claude, per instructions/07-development.md — switch to this for production.
 */
export const AI_PROVIDER = (process.env.AI_PROVIDER ?? "google") as "google" | "anthropic";

const DEFAULT_MODEL: Record<typeof AI_PROVIDER, string> = {
  google: "gemini-2.5-flash",
  anthropic: "claude-sonnet-5",
};

export const AI_MODEL = process.env.AI_MODEL ?? DEFAULT_MODEL[AI_PROVIDER];
