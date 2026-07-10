# Solution Boxes SEO Agent

The official AI SEO Support Assistant for [Solution Boxes](https://solutionboxes.com) — live SEO guidance grounded primarily in official Google documentation and trusted industry research.

The full product spec (role, knowledge policy, response format, expertise, behaviour, branding, dev standards, roadmap, security) lives in [`instructions/`](instructions/), read in numeric order. The compiled runtime system prompt lives in [`prompts/system-prompt.md`](prompts/system-prompt.md).

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Vercel AI SDK (`ai`, `@ai-sdk/react`)
- Claude API (`@ai-sdk/anthropic`) for production, per [instructions/07-development.md](instructions/07-development.md) — or Gemini (`@ai-sdk/google`) for free testing, selected via `AI_PROVIDER` (see below)
- Upstash Redis (`@upstash/redis`) — optional, powers the admin analytics dashboard

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in the variables below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public chat, or [http://localhost:3000/admin](http://localhost:3000/admin) for the password-protected admin view.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `AI_PROVIDER` | No | `google` (default — Gemini, free tier, no billing) or `anthropic` (Claude, paid, per the project spec — use for production). |
| `AI_MODEL` | No | Overrides the model used. Defaults to `gemini-2.5-flash` or `claude-sonnet-5` depending on `AI_PROVIDER`. |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes, if `AI_PROVIDER=google` | Free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey) — no billing required. |
| `ANTHROPIC_API_KEY` | Yes, if `AI_PROVIDER=anthropic` | Claude API key, from the [Anthropic Console](https://console.anthropic.com/settings/keys). Paid. |
| `ADMIN_PASSWORD` | Yes, for `/admin` | Password required to sign in to the admin view. |
| `AUTH_SECRET` | Yes, for `/admin` | Random secret used to sign the admin session cookie. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | No | Upstash Redis REST credentials, used only for the `/admin/analytics` dashboard. Without these the chat still works — the dashboard just shows "not connected". |

Without a valid key for the selected `AI_PROVIDER`, chat requests will fail gracefully with a retryable error in the UI — everything else in the app still works.

## Public vs. Admin

- **`/`** — the public chat widget. Just the chat box, no sidebar, no login. This is what gets embedded on solutionboxes.com.
- **`/admin`** — the same chat experience plus a sidebar (search, nav, log out) and an **Analytics** page at `/admin/analytics` showing conversation/message counts. Gated behind a password login (see [instructions/09-security.md](instructions/09-security.md) for how).

## Architecture

```
app/
  page.tsx                        public chat entry point (Header + ChatPanel, no sidebar)
  layout.tsx                       root layout, fonts, metadata
  globals.css                       brand design tokens (see instructions/06-ui.md) + markdown styling
  api/chat/route.ts                POST endpoint: streams the AI response (lib/model.ts picks the provider), records analytics via `after()`
  api/admin/login/route.ts         checks ADMIN_PASSWORD, sets signed session cookie
  api/admin/logout/route.ts        clears the session cookie
  admin/
    login/page.tsx                 password form (outside the dashboard layout/route group)
    (dashboard)/layout.tsx         Sidebar + Header shell for authenticated admin routes
    (dashboard)/page.tsx           admin chat view (renders ChatPanel)
    (dashboard)/analytics/page.tsx usage dashboard, reads lib/analytics.ts
components/
  ChatPanel.tsx                    chat state (useChat), messages, greeting, input — shared by / and /admin
  Header.tsx                       app header with Live status badge; sidebar toggle is optional (public page omits it)
  Sidebar.tsx                      admin-only nav: new chat, search, recent chats, Analytics, settings, log out
  ChatInput.tsx                    auto-resizing input with send button
  MessageBubble.tsx                renders a single message; markdown for assistant replies
lib/
  system-prompt.ts                 reads prompts/system-prompt.md at request time
  constants.ts                     app-wide constants (AI provider/model selection)
  model.ts                         returns the configured AI SDK model (Gemini or Claude)
  auth.ts                          signs/verifies the admin session cookie (HMAC, stateless)
  analytics.ts                     Redis-backed counters for conversations/messages; no-ops if unconfigured
proxy.ts                            protects /admin/* (redirects to /admin/login when unauthenticated)
instructions/                       source-of-truth product spec, one concern per file
prompts/                            compiled/runtime prompt content sent to Claude
```

The chat API route runs on the Node.js runtime (not Edge) because it reads the system prompt from disk. Note: this Next.js version renamed `middleware.ts` to `proxy.ts` — see `AGENTS.md`.

## Deployment

Deployed on [Vercel](https://vercel.com). Push to the connected GitHub repo's default branch to trigger a deployment, or deploy manually with `vercel --prod`.

Before the app is fully functional in production, set in the Vercel project's Environment Variables (make sure the **Production** checkbox is ticked for each):

1. `GOOGLE_GENERATIVE_AI_API_KEY` (free tier, default) — or set `AI_PROVIDER=anthropic` plus `ANTHROPIC_API_KEY` for production-grade Claude. Required for chat to respond.
2. `ADMIN_PASSWORD` and `AUTH_SECRET` — required for `/admin` to be reachable at all.
3. `KV_REST_API_URL` / `KV_REST_API_TOKEN` — optional, for the analytics dashboard. Create a Redis database via the Vercel dashboard's Storage tab (or at [upstash.com](https://upstash.com)) and copy its REST URL/token here.

Redeploy after adding/changing env vars.
