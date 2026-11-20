---
name: ready-to-deploy
description: >-
  Walk a project through the whole Builder Shopping List before launch: runs
  the secrets, repo protection, database permission, sign-in and cost-trap
  audits where they apply, checks every item on the nine go-live checklists,
  asks about the things only the user can see, and gives one go-live verdict
  with the top next steps. Can save the results to GO-LIVE-REPORT.md so
  progress can be tracked over time.
when_to_use: >-
  For example "am I ready to launch?", "is my app ready to go live?", "run
  the full go-live check", "what am I missing before launch?", "update my
  go-live report", or as the first thing to run on a project that's about to
  get real users.
---

# Ready to deploy

You are running a full go-live review for someone who is probably not a
software engineer. This skill brings everything in the Builder Shopping List
together: five audit skills and nine checklists. Your job is to **check,
explain and prioritise**, then **offer** to save the results. Be encouraging:
most first launches miss things, and every item ticked is progress.

## Ground rules

- **Never change the project without asking.** The audits only read. The one
  file this skill writes, `GO-LIVE-REPORT.md`, is written only after the user
  agrees.
- **Never print or save a secret's value.** Follow the `secrets-scan` rules:
  at most the first 4 characters.
- **Don't guess.** Mark anything you can't see as ❓ and ask. A wrong ✅ is
  worse than an honest ❓.
- **Respect their time.** Ask questions in one batch per checklist, never one
  at a time, and skip items that clearly don't apply.
- Define each technical term in plain words the first time you use it.

## Where things are

This skill ships with the rest of the plugin. Read these files as you need
them:

- Checklists: `${CLAUDE_PLUGIN_ROOT}/checklists/00-before-you-start.md`
  through `${CLAUDE_PLUGIN_ROOT}/checklists/08-governance.md`.
- Audit skills: `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md` for
  `secrets-scan`, `repo-protection-check`, `supabase-rls-check`,
  `auth-check` and `cost-trap-check`.

## Step 1: Understand the project

1. Look at the project: is it a Git repository, does it have a GitHub
   remote (`git remote -v`), a `supabase/` folder, a `package.json`,
   workflows in `.github/workflows/`, a host config such as `vercel.json` or
   `netlify.toml`?
2. Ask the user, in one message:
   - What kind of app is it? (Website or web app, mobile app, internal tool,
     B2B SaaS, marketplace, API, browser extension, AI agent.)
   - Does it have real users yet, or is this before the first launch?
   - Which services does it use? (Confirm what you inferred: database, host,
     email, payments, AI, analytics.)
3. If `GO-LIVE-REPORT.md` exists, read it. This is a re-run: you'll show
   what changed since last time.

## Step 2: Run the audits

Run each audit that applies by reading its `SKILL.md` and following its steps
up to its report. Collect the findings; don't paste each skill's full report.
Run them in this order:

| Order | Skill | Run it when | Feeds checklists |
| --- | --- | --- | --- |
| 1 | `secrets-scan` | Always | 00, 01, 04 |
| 2 | `repo-protection-check` | There's a GitHub repository and the GitHub CLI is available | 00, 01, 04, 08 |
| 3 | `supabase-rls-check` | The project uses Supabase's database | 01, 02 |
| 4 | `auth-check` | The app has sign-in | 01, 06 |
| 5 | `cost-trap-check` | The app calls a paid API or uses usage-based services | 06 |

**If `secrets-scan` finds a real secret (any 🔴), stop and say so first.**
Rotating that key matters more than everything else in this review. Offer to
continue once the user has rotated it, or straight away if they prefer.

Skip a skill when there's no evidence it applies, and say why in one line
(for example "No Supabase folder, so the database permission check was
skipped").

## Step 3: Walk the checklists

For each checklist `00` to `08`, read its **"Track your progress"** list.
That list is the source of truth for the items and their exact wording. For
each line, record:

- ✅ **Done**: an audit or the project's files show it. Say what showed it.
- ❌ **Missing**: an audit or the files show it isn't done.
- ❓ **Ask**: you can't see it (dashboard settings, billing, accounts,
  documents). Ask the user.
- ➖ **Doesn't apply**: for example email items for an app that sends no
  email. Say why.

Then, per checklist, ask about every ❓ in **one** message. Accept "don't
know" as an answer and record it as not done.

Some useful evidence:

- `00`: `git` status, the remote, `.gitignore`, `supabase/seed.sql`, a
  separate development project.
- `02`: `supabase/migrations/`, foreign keys and indexes in them.
- `04`: workflow files, `permissions:` blocks, SHA-pinned actions,
  `dependabot.yml`.
- `05`: an error tracker in `package.json` (for example `@sentry/`), logging
  calls near passwords or tokens.
- `07`: a privacy page or route in the app.
- `08`: `SECURITY.md`, `CODEOWNERS`.

## Step 4: Give the verdict

Work out the verdict:

- 🔴 **Not ready yet** if any audit found a 🔴, or any of these is missing:
  the security checklist's "If you only do three" items, a backup you know
  about (`02`), or a spend cap or alert on paid AI or SMS services (`06`).
- 🟡 **Ready, with known gaps** if there are no 🔴s, but some items are ❌
  or unanswered.
- 🟢 **Ready to launch** if every item that applies is ✅.

Then write the report in this order:

1. **Verdict** in one line, with a one-sentence reason.
2. **Scorecard:** Checklist | Done | Total that apply | Biggest gap. Count
   only items that apply.
3. **Top five next steps**, most urgent first. Each one says what to do,
   why in one sentence, and which checklist item or skill to use. Order:
   rotate leaked keys, then other 🔴 audit findings, then "If you only do
   three" items, then the rest.
4. **What's going well:** two or three things they got right.
5. **On a re-run:** what's newly done since the last report, and anything
   that went backwards.
6. **The disclaimer:** this is a learning tool, not a professional security
   audit. Anyone handling payments, health data or children's data should get
   a qualified review.

## Step 5: Offer to save `GO-LIVE-REPORT.md`

Ask: *"Want me to save this as `GO-LIVE-REPORT.md` in your project, so you
can track progress and run this again later?"* Only write it if they say yes.

Use this format:

- A title, the date, and the verdict.
- The scorecard table.
- The top five next steps.
- One section per checklist with its "Track your progress" lines copied
  **word for word**, ticked `- [x]` for ✅, unticked `- [ ]` for ❌ and
  unanswered, and ➖ lines kept but marked "(doesn't apply: reason)". Link
  each checklist heading to its page on GitHub:
  `https://github.com/farqhar/builder-shopping-list/blob/main/checklists/<file>`.
- A note at the end listing which audits ran and which were skipped.

Never put secret values, real customer data or passwords in the file. Tell
the user they can commit it (useful for a co-founder or client) or keep it
out of Git by adding it to `.gitignore`. On a re-run, update the same file
rather than creating a new one.

## Sources

This skill applies the sources already cited in the checklists and the five
audit skills. Point to the checklist item, not a new source, in each next
step.
