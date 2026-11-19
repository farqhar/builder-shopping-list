# Supabase auth misconfiguration example

> ⚠️ **Deliberately misconfigured. Do not copy this into a real project.**

A pretend **internal admin tool** (only invited staff should get in), built
with Next.js and Supabase Auth, with sign-in mistakes planted in it. It's the
test project for the [`auth-check`](../../skills/auth-check/SKILL.md) skill.

There's no real Supabase project, no real keys, and nothing to install:

| File | What it is |
| --- | --- |
| `supabase/config.toml` | Auth settings |
| `src/middleware.ts` | Server code that guards the admin pages |
| `src/app/api/orders/route.ts` | A server API route |
| `src/lib/isAdmin.ts` | Decides who counts as an admin |
| `src/app/admin/page.tsx` | The admin page |
| `.env.example` | Settings (placeholders only) |
| [`EXPECTED-REPORT.md`](EXPECTED-REPORT.md) | The answer key |

Some files are set up correctly on purpose, so you can check that the skill
doesn't flag them.

## Try it

1. Install the skills (see [`skills/README.md`](../../skills/README.md)).
2. Open Claude Code in this folder (`examples/supabase-auth-misconfig`).
3. Tell it: *"This is an internal tool for my team. Check my auth."*
4. Compare what it finds with [`EXPECTED-REPORT.md`](EXPECTED-REPORT.md).

Want to learn the ideas first? Read the
[auth by app type guide](../../guides/auth-by-app-type.md).
