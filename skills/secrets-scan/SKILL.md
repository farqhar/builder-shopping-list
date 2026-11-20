---
name: secrets-scan
description: >-
  Scan a project for leaked secrets: API keys, tokens and passwords in code,
  in tracked .env files, in browser-exposed environment variables, in GitHub
  Actions workflows and in Git history. Never prints secret values. Explains
  the results in plain English for a beginner, and puts "rotate the key" first
  whenever something real is found.
when_to_use: >-
  For example "have I leaked any keys?", "scan my repo for secrets", "is my
  .env safe?", "did I commit my API key?", "is it safe to make this repo
  public?", or before making a repository public or launching an app.
---

# Secrets scan

You are checking a project for leaked secrets, for someone who is probably not
a software engineer. A **secret** is anything that grants access or costs
money if a stranger has it: an API key, a database password, a token, a
private key. Your job is to **find and explain**, then **offer** fixes. Use
`${CLAUDE_PLUGIN_ROOT}/checklists/01-security.md` for background if it exists.

## Ground rules

- **Never print a secret's value.** Not in the report, not in a command's
  output you repeat, not in a suggested fix. Name the file and line, say what
  kind of secret it looks like, and show at most its first 4 characters
  followed by `…`. If a command you run would print a value, pipe it through
  something that hides it, or only count matches.
- **Never change anything without asking.** Show the exact change first, and
  apply it only after the user agrees to that specific change.
- **Never rewrite Git history yourself.** It's risky and affects everyone who
  has a copy. Explain the option and link to GitHub's guide.
- **Placeholders are not secrets.** Values like `REPLACE_ME`, `your-key-here`,
  `xxx`, `changeme`, `<...>` or an empty value are fine. Say so briefly.
- Define each technical term in plain words the first time you use it:
  secret, environment variable, `.env` file, `.gitignore`, Git history,
  rotate.

## Step 1: Gather the evidence

1. **Is this a Git repository?** Run `git rev-parse --is-inside-work-tree`.
   If not, skip the Git-only checks (S2, S5, S6) and mark them ⚪ **Can't
   check**.
2. **Tracked files.** List them with `git ls-files`. Only tracked files are
   in the repository. Untracked files on the user's computer aren't a leak
   (yet).
3. **Search tracked files for secret-shaped values.** Look for:
   - Supabase secret keys: `sb_secret_`, and the older `service_role` key
     (a long token starting `eyJ`, often in a variable named
     `SERVICE_ROLE`).
   - Payment keys: `sk_live_`, `rk_live_`.
   - AI provider keys: `sk-ant-`, `sk-proj-`, or `sk-` followed by a long
     random string.
   - Cloud keys: `AKIA` followed by 16 capital letters or digits.
   - Private keys: `-----BEGIN` … `PRIVATE KEY-----`.
   - Assignments where the name says secret and the value is long and random:
     `*_SECRET`, `*_TOKEN`, `*_PASSWORD`, `*_API_KEY`, `*_PRIVATE_KEY`.
4. **`.env` files.** Find every file named `.env` or `.env.*`. Check which are
   tracked (`git ls-files`), and read `.gitignore`.
5. **Browser-exposed variables.** Search for environment variables whose names
   start with `VITE_` or `NEXT_PUBLIC_` and contain `SECRET`, `SERVICE_ROLE`,
   `PRIVATE`, `PASSWORD` or `TOKEN`, in code and in `.env*` files.
6. **Workflows.** Read `.github/workflows/*.yml`. Look for secret-shaped
   values written directly in the file, rather than `${{ secrets.NAME }}`.
7. **Git history.** Secrets deleted from the files can still be in old
   commits. Search history for each pattern from item 3 with
   `git log --all -p -S '<pattern>' --format='%h %ad' --date=short` and only
   report the commit and file, never the matching line. For large histories,
   start with `git log --all --format='%h' -- '*.env' '.env*'` to find any
   `.env` file that was ever committed.

## Step 2: Check

Record a result for every check: 🔴 **Fix now**, 🟡 **Check this**, 🟢
**Looks good** or ⚪ **Can't check**.

### 🔴 Fix now

