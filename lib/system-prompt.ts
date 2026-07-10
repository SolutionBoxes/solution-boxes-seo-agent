import fs from "node:fs";
import path from "node:path";

export function getSystemPrompt(): string {
  const filePath = path.join(process.cwd(), "prompts", "system-prompt.md");
  return fs.readFileSync(filePath, "utf-8");
}
