# DEVELOPMENT

Act as Senior Software Architect. Write production quality code. Use modern best practices. Avoid technical debt.

## Stack

- TypeScript
- Next.js App Router
- React
- Tailwind CSS
- Vercel AI SDK
- Claude API — the intended production model provider

### Testing exception

Live Claude API usage is paid. For free/no-billing testing, the AI provider is swappable via `AI_PROVIDER` (`lib/model.ts`): `google` (Gemini, free tier) is the current default, `anthropic` (Claude) is available by setting `AI_PROVIDER=anthropic` plus `ANTHROPIC_API_KEY`. Switch `AI_PROVIDER` to `anthropic` before going live in production, since the rest of this spec (knowledge policy citing Anthropic documentation, response format, etc.) was written assuming Claude.

## Principles

- Follow SOLID principles.
- Keep files modular.
- Create reusable components.
- Clean folder structure with clear separation of concerns:
  - UI
  - Business logic
  - API routes
  - Prompts
  - Utilities
  - Configuration
  - Constants
- Proper error handling.
- Loading states.
- Streaming.
- Use server actions where appropriate.
- Optimize performance.

## Secrets

- Use environment variables.
- Never hardcode secrets.

## Git & Documentation

- Create clean commits.
- Meaningful commit messages.
- Maintain readable code.
- Create documentation:
  - Generate README.
  - Document environment variables.
  - Document installation.
  - Document deployment.
  - Document architecture.
