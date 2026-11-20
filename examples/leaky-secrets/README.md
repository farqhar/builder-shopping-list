# Leaky secrets example

> ⚠️ **Deliberately broken. Do not copy this into a real project.**

A tiny pretend app with secret-handling mistakes planted in it, so you can
practise finding them safely. It's the test project for the
[`secrets-scan`](../../skills/secrets-scan/SKILL.md) skill.

**Every "secret" here is fake.** They're shaped like real keys so the skill has
something to find, but they don't work anywhere. Ask the skill to treat them
as real, because in your own project they would be.

| File | What it is |
| --- | --- |
| `.env` | Settings file with secrets in it, **committed to Git** on purpose |
| `.env.example` | A template with placeholders (this one is done right) |
| `.gitignore` | Ignores some files, but not `.env` |
| `src/supabaseClient.js` | Browser code that connects to Supabase |
| `src/ai.js` | Browser code that calls an AI service |
| `.github/workflows/deploy.yml` | A deploy workflow (it never runs; see the comment inside) |
| [`EXPECTED-REPORT.md`](EXPECTED-REPORT.md) | The answer key: what the skill should find |

## Try it

1. Install the skills (see [`skills/README.md`](../../skills/README.md)).
2. Open Claude Code in this folder (`examples/leaky-secrets`).
3. Ask: *"Scan this project for leaked secrets. The keys are fake practice
   values, but treat them as real."*
4. Compare what it finds with [`EXPECTED-REPORT.md`](EXPECTED-REPORT.md).

Or try it yourself first. Open each file and see how many leaks you can spot.
