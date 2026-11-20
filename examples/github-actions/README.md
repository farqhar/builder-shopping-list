# GitHub Actions examples

Copy-and-paste workflows with every line commented, so you can see what each
part does. A **workflow** is a file in `.github/workflows/` that GitHub runs
automatically, for example on every pull request.

## `starter-ci.yml`: check every pull request

A starter **CI** (continuous integration) workflow for Node.js projects, which
covers most apps built with Lovable, Bolt, Vite or Next.js. On every pull
request and every push to `main`, it:

1. downloads your code
2. installs Node.js and your packages (`npm ci`)
3. runs your `lint`, `build` and `test` scripts from `package.json`, if
   they exist

It follows the advice in the [CI/CD checklist](../../checklists/04-ci-cd.md):
read-only permissions, actions pinned to exact commits, and no secrets.

### How to use it

1. Copy [`starter-ci.yml`](starter-ci.yml) into your repo as
   `.github/workflows/ci.yml`. GitHub only runs workflows in that folder.
2. Check that your `package.json` has the scripts you want run. Missing
   ones are skipped, not failed.
3. Commit, push and open a pull request. You'll see a check called
   **checks** appear.
4. Once it passes, make **checks** a required status check on `main`. The
   ready-made ruleset in [`../github-rulesets/`](../github-rulesets/README.md)
   shows how.

**Not using Node.js?** Keep the structure and swap the setup and `npm` steps
for your language's equivalents. GitHub has starter workflows for most
languages under your repo's **Actions** tab, then **New workflow**.

## Workflows this repo uses on itself

These run on every change to this repo. They're working examples, also
commented line by line:

| Workflow | What it checks |
| --- | --- |
| [`lint.yml`](../../.github/workflows/lint.yml) | Markdown style, with markdownlint |
| [`links.yml`](../../.github/workflows/links.yml) | Broken links: changed files on each pull request, all files weekly |
| [`plugin.yml`](../../.github/workflows/plugin.yml) | That the Claude Code plugin and skills are valid |
