# Contributing

Thanks for helping. This repo is a shopping list for people building real apps
with AI tools, so every contribution has to be **accurate, sourced, and
readable by a beginner**.

## Ways to help

- **Suggest a checklist item.** Open an issue using the
  [Suggest an item](https://github.com/farqhar/builder-shopping-list/issues/new?template=suggest-an-item.yml)
  template.
- **Report a mistake.** If something is wrong, out of date, or a link is
  broken, use the
  [Report a mistake](https://github.com/farqhar/builder-shopping-list/issues/new?template=report-a-mistake.yml)
  template.
- **Open a pull request.** Fork the repo, make your change on a branch, and
  open a pull request (PR). The PR template has a short checklist to work
  through.

## The rules

### 1. Every claim needs a source

Every security, data or infrastructure recommendation must link to an
authoritative source. If you can't find one, leave the item out.

Good sources:

- Official documentation from the tool's own maker (Supabase, Vercel,
  GitHub, Cloudflare, Stripe and so on)
- [OWASP](https://owasp.org) projects and cheat sheets
- Standards bodies and regulators (for example, IETF, NIST, or a data
  protection authority)

Not enough on their own: blog posts, forum answers, videos, or anything an AI
tool told you. These can point you to the official source, but link to the
official source.

### 2. Plain English first

Write for someone who has never heard the term before. Define each technical
term the first time you use it in a file, and add it to
[`glossary.md`](glossary.md).

### 3. Keep each item short

Use the item format in [`checklists/_TEMPLATE.md`](checklists/_TEMPLATE.md).
A reader should be able to scan one item in under 30 seconds. Depth goes in
the "Learn more" link.

### 4. Generic examples only

Use made-up names like `my-app`, an `orders` table, or `example.com`. Never
include real company names, real URLs, project IDs, or details of a real
system.

### 5. Never include real secrets

Not even expired ones. Use obvious placeholders like `sk_live_REPLACE_ME`.

### 6. Concept first, tool second

Explain the idea in a way that works with any tool, then give a specific tool
(for example Supabase or Vercel) as the example. That way the advice still
holds if a tool goes away.

## Run the checks yourself

Every pull request runs two automatic checks. You can run them on your own
computer first. You need [Node.js](https://nodejs.org) installed.

Markdown style check:

```bash
npx markdownlint-cli2 "**/*.md"
```

Broken link check (needs [lychee](https://lychee.cli.rs) installed):

```bash
lychee --config lychee.toml .
```

## How contributions are approved

Every change to this repo goes through a pull request, and the maintainer
reviews and merges each one. Nothing reaches `main` without that approval.

- **You can't merge your own pull request.** Only the maintainer can.
- **Automatic checks run first.** If this is your first contribution, the
  checks may wait until the maintainer approves them to run. That's a GitHub
  safety feature for public repos, not a sign that anything is wrong.
- **Please be patient.** Every claim gets checked against its source, so a
  review can take a few days.

### Signing off your commits

This repo asks contributors to **sign off** their commits. A sign-off is a
line at the end of the commit message, `Signed-off-by: Your Name <email>`,
that confirms you have the right to contribute the work under this repo's
licences. This follows the
[Developer Certificate of Origin](https://developercertificate.org/).

- **Editing on GitHub.com:** GitHub adds the sign-off for you.
- **Using Git on your computer:** add `--signoff` (or `-s`) when you commit,
  for example `git commit -s -m "Fix broken link in security checklist"`.

Signing off is a promise, not a security check. It's different from
cryptographically signed commits. See
[GitHub: Managing the commit signoff policy](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/managing-the-commit-signoff-policy-for-your-repository).

## Code of Conduct

Everyone taking part is expected to follow our
[Code of Conduct](CODE_OF_CONDUCT.md).

## Licence of your contributions

By contributing, you agree that your code is licensed under [MIT](LICENSE)
and your writing under [CC BY 4.0](LICENSE-docs), the same as the rest of the
repo.
