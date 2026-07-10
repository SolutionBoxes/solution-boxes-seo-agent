# Solution Boxes SEO Agent

The official AI SEO Support Assistant for [Solution Boxes](https://solutionboxes.com) — live SEO guidance grounded primarily in official Google documentation and trusted industry research.

The full product spec (role, knowledge policy, response format, expertise, behaviour, branding, dev standards, roadmap) lives in [`instructions/`](instructions/), read in numeric order. The compiled runtime system prompt lives in [`prompts/system-prompt.md`](prompts/system-prompt.md).

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Vercel AI SDK (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/react`)
- Claude API

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Claude API key, from the [Anthropic Console](https://console.anthropic.com/settings/keys). |
| `ANTHROPIC_MODEL` | No | Overrides the Claude model used (defaults to `claude-sonnet-5`). |

Without `ANTHROPIC_API_KEY` set, chat requests will fail gracefully with a retryable error in the UI — everything else in the app still works.

## Architecture

```
app/
  page.tsx            entry point, renders ChatWindow
  layout.tsx           root layout, fonts, metadata
  globals.css           brand design tokens (see instructions/06-ui.md) + markdown styling
  api/chat/route.ts    POST endpoint: streams Claude responses via the Vercel AI SDK
components/
  ChatWindow.tsx        top-level chat state (useChat), layout composition
  Header.tsx            app header with Live status badge
  Sidebar.tsx            new chat / search / nav (collapsible on mobile)
  ChatInput.tsx          auto-resizing input with send button
  MessageBubble.tsx     renders a single message; markdown for assistant replies
lib/
  system-prompt.ts      reads prompts/system-prompt.md at request time
  constants.ts           app-wide constants (model id, suggested prompts)
instructions/           source-of-truth product spec, one concern per file
prompts/                 compiled/runtime prompt content sent to Claude
```

The chat API route runs on the Node.js runtime (not Edge) because it reads the system prompt from disk.

## Deployment

Deployed on [Vercel](https://vercel.com). Push to the connected GitHub repo's default branch to trigger a deployment, or deploy manually with `vercel --prod`.

Set `ANTHROPIC_API_KEY` (and optionally `ANTHROPIC_MODEL`) in the Vercel project's Environment Variables before the assistant will respond to messages.
