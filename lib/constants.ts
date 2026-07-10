export const APP_NAME = "Solution Boxes SEO Agent";

/**
 * "google" uses Gemini's free API tier — no billing required, good for testing.
 * "anthropic" uses Claude, per instructions/07-development.md — switch to this for production.
 */
export const AI_PROVIDER = (process.env.AI_PROVIDER ?? "google") as "google" | "anthropic";

const DEFAULT_MODEL: Record<typeof AI_PROVIDER, string> = {
  // "-latest" is a stable Google alias that always points at their current
  // recommended flash model, so this doesn't go stale like a pinned
  // snapshot (e.g. "gemini-2.5-flash") eventually does.
  google: "gemini-flash-latest",
  anthropic: "claude-sonnet-5",
};

export const AI_MODEL = process.env.AI_MODEL ?? DEFAULT_MODEL[AI_PROVIDER];
