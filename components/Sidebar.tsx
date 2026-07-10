"use client";

import { useState } from "react";

const NAV_ITEMS = [
  { label: "Settings", href: "#" },
  { label: "Documentation", href: "#" },
  { label: "About", href: "#" },
];

export function Sidebar({
  open,
  onNewChat,
}: {
  open: boolean;
  onNewChat: () => void;
}) {
  const [search, setSearch] = useState("");

  return (
    <aside
      className={`${
        open ? "flex" : "hidden"
      } w-64 shrink-0 flex-col border-r border-border bg-background-light md:flex`}
    >
      <div className="p-3">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-105"
        >
          + New Chat
        </button>
      </div>

      <div className="px-3 pb-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        <p className="px-1 py-2 text-xs font-medium uppercase tracking-wide text-text-muted">
          Recent Chats
        </p>
        <p className="px-1 py-2 text-sm text-text-muted">
          Your conversation history will appear here.
        </p>
      </div>

      <nav className="border-t border-border p-3">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="block rounded-md px-2 py-1.5 text-sm text-text-secondary hover:bg-background hover:text-secondary"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
