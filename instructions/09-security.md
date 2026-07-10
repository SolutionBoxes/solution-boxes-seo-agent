# SECURITY

## Public vs. admin access

- The public chat (`/`) requires no login — it is the embeddable widget for solutionboxes.com.
- Sidebar navigation, settings, and the analytics/performance dashboard are admin-only, served under `/admin`.
- `/admin` is protected by a single shared password (`ADMIN_PASSWORD` env var), not a full multi-user account system — there is only one admin (the site owner), so this matches the actual need. A full user-account system remains a future roadmap item (see [08-roadmap.md](08-roadmap.md)) if multiple admins are ever needed.
- On successful login, the server issues a signed, `httpOnly`, `secure` session cookie (HMAC-SHA256 over an expiry timestamp, keyed by `AUTH_SECRET`). It is stateless — no session store required — and expires after 7 days.
- `proxy.ts` (Next.js's replacement for `middleware.ts`) checks this cookie on every `/admin/*` request and redirects to `/admin/login` if missing or invalid.
- Password comparison and cookie signature comparison both use constant-time comparison (`crypto.timingSafeEqual`) to avoid timing attacks.

## Secrets

- `ANTHROPIC_API_KEY`, `ADMIN_PASSWORD`, `AUTH_SECRET`, and the Redis (`KV_REST_API_*`) credentials are all environment variables — never hardcoded, never committed (`.env*` is gitignored except `.env.example`).

## Remaining open topics

Not yet addressed, revisit as the product grows:

- Rate limiting / abuse prevention on the public chat endpoint (currently unauthenticated and unlimited).
- Prompt-injection resistance beyond the system prompt's own instructions.
- Any data-retention policy once conversations are persisted (see roadmap: Saved Chats, User Accounts).
