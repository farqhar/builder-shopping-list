# Before you start

**Last verified:** 2026-11-20

**Who this is for:** Anyone about to build (or who has just started building) an app with an AI tool like Lovable, Bolt, Cursor or Claude Code.
**When to do it:** On day one, before you have real users. Everything here gets harder to add later.

These are the foundations every other checklist assumes: your code saved
somewhere you control, a safe way to make changes, and a place to try things
that isn't your live app.

## If you only do three

1. **[Get your code into Git and onto GitHub](#keep-your-code-in-git-with-a-copy-you-control).** If it only lives inside an AI tool, you don't fully own it.
2. **[Keep development and production separate](#use-a-separate-database-for-development).** Experiments shouldn't touch real users' data.
3. **[Keep settings and secrets out of your code](#keep-settings-and-secrets-out-of-your-code).** From the very first commit.

## Track your progress

Copy this list into a GitHub issue in your own repo to get boxes you can tick.

```markdown
- [ ] My code is in Git, with a copy on GitHub that I control
- [ ] My repo is private, unless I've chosen to make it public
- [ ] I have a .gitignore before my first commit
- [ ] I make changes on a branch and merge them with a pull request
- [ ] MFA is on for my GitHub account
- [ ] I have a separate database for development
- [ ] My development database uses made-up seed data
- [ ] Settings and secrets live in environment variables, not code
- [ ] I've listed every service my app depends on
```

## Your code

### Keep your code in Git, with a copy you control

- **What:** Store your project in **[Git](../glossary.md#git)**, a version control system, and keep a copy in a **[repository](../glossary.md#repository)** on GitHub (or GitLab or Bitbucket) under your own account.
- **Why it matters:** Git "records changes to a file or set of files over time so that you can recall specific versions later". When an AI edit breaks something, you can go back. AI builders support this directly. Lovable lets you export to GitHub to "back up your code… and deploy outside Lovable", and Bolt describes it as a backup "with a full history of changes that lives outside Bolt".
- **How to check:** Your project appears in your own GitHub account, and recent changes show up there.
- **Learn more:** [Git: About version control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control) · [Lovable: Sync with GitHub](https://docs.lovable.dev/integrations/github) · [Bolt: GitHub for version control](https://support.bolt.new/integrations/git)

### Choose whether your repo is public or private

- **What:** GitHub repositories "can be either public or private". Pick on purpose.
- **Why it matters:** A public repo can be read by anyone, including anything you accidentally commit. Start private unless you mean to share the code.
- **How to check:** Your repo's name on GitHub shows a **Private** or **Public** label next to it.
- **Learn more:** [GitHub: About repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories)

### Add a `.gitignore` before your first commit

- **What:** A **[`.gitignore`](../glossary.md#gitignore)** file tells Git which files never to save, such as `.env` files that hold secrets.
- **Why it matters:** Once a secret is committed, it stays in the history even after you delete it. It's far easier to prevent than to clean up.
- **How to check:** Your repo has a `.gitignore` that lists `.env`. See the [security checklist](01-security.md#keep-secret-keys-out-of-your-code) for the full check.
- **Learn more:** [Git: gitignore](https://git-scm.com/docs/gitignore)

### Make changes on a branch, then merge with a pull request

- **What:** Do each change on its own **[branch](../glossary.md#branch)**, then open a **[pull request](../glossary.md#pull-request)** to review it before it joins your main code. GitHub calls this "GitHub flow", a "lightweight, branch-based workflow".
- **Why it matters:** Your main branch stays working while you experiment, and every change gets a moment for review and automatic checks.
- **How to check:** Your recent changes arrived through pull requests, not straight onto `main`. To enforce it, see the [governance checklist](08-governance.md#protect-your-main-branch).
- **Learn more:** [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow)

### Turn on MFA for your GitHub account

- **What:** Protect the account that holds your code with **[multi-factor authentication](../glossary.md#multi-factor-authentication-mfa)**.
- **Why it matters:** Whoever gets into your GitHub account gets your code, and often your deployments too.
- **How to check:** GitHub, then Settings, then Password and authentication.
- **Learn more:** [GitHub: Configuring two-factor authentication](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication)

## Environments

An **[environment](../glossary.md#environment)** is one running copy of your
app with its own settings and data. Most apps have at least two:
**development**, where you build and test, and **production**, the live
app your users use.

### Use a separate database for development

- **What:** Build and test against a database that isn't the one your users use: a local Supabase database, or a separate project.
- **Why it matters:** The Twelve-Factor App, a widely used guide to building web apps, says to "keep development, staging, and production as similar as possible", but separate. One wrong command in a shared database deletes real customer data. Supabase's environments guide uses separate staging and production projects.
- **How to check:** You can name your development database, and it isn't the production one. See the [data checklist](02-data.md#test-changes-on-a-separate-database-first).
- **Learn more:** [Twelve-Factor: Dev/prod parity](https://12factor.net/dev-prod-parity) · [Supabase: Managing environments](https://supabase.com/docs/guides/deployment/managing-environments)

### Fill your development database with made-up data

- **What:** Use **seed data**, which Supabase describes as "sample or default data", in development instead of copying real users' data.
- **Why it matters:** Real personal data in a test database is real personal data in a less-protected place. Seed files also make your test setup repeatable: Supabase runs them every time you reset your local database.
- **How to check:** Your project has a seed file (for Supabase, `supabase/seed.sql`) with obviously fake names, emails and orders.
- **Learn more:** [Supabase: Seeding your database](https://supabase.com/docs/guides/local-development/seeding-your-database)

### Keep settings and secrets out of your code

- **What:** Put anything that changes between environments, like database URLs, API keys and feature switches, in **[environment variables](../glossary.md#environment-variable)**, not in your code.
- **Why it matters:** The Twelve-Factor App's test: could your code "be made open source at any moment, without compromising any credentials"? If not, a secret is in the wrong place. It also lets the same code run in development and production with different settings.
- **How to check:** Search your code for anything that looks like a key or a full database URL. Each one should be read from an environment variable instead.
- **Learn more:** [Twelve-Factor: Config](https://12factor.net/config) · [Security checklist: secrets](01-security.md#keep-secret-keys-out-of-your-code)

## Your accounts

### Write down every service your app depends on

- **What:** Keep a simple list: code host, database, hosting, domain, email, payments, and AI tools. For each one, note who owns it and which plan it's on.
- **Why it matters:** You can't protect, back up, hand over or pay for what you've forgotten exists. The list is also the starting point for the [governance checklist](08-governance.md#have-more-than-one-owner-on-every-critical-account).
- **How to check:** You could hand the list to someone else and they'd know where everything lives.
- **Learn more:** [Governance checklist](08-governance.md)

## Further reading

- [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow)
- [Git: About version control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)
- [The Twelve-Factor App](https://12factor.net/)
- [Supabase: Local development](https://supabase.com/docs/guides/local-development)
