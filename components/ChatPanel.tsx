"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { ChatInput } from "@/components/ChatInput";
import { MessageBubble } from "@/components/MessageBubble";
import { SUGGESTED_PROMPTS } from "@/lib/constants";

export function ChatPanel() {
  const { messages, sendMessage, regenerate, status, error, clearError } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  function handleSend(text: string) {
    sendMessage({ text });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 px-4 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-white">
                S
              </div>
              <h1 className="text-lg font-semibold text-secondary">
                How can I help with your SEO today?
              </h1>
              <div className="grid w-full gap-2 sm:grid-cols-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="rounded-xl border border-border bg-background-light px-4 py-3 text-left text-sm text-text-secondary hover:border-primary/40 hover:text-text-primary"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-4">
              {messages.map((message, i) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isLast={i === messages.length - 1 && message.role === "assistant"}
                  onRegenerate={() => regenerate()}
                />
              ))}
              {status === "submitted" && (
                <div className="px-4 py-2 text-sm text-text-muted">Thinking…</div>
              )}
              {error && (
                <div className="mx-4 my-2 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <span>Something went wrong answering that. Please try again.</span>
                  <button
                    type="button"
                    onClick={() => {
                      clearError();
                      regenerate();
                    }}
                    className="shrink-0 font-medium underline"
                  >
                    Retry
                  </button>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
