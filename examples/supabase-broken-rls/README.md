# Supabase broken RLS example

> ⚠️ **Deliberately broken. Do not copy this into a real project.**

A tiny pretend app with database permission mistakes planted in it, so you can
practise finding them safely. It's the test project for the
[`supabase-rls-check`](../../skills/supabase-rls-check/SKILL.md) skill.

It has no real Supabase project, no real keys, and nothing to install. It's
just the files the skill reads:

| File | What it is |
| --- | --- |
| `supabase/migrations/20260101000000_init.sql` | The database setup: four tables and a view. Two tables are set up correctly; the rest have problems. |
| `src/lib/supabase.js` | Browser code that connects to Supabase. |
| `.env.example` | The settings the browser code reads (placeholders only). |
| `solution/20260102000000_fix_rls.sql` | One way to fix everything. Don't peek until you've tried. |
| [`EXPECTED-REPORT.md`](EXPECTED-REPORT.md) | The answer key: what the skill should find. |

## Try it

1. Install the skills (see [`skills/README.md`](../../skills/README.md)).
2. Open Claude Code in this folder (`examples/supabase-broken-rls`).
3. Ask: *"Check my Supabase RLS."*
4. Compare what it finds with [`EXPECTED-REPORT.md`](EXPECTED-REPORT.md).

Or try it yourself first. Read the migration file and see how many problems
you can spot before you look at the answers.