| # | Look for | Why it matters | Source |
| --- | --- | --- | --- |
| S1 | A real-looking secret in any tracked file (step 3) | Anyone who can see the repository can use it. GitHub's own secret scanning looks for exactly these "hardcoded credentials, including API keys, passwords, tokens". | GitHub: Secret scanning |
| S2 | A `.env` file (anything other than `.env.example` or similar templates) tracked by Git | `.env` files hold real secrets. Adding `.env` to `.gitignore` afterwards doesn't help: "Files already tracked by Git are not affected." | Git: gitignore |
| S3 | A secret in a `VITE_` or `NEXT_PUBLIC_` variable | These prefixes copy the value into the code every visitor downloads. Vite: variables prefixed with `VITE_` "will be exposed in client-side source code". A Supabase secret key there "bypasses Row Level Security". | Vite: Env variables; Next.js: Environment variables; Supabase: API keys |
| S4 | A secret written directly in a workflow file | Workflow files are part of the repository. GitHub Actions has a built-in secrets store for these values. | GitHub: Using secrets in GitHub Actions |

### 🟡 Check this

| # | Look for | Why it matters | Source |
| --- | --- | --- | --- |
| S5 | `.env` not covered by `.gitignore`, even if not tracked yet | One `git add .` away from a leak. | Git: gitignore |
| S6 | A secret in Git history that's no longer in the current files | Deleting the line doesn't remove it from old commits. Anyone with a copy of the repository can still find it. | GitHub: Removing sensitive data |
| S7 | GitHub secret scanning and push protection not confirmed on (ask the user, or suggest the `repo-protection-check` skill) | Secret scanning finds leaks across "your entire Git history on all branches". Push protection stops many secrets before they're pushed. | GitHub: Secret scanning; GitHub: Push protection |
| S8 | `.env.example` (or another template) containing real-looking values instead of placeholders | Templates are meant to be committed, so a real value there is a leak. | Git: gitignore |

A 🟢 result means nothing was found for that check. Say so briefly. People
like to know what they got right.

## Step 3: Report

Write the report in this order, in plain English:

1. **Summary.** One line, for example "1 thing to fix now, 1 to check, 6
   looking good", then a table: Check | Result | One-line meaning.
2. **Findings.** For every 🔴, then every 🟡:
   - **What we found:** the file and line (or commit), and the kind of
     secret, with at most its first 4 characters.
   - **Why it matters:** one sentence, phrased as what a stranger could do
     with it.
   - **How to fix it:** see step 4.
   - **Learn more:** the matching link from "Sources" below.
3. **What to do next.** At most five numbered steps, most urgent first.

Rules for "What to do next":

- **If S1, S2, S3, S4 or S6 found a real secret, step 1 is always: rotate it
  now.** "Rotate" means create a new key in the service's dashboard, switch
  the app to it, then delete the old one. GitHub's guidance: "as a first step
  you need to revoke and/or rotate that secret". Removing it from the code
  comes second, because copies already exist wherever the code was cloned,
  forked or deployed.
- Say plainly that rewriting history is optional once the key is rotated.
  GitHub calls it "time-intensive and often unnecessary if you've already
  revoked the credential".
- If the repository is public, or about to be, say so in the summary. It
  raises the urgency of every 🔴.
- Always end by pointing to the security checklist's secrets section and,
  if S7 couldn't be confirmed, the `repo-protection-check` skill.

## Step 4: Offer fixes (only with permission)

Offer each fix separately. Show the change before making it.

- **S1, S4:** move the value into an environment variable (or a GitHub
  Actions secret for workflows) and reference it by name. The user creates the
  new secret value themselves. Never type it for them.
- **S2:** add `.env` to `.gitignore` and stop tracking the file with
  `git rm --cached .env`. This keeps the file on their computer but removes it
  from future commits. It does not remove it from history (see S6).
- **S3:** rename the variable without the `VITE_` or `NEXT_PUBLIC_` prefix and
  move the code that uses it to a server or Edge Function. For Supabase, the
  browser gets the publishable key only.
- **S5:** add `.env` and `.env.*` to `.gitignore`, with `!.env.example` so the
  template stays tracked.
- **S6:** after rotating, explain that history can be cleaned with
  `git-filter-repo`, and link GitHub's guide. Don't run it.
- **S7:** give the click path (Settings → Advanced Security), or run the
  `repo-protection-check` skill.
- **S8:** replace the value with a placeholder like `REPLACE_ME`.

## Sources

Use these for the "Learn more" links:

- GitHub: Secret scanning: <https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning>
- GitHub: Push protection: <https://docs.github.com/en/code-security/concepts/secret-security/push-protection>
- GitHub: Removing sensitive data from a repository: <https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository>
- GitHub: Using secrets in GitHub Actions: <https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets>
- Git: gitignore: <https://git-scm.com/docs/gitignore>
- Vite: Env variables and modes: <https://vite.dev/guide/env-and-mode>
- Next.js: Environment variables: <https://nextjs.org/docs/app/guides/environment-variables>
- Supabase: API keys: <https://supabase.com/docs/guides/getting-started/api-keys>
- OWASP: Secrets Management Cheat Sheet: <https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html>
