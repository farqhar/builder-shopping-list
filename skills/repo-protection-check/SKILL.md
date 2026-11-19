---
name: repo-protection-check
description: >-
  Audit a GitHub repository's protection and security settings (branch
  protection or rulesets on the default branch, who can merge, CODEOWNERS,
  approval for outside contributors' workflows, workflow token permissions,
  Dependabot, secret scanning and push protection) and explain the results in
  plain English for a beginner. Use when someone asks whether their repo or
  main branch is protected, is ready to go public or accept contributions, or
  how to set up branch protection.
when_to_use: >-
  For example "is my repo safe?", "protect my main branch", "set up branch
  protection", "can strangers merge into my repo", "check my GitHub security
  settings", or "am I ready to accept contributions?".
---

# Repo protection check

You are auditing a GitHub repository for someone who is probably not a
software engineer. Your job is to **check and explain**, then **offer** fixes.

## Ground rules

- **Read-only until the user says yes.** Every command in the "Check" steps
  only reads. Never run a command that changes anything (`--method PUT`,
  `POST`, `PATCH` or `DELETE`) until you've shown the user exactly what it
  will do and they have agreed to that specific fix.
- **Never** change collaborators, delete anything, or overwrite or edit an
  existing ruleset. If a ruleset already exists, explain the gap and give the
  settings path instead.
- **Don't guess.** If a check fails because of permissions or a missing tool,
  mark it ⚪ **Can't check**, say why, and move on.
- Define every technical term in plain words the first time you use it.
- Never print tokens, secrets or other people's email addresses.

## Step 1: Preflight

1. Run `gh --version`. If it fails, explain that this skill needs the GitHub
   CLI (a command-line tool for GitHub), link to <https://cli.github.com>,
   and stop.
2. Run `gh auth status`. If not logged in, tell the user to run
   `gh auth login` themselves, then stop.
3. Work out which repo to check. If the current folder is a GitHub repo, run
   `gh repo view --json nameWithOwner,defaultBranchRef,visibility,viewerPermission`.
   Otherwise ask the user for `owner/repo` and add `--repo owner/repo` to that
   command. Record `OWNER/REPO`, the default branch (call it `BRANCH`), the
   visibility (public or private) and `viewerPermission`.
4. If `viewerPermission` isn't `ADMIN`, warn the user that several settings
   are only visible to repo admins, and that those checks will show as
   ⚪ Can't check.

## Step 2: Check

Run each check, then record a result: 🟢 Pass, 🟡 Warning, 🔴 Fail or ⚪ Can't
check. A `404` from `gh api` usually means "not set up", unless the message
mentions permissions, in which case it's ⚪ Can't check.

### Check 1: Is the default branch protected?

Run `gh api repos/OWNER/REPO/rules/branches/BRANCH`. It lists every ruleset
rule active on the branch. Also run
`gh api repos/OWNER/REPO/branches/BRANCH/protection`, which covers the older
"branch protection rules". A 404 here means no classic protection.

Assess the combined result:

| Rule (ruleset `type` / classic equivalent) | Missing means |
| --- | --- |
| `pull_request` / `required_pull_request_reviews` | 🔴 Anyone with write access can push straight to `BRANCH` |
| `non_fast_forward` / `allow_force_pushes` false | 🔴 History can be rewritten |
| `deletion` / `allow_deletions` false | 🔴 The branch can be deleted |
| `required_status_checks` | 🟡 if the repo has workflows in `.github/workflows/`, otherwise 🟢 |

If nothing protects the branch at all, the whole check is 🔴.

### Check 2: Are the required checks real?

Only if Check 1 found required status checks. Get the names of checks that
actually ran on the latest commit:
`gh api repos/OWNER/REPO/commits/BRANCH/check-runs --jq '.check_runs[].name'`.
Any required check name that never appears there is 🟡. Explain that a
required check that never runs blocks every merge forever, and that the name
to use is the **job** name in the workflow file.

### Check 3: Is there an approval lockout?

If `required_approving_review_count` is 1 or more, list who can approve with
`gh api repos/OWNER/REPO/collaborators --jq '.[] | {login, role_name}'`.
If only one person has write access or higher, and the ruleset has no bypass
for them, mark 🟡. GitHub doesn't let authors approve their own pull requests,
so a solo maintainer can't merge. Suggest 0 approvals, or adding the
repository admin role to the bypass list in "pull requests only" mode.

### Check 4: Who can merge?

From the collaborators list in Check 3 (run it now if you skipped it), show
everyone with `admin`, `maintain` or `write`. Mark 🟢 if the user recognises
everyone. Ask them, and don't judge for them. Explain that people
**without** write access can open pull requests but can't merge them.

### Check 5: Is there a CODEOWNERS file?

Look for `.github/CODEOWNERS`, `CODEOWNERS` or `docs/CODEOWNERS`, locally or
with `gh api repos/OWNER/REPO/contents/.github/CODEOWNERS`. If it's missing,
mark 🟡. It isn't required, but it makes GitHub ask the owner to review every
pull request automatically.

