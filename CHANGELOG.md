# Changelog

Every notable change to Builder Shopping List is recorded here, newest first.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and version numbers follow [Semantic Versioning](https://semver.org/):

- **Major** (2.0.0): a skill is removed or renamed, or a checklist is
  renumbered, so links or habits people rely on break.
- **Minor** (1.1.0): a new skill, checklist, guide or audit check.
- **Patch** (1.0.1): corrections, clearer wording, fixed links.

The version lives in [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json).
See [CONTRIBUTING.md](CONTRIBUTING.md#releasing-a-new-version) for how to
release one.

## [Unreleased]

Nothing yet.

## [1.0.0] - 2026-11-23

The first complete release: everything an AI app builder needs to check
before real people use what they've built.

### Checklists

Nine checklists, each opening with "If you only do three", and every item
linked to official documentation.

- [00 Before you start](checklists/00-before-you-start.md): Git, repositories,
  keeping development separate from production
- [01 Security](checklists/01-security.md): logins, permissions and Row Level
  Security, secret keys, user input
- [02 Data](checklists/02-data.md): database structure, migrations, backups,
  testing a restore
- [03 Infrastructure](checklists/03-infrastructure.md): hosting, domains and
  DNS, email that actually arrives
- [04 CI/CD](checklists/04-ci-cd.md): automatic checks and deploys, preview
  versus production
- [05 Monitoring](checklists/05-monitoring.md): logs, error tracking, uptime
  alerts
- [06 Costs](checklists/06-costs.md): spending caps, usage alerts,
  surprise-bill traps
- [07 Privacy](checklists/07-privacy.md): what personal data you collect,
  privacy policy basics
- [08 Governance](checklists/08-governance.md): account ownership, access,
  branch protection, offboarding, incidents

### Guides

- [Auth by app type](guides/auth-by-app-type.md): how login works for
  websites, mobile apps, B2B SaaS, marketplaces, internal tools, APIs, AI
  agents and browser extensions
- [Database design](guides/database-design.md): tables, relationships and
  keys, and how they shape your permissions

### Claude Code skills

Installable as one plugin. Every skill checks and explains, and never changes
anything without asking.

- `ready-to-deploy`: runs every audit and checklist, then gives one go-live
  verdict and your top five next steps
- `repo-protection-check`: audits GitHub branch protection and security
  settings, and offers to fix the gaps
- `supabase-rls-check`: audits Supabase Row Level Security, policies, grants
  and views
- `auth-check`: audits Supabase Auth settings and sign-in code
- `secrets-scan`: finds leaked keys and passwords in code, `.env` files,
  workflows and Git history, without printing them
- `cost-trap-check`: finds ways an app could run up a surprise bill

### Practice examples

Deliberately broken projects to try the skills on safely, each with the
report you should expect: [broken RLS](examples/supabase-broken-rls/),
[auth misconfiguration](examples/supabase-auth-misconfig/),
[leaky secrets](examples/leaky-secrets/), [cost traps](examples/cost-traps/),
plus a [sample go-live report](examples/ready-to-deploy/SAMPLE-GO-LIVE-REPORT.md).

### Also included

- A [glossary](glossary.md) of every technical term used
- An importable [ruleset to protect `main`](examples/github-rulesets/) and a
  commented [starter CI workflow](examples/github-actions/)
- This repo's own checks: Markdown style, link checking and plugin validation

[Unreleased]: https://github.com/farqhar/builder-shopping-list/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/farqhar/builder-shopping-list/releases/tag/v1.0.0
