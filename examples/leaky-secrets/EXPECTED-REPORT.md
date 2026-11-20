# Expected report

What the [`secrets-scan`](../../skills/secrets-scan/SKILL.md) skill should
find in this example. The wording will vary from run to run, but the findings
and their colours should match. Secret values should never appear in full:
at most the first 4 characters.

## Summary

**4 things to fix now, 1 to check, 2 looking good, 1 can't check.**

| Check | Result | Meaning |
| --- | --- | --- |
| S1 Secrets in tracked files | 🔴 Fix now | Three fake keys in `.env`, `src/ai.js` and the workflow |
| S2 `.env` tracked by Git | 🔴 Fix now | `.env` is committed, so everyone with the repo has it |
| S3 Secret in a browser variable | 🔴 Fix now | `VITE_SUPABASE_SECRET_KEY` ships to every visitor |
| S4 Secret in a workflow file | 🔴 Fix now | `DEPLOY_TOKEN` is written into `deploy.yml` |
| S5 `.env` not in `.gitignore` | 🟡 Check this | `.gitignore` doesn't cover `.env` |
| S6 Secrets in Git history | 🟢 Looks good | Nothing in history beyond what's already in the current files |
| S7 Secret scanning and push protection | ⚪ Can't check | A repository setting: the skill should ask, or suggest `repo-protection-check` |
| S8 `.env.example` | 🟢 Looks good | Placeholders only |

## Findings

### 🔴 S1: secrets written into tracked files

- `.env`: a Supabase secret key (`sb_s…`) and a payment secret key (`sk_l…`).
- `src/ai.js`: an AI API key (`sk-p…`) written straight into browser code.
- `.github/workflows/deploy.yml`: `DEPLOY_TOKEN` (`tok_…`).

`DEPLOY_URL` in the same workflow is **not** a finding: a URL isn't a secret.

### 🔴 S2: `.env` is tracked by Git

Adding `.env` to `.gitignore` now wouldn't help: Git only ignores files it
isn't already tracking. The fix is `git rm --cached .env`, after rotating.

### 🔴 S3: secret key in a `VITE_` variable

`src/supabaseClient.js` passes `VITE_SUPABASE_SECRET_KEY` to
`createClient`. Vite copies `VITE_` variables into the code every visitor
downloads, and a Supabase secret key bypasses Row Level Security. The browser
should use the publishable key, as `.env.example` shows.

### 🔴 S4: token in the workflow file

It should be stored as a GitHub Actions secret and referenced as
`${{ secrets.DEPLOY_TOKEN }}`.

### 🟡 S5: `.gitignore` doesn't cover `.env`

`.gitignore` should list `.env` and `.env.*`, with `!.env.example`.

A good report also explains that because these files were committed, the
values are in Git history: removing them from the files later won't remove
them from old commits. That's why rotating comes first.

## What to do next

1. **Rotate every key found**: the Supabase secret key, the payment key, the
   AI key and the deploy token. Do this first, before any code change.
2. Stop tracking `.env` (`git rm --cached .env`) and add `.env` to
   `.gitignore`.
3. Switch the browser to the publishable key, and move the AI call to a
   server or Edge Function.
4. Move `DEPLOY_TOKEN` into GitHub Actions secrets.
5. Turn on secret scanning and push protection, or run the
   `repo-protection-check` skill. Cleaning history is optional once every key
   is rotated.
