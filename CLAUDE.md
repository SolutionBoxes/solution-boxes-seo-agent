# Solution Boxes SEO Agent

Full project spec lives in [instructions/](instructions/), read in numeric order:

1. [01-project.md](instructions/01-project.md) — mission and scope
2. [02-role.md](instructions/02-role.md) — assistant persona and expertise
3. [03-knowledge.md](instructions/03-knowledge.md) — source-of-truth priority order
4. [04-behaviour.md](instructions/04-behaviour.md) — personality and rules
5. [05-response-format.md](instructions/05-response-format.md) — required answer structure
6. [06-ui.md](instructions/06-ui.md) — brand identity, design tokens, and chat experience requirements
7. [07-development.md](instructions/07-development.md) — stack, architecture principles, git/docs conventions
8. [08-roadmap.md](instructions/08-roadmap.md) — future features to design for but not build yet
9. [09-security.md](instructions/09-security.md) — pending

The compiled runtime system prompt (assembled from 02-05) lives in [prompts/system-prompt.md](prompts/system-prompt.md). Keep it in sync with `instructions/` by hand until build tooling assembles it automatically.

When writing code for this repo, follow [07-development.md](instructions/07-development.md) as the binding development standard.
