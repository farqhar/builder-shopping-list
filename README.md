# Builder Shopping List

<!-- HEADER IMAGE / GIF PLACEHOLDER
Replace this comment with the header artwork, for example:
<p align="center"><img src="assets/header.gif" alt="Describe the image here" width="800"></p>
-->

**You can build an app in a weekend now. Going live safely takes a shopping list.**

Everything AI app builders need before going live: checklists and Claude
skills for security, data, infrastructure and CI/CD.

Tools like Lovable, Bolt and Claude Code let you ship an app without ever
learning the foundations underneath it. This repo is the list of what needs to
be in your cart before real people use what you've built. It's written in plain
English by a non-engineer who learned most of it the hard way.

## Who this is for

- **Founders and makers** building a real product with AI tools, who want to
  know what they're missing before launch.
- **Designers, ops people and other non-engineers** who can follow
  instructions and use a terminal a little, but have never been told what an
  environment variable, a migration or a CI pipeline is.
- **Students and career-changers** who want the "why", not just the "click
  here".

## How to use this

1. **Read the checklists in number order.** Each one opens with "If you only do
   three", so you can get the most important things done first and come back
   for the rest. Every item links to official documentation, so you don't have
   to take my word for it.
2. **Track your progress.** Each checklist has a "Track your progress" list.
   Paste it into an issue in your own GitHub repo to get boxes you can tick.
3. **Use the skills in Claude Code.** Skills are instruction files that let
   Claude audit your project for you and explain what it finds in plain
   English. They check and explain, and never change your project without
   asking. Install them all with one command in a Claude Code session:

   ```text
   /plugin install builder-shopping-list --marketplace farqhar/builder-shopping-list
   ```

   More options and usage are in [`skills/README.md`](skills/README.md).

Don't recognise a word? Look it up in the [glossary](glossary.md).

## The shopping list at a glance

| Checklist | What it covers | Status |
| --- | --- | --- |
| [00 Before you start](checklists/00-before-you-start.md) | Git, repositories, keeping development separate from production | ✅ Ready |
| [01 Security](checklists/01-security.md) | Logins, permissions and Row Level Security, secret keys, user input | ✅ Ready |
| [02 Data](checklists/02-data.md) | Database structure, migrations, backups, testing a restore | ✅ Ready |
| [03 Infrastructure](checklists/03-infrastructure.md) | Hosting, domains and DNS, email that actually arrives | 🚧 In progress |
| [04 CI/CD](checklists/04-ci-cd.md) | Automatic checks and deploys, preview versus production | 🚧 In progress |
| [05 Monitoring](checklists/05-monitoring.md) | Logs, error tracking, uptime alerts | 🚧 In progress |
| [06 Costs](checklists/06-costs.md) | Spending caps, usage alerts, surprise-bill traps | 🚧 In progress |
| [07 Privacy](checklists/07-privacy.md) | What personal data you collect, privacy policy basics | 🚧 In progress |
| [08 Governance](checklists/08-governance.md) | Account ownership, access, branch protection, offboarding, incidents | ✅ Ready |

| Guide | What it explains | Status |
| --- | --- | --- |
| [Auth by app type](guides/auth-by-app-type.md) | How login works for websites, mobile apps, B2B SaaS, marketplaces, internal tools, APIs, AI agents and browser extensions | ✅ Ready |
| [Database design](guides/database-design.md) | Tables, relationships and keys, and how they shape your permissions | ✅ Ready |

| Skill | What it does | Status |
| --- | --- | --- |
| `supabase-rls-check` | Audits your Supabase database permissions and explains what to fix | ✅ Ready |
| `repo-protection-check` | Audits your GitHub repo's branch protection and security settings, and offers to fix them | ✅ Ready |
| `auth-check` | Audits your sign-in settings and code (Supabase Auth) and explains what to fix | ✅ Ready |

## This repo practises what it preaches

The checklists tell you to automate your checks, keep secrets out of Git, and
protect your main branch. This repo does the same, so you can see each one
working:

- [`.github/workflows/`](.github/workflows/) has two automatic checks: one for
  Markdown style, and one that makes sure every source link still works. Every
  line is commented.
- [`.gitignore`](.gitignore) keeps `.env` files (where secret keys live) out
  of Git.
- [`.github/dependabot.yml`](.github/dependabot.yml) keeps the tools those
  checks depend on up to date.
- `main` is protected by the ruleset in
  [`examples/github-rulesets/`](examples/github-rulesets/), so every change,
  including the maintainer's, goes through a pull request.

## About me

I'm Farquhar, a designer and AI programme lead, not a software engineer. My job
is being the bridge between technical and non-technical people. These are field
notes from someone a few steps ahead of you, not an expert's rulebook. That's
why every item links to the people who actually wrote the rules.

More of my work: [AI for Operators](https://github.com/farqhar/ai-for-operators) ·
[LinkedIn](https://www.linkedin.com/in/REPLACE_ME)

## Community

Questions, ideas, and "I launched!" posts live in
[Discussions](https://github.com/farqhar/builder-shopping-list/discussions).
No question is too basic, as long as you leave your real keys out of it.

## Contributing

Found a gap, a mistake or a broken link? Contributions are welcome, as long as
every claim comes with an authoritative source. Start with
[CONTRIBUTING.md](CONTRIBUTING.md), and please follow the
[Code of Conduct](CODE_OF_CONDUCT.md).

## Licence

This repo uses two licences, because it contains two kinds of thing:

| What | Licence | In plain English |
| --- | --- | --- |
| Code and skills (`skills/`, `examples/`, workflow files) | [MIT](LICENSE) | Use it, change it, sell it. Keep the copyright notice in copies of the code. |
| Writing (checklists, glossary, guides) | [CC BY 4.0](LICENSE-docs) | Share and adapt it for any purpose, including commercial use, as long as you credit the source. |

**How to credit the writing:** for example, _"Adapted from Builder Shopping
List by Farquhar (github.com/farqhar/builder-shopping-list), CC BY 4.0"_,
plus a note if you changed it. See the Creative Commons
[guide to attribution](https://wiki.creativecommons.org/wiki/Recommended_practices_for_attribution).

Why split them? MIT is written for software and doesn't fit prose well. CC BY
is written for creative and educational work, but Creative Commons
[recommends against using it for software](https://creativecommons.org/faq/).

## Disclaimer

This is a learning resource, not a professional security audit. Working through
these checklists will put you well ahead of most first launches, but it can't
guarantee your app is secure or compliant. If you handle payments, health data,
children's data or anything else sensitive, get a qualified professional to
review your setup before launch.
