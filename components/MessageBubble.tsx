"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { UIMessage } from "ai";

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is Extract<typeof part, { type: "text" }> => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export function MessageBubble({
  message,
  onRegenerate,
  isLast,
}: {
  message: UIMessage;
  onRegenerate?: () => void;
  isLast?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const text = getMessageText(message);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (isUser) {
    return (
      <div className="flex justify-end px-4 py-2">
        <div className="max-w-[75%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-white">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="group px-4 py-2">
      <div className="markdown max-w-[85%] text-sm text-text-primary">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </div>
      <div className="mt-1 flex gap-2 opacity-0 transition group-hover:opacity-100">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md px-2 py-1 text-xs text-text-muted hover:bg-background-light hover:text-text-secondary"
        >
          {copied ? "Copied" : "Copy"}
        </button>
        {isLast && onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            className="rounded-md px-2 py-1 text-xs text-text-muted hover:bg-background-light hover:text-text-secondary"
          >
            Regenerate
          </button>
        )}
      </div>
    </div>
  );
}