### Check 6: Do outside contributors' workflows need approval? (public repos)

`gh api repos/OWNER/REPO/actions/permissions/fork-pr-contributor-approval`
returns `approval_policy`.

- `all_external_contributors` → 🟢
- `first_time_contributors` or `first_time_contributors_new_to_github` → 🟡.
  Explain that someone who gets one small change merged no longer needs
  approval, so their later code runs in your Actions unchecked.

Skip this check for private repos.

### Check 7: Are workflow tokens read-only by default?

`gh api repos/OWNER/REPO/actions/permissions/workflow` returns
`default_workflow_permissions`. `read` → 🟢, `write` → 🟡. Explain that the
`GITHUB_TOKEN` is a key GitHub gives every workflow run, and read-only means a
compromised step can't change the repo.

### Check 8: Dependabot

- Alerts: `gh api repos/OWNER/REPO/vulnerability-alerts`. Success (no
  output) → 🟢. 404 → 🔴.
- Security updates: `gh api repos/OWNER/REPO/automated-security-fixes`
  returns `enabled` (and `paused`). `enabled: true` and not paused → 🟢.
  `false`, paused, or a 404 (Dependabot not set up) → 🟡.

### Check 9: Secret scanning and push protection

`gh api repos/OWNER/REPO --jq .security_and_analysis` (admins only). Check
`secret_scanning.status` and `secret_scanning_push_protection.status`.
`enabled` → 🟢, otherwise 🔴. If the block is missing, mark ⚪ Can't check.

### Check 10: Is `.env` ignored?

Only if you're inside the repo folder. Run `git check-ignore -q .env`. Exit
code 0 → 🟢. Otherwise 🔴, and explain that `.env` files hold secret keys.
Also run `git ls-files | grep -iE '(^|/)\.env'`: any match other than
`.env.example` is 🔴, because a secrets file is already committed.

## Step 3: Report

Write the report in this order, in plain English:

1. **Summary.** One line, for example "3 things to fix, 2 to consider, 5
   looking good", then a table: Check | Result | One-line meaning.
2. **Findings.** For every 🔴 and 🟡, in that order:
   - **What we found:** one sentence.
   - **Why it matters:** one sentence on what could go wrong.
   - **How to fix it:** the click path in GitHub settings. Mention if you can
     do it for them in Step 4.
   - **Learn more:** the matching link from "Sources" below.
3. **What to do next.** A numbered list of at most five actions, most
   important first, written for a beginner.

If Check 10 found a committed `.env` file, put this first in "What to do
next": rotate every key in it before anything else. Deleting the file
doesn't help, because the key is still in Git history.

## Step 4: Offer fixes (only with permission)

Ask the user which of these they'd like you to apply. List only the ones that
failed. Before running each one, show the exact command and say what it
changes. Run nothing they haven't agreed to.

| Fix | Command |
| --- | --- |
| Protect the default branch (only if **no** ruleset targets it yet) | `gh api --method POST repos/OWNER/REPO/rulesets --input <file>`, see below |
| Turn on Dependabot alerts | `gh api --method PUT repos/OWNER/REPO/vulnerability-alerts` |
| Turn on Dependabot security updates | `gh api --method PUT repos/OWNER/REPO/automated-security-fixes` |
| Require approval for all outside contributors | `gh api --method PUT repos/OWNER/REPO/actions/permissions/fork-pr-contributor-approval -f approval_policy=all_external_contributors` |
| Make workflow tokens read-only | `gh api --method PUT repos/OWNER/REPO/actions/permissions/workflow -f default_workflow_permissions=read` |

Notes:

- **Ruleset:** start from the template at
  `${CLAUDE_PLUGIN_ROOT}/examples/github-rulesets/protect-main.json`. If that
  file doesn't exist, fetch
  <https://raw.githubusercontent.com/farqhar/builder-shopping-list/main/examples/github-rulesets/protect-main.json>.
  Replace the `required_status_checks` list with check names found in
  Check 2. If none ran, remove that whole rule. Save the result to a
  temporary file, show it to the user, and apply it only after they agree.
- **Read-only tokens:** warn first that workflows which push commits, create
  releases or comment on pull requests will then need an explicit
  `permissions:` block.
- **Secret scanning and push protection:** don't change these by command.
  Availability depends on the plan. Give the click path: Settings, then
  Advanced Security.
- After applying fixes, re-run the affected checks and show the new results.

## Sources

Use these for the "Learn more" links:

- Rulesets: <https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets>
- Available rules: <https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets>
- Approving your own pull request: <https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/approving-a-pull-request-with-required-reviews>
- CODEOWNERS: <https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners>
- Outside contributors' workflows and token permissions: <https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository>
- Dependabot alerts: <https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-alerts>
- Secret scanning: <https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning>
- Push protection: <https://docs.github.com/en/code-security/concepts/secret-security/push-protection>
- Removing a leaked secret: <https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository>
