# GitHub rulesets

A **ruleset** is a named group of rules that GitHub enforces on chosen
branches. This folder has a ready-made one you can import in a few clicks.

## `protect-main.json`

Protects your default branch (usually `main`) so that:

| Rule | What it means in practice |
| --- | --- |
| Restrict deletions | Nobody can delete `main`. |
| Block force pushes | Nobody can rewrite `main`'s history. |
| Require a pull request | Every change goes through a pull request (PR). No pushing straight to `main`. |
| Require conversations resolved | Review comments must be resolved before merging. |
| Squash merging only | Each PR becomes one tidy commit on `main`. |
| Require status checks | Named automatic checks must pass before the merge button works. |

### Before you import: edit the status checks

The file requires two checks called `markdownlint` and `changed-files`.
Those are this repo's checks. **Change them to your own repo's check names**,
or delete the `required_status_checks` block if you don't have CI yet.

A check name is the **job** name inside your workflow file, for example
`markdownlint:` in `.github/workflows/lint.yml`. Only require checks that run
on every pull request. A check that's skipped will block merging forever.

### How to import it

1. In your repo, go to **Settings**, then **Rules**, then **Rulesets**.
2. Open the **New ruleset** dropdown and choose **Import a ruleset**.
3. Pick `protect-main.json`, review the settings GitHub shows you, and save.

Source: [GitHub: Managing rulesets for a repository](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/managing-rulesets-for-a-repository)
· [Available rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)

### Why "required approvals" is set to 0

GitHub doesn't let you approve your own pull request. If you're working alone
and require one approval, you'll lock yourself out of merging.

That's safe, because **people without write access can't merge at all**. When
a stranger opens a PR, only you can press the merge button, so pressing it
*is* your approval.

When you add a collaborator with write access, raise the count to 1 in the
ruleset's settings. If you still need to merge your own PRs, add
the repository admin role to the ruleset's bypass list, set to apply to
pull requests only (GitHub calls this the `pull_request` bypass mode). That
way the bypass never allows direct pushes to `main`.

Source: [GitHub: Approving a pull request with required reviews](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/approving-a-pull-request-with-required-reviews)
· [REST API: bypass modes](https://docs.github.com/en/rest/repos/rules)
