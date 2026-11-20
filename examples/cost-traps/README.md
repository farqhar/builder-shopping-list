# Cost traps example

> ⚠️ **Deliberately broken. Do not copy this into a real project.**

A tiny pretend app with surprise-bill traps planted in it, so you can practise
finding them safely. It's the test project for the
[`cost-trap-check`](../../skills/cost-trap-check/SKILL.md) skill.

It has no real Supabase project, no real keys, and nothing to install.

| File | What it is |
| --- | --- |
| `supabase/config.toml` | Project settings: row limits, upload limits, anonymous sign-ins |
| `supabase/functions/summarise/index.ts` | A public Edge Function that calls a paid AI API |
| `supabase/functions/send-code/index.ts` | An Edge Function that sends a paid SMS |
| `supabase/migrations/20260101000000_schedule.sql` | A scheduled job |
| `src/orders.js` | A list query |
| `src/products.js` | Another list query (this one is done right) |
| [`EXPECTED-REPORT.md`](EXPECTED-REPORT.md) | The answer key: what the skill should find |

## Try it

1. Install the skills (see [`skills/README.md`](../../skills/README.md)).
2. Open Claude Code in this folder (`examples/cost-traps`).
3. Ask: *"Could this app run up a surprise bill?"*
4. Compare what it finds with [`EXPECTED-REPORT.md`](EXPECTED-REPORT.md).
