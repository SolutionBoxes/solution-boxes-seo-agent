import { APP_NAME } from "@/lib/constants";

export function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="rounded-md p-2 text-text-secondary hover:bg-background-light md:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        )}
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-semibold">
          S
        </div>
        <div>
          <p className="text-sm font-semibold text-secondary">{APP_NAME}</p>
          <p className="text-xs text-text-muted">AI SEO Support Assistant</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 rounded-full border border-border bg-background-light px-3 py-1 text-xs font-medium text-text-secondary">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Live
      </div>
    </header>
  );
}
