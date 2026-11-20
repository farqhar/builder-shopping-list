# Skills

Skills are instruction files that teach [Claude Code](https://code.claude.com/docs/en/overview)
how to do a specific job, like auditing your repo's settings. Every skill in
this folder **checks and explains** things, then *offers* fixes. None of them
changes your project without asking you first.

| Skill | What it does |
| --- | --- |
| [`repo-protection-check`](repo-protection-check/SKILL.md) | Checks your GitHub repo's protection and security settings, explains each one in plain English, and offers to fix the gaps |
| [`supabase-rls-check`](supabase-rls-check/SKILL.md) | Checks your Supabase database permissions (Row Level Security, policies, grants, views) and whether your secret key is exposed in browser code. Try it on the [broken example](../examples/supabase-broken-rls/) first |
| [`auth-check`](auth-check/SKILL.md) | Checks how your app signs people in: Supabase Auth settings, how server code checks the user, where roles come from, and unsafe sign-in flows in web, mobile and extension code. Try it on the [misconfigured example](../examples/supabase-auth-misconfig/) first |
| [`ready-to-deploy`](ready-to-deploy/SKILL.md) | **Start here.** Runs the five audits below where they apply, walks your project through all nine checklists, and gives one go-live verdict with your top five next steps. Can save a `GO-LIVE-REPORT.md` to track progress. See a [sample report](../examples/ready-to-deploy/SAMPLE-GO-LIVE-REPORT.md) |
| [`secrets-scan`](secrets-scan/SKILL.md) | Looks for leaked API keys, tokens and passwords in your code, `.env` files, browser variables, workflows and Git history, without ever printing them. Try it on the [leaky example](../examples/leaky-secrets/) first |
| [`cost-trap-check`](cost-trap-check/SKILL.md) | Looks for ways your app could run up a surprise bill: paid AI, SMS or email calls with no limits, unbounded uploads and queries, and scheduled jobs. Try it on the [cost traps example](../examples/cost-traps/) first |

## Install

You need Claude Code. In a Claude Code session, run:

```text
/plugin install builder-shopping-list --marketplace farqhar/builder-shopping-list
```

That adds this repo as a **marketplace** (a catalog of plugins) and installs
its plugin, which contains every skill in this folder. The one-step form
needs Claude Code 2.1.275 or later. On older versions, run these two commands
instead:

```text
/plugin marketplace add farqhar/builder-shopping-list
/plugin install builder-shopping-list@builder-shopping-list
```

Source: [Claude Code: Discover and install plugins](https://code.claude.com/docs/en/discover-plugins)

## Use a skill

Ask Claude in plain English, for example *"is my repo protected?"*, and it
picks the right skill. Or run one directly by name:

```text
/builder-shopping-list:repo-protection-check
```

The `builder-shopping-list:` prefix is the plugin's name. Claude Code adds it
to every plugin skill.

### What `supabase-rls-check` needs

Your project's migration files (`supabase/migrations/`). No migration
files, for example because you built with Lovable or Bolt? The skill gives
you a read-only query to paste into Supabase's SQL Editor instead. It never
changes your database itself.

### What `auth-check` needs

Your project's code, plus `supabase/config.toml` if you have one. Without
it, the skill asks you to read a few settings from your Supabase dashboard.
It asks what kind of app you're building, because an internal tool and a
public app need different settings.

### What `ready-to-deploy` needs

Everything the other five skills need, where they apply. It skips any audit
your project doesn't need, and asks you about the things it can't see, such
as billing and dashboard settings, in one batch per checklist. Allow time:
it's a full review, not a quick check.

### What `secrets-scan` needs

Your project folder. It works best inside a Git repository, because it also
checks which files are committed and searches your Git history. It never
shows a secret's full value.

### What `cost-trap-check` needs

Your project's code, plus `supabase/config.toml` if you have one. It can't
see your billing dashboards, so it asks whether you have spend caps and
budget alerts.

### What `repo-protection-check` needs

- The [GitHub CLI](https://cli.github.com), logged in with `gh auth login`.
- Admin access to the repo, to see every setting. Without it, some checks
  show as "can't check" instead of guessing.

## Get updates

New skills and fixes arrive when you update the marketplace:

```text
/plugin marketplace update builder-shopping-list
```

Or turn on auto-update: run `/plugin`, open **Marketplaces**, select
`builder-shopping-list`, and switch auto-update on.

Source: [Claude Code: Host and maintain a marketplace](https://code.claude.com/docs/en/plugins/host-marketplace)

## Without the plugin system

You can also copy a skill folder (for example `repo-protection-check/`) into
`~/.claude/skills/`. That makes it available in all your projects, but you
won't get updates.

Source: [Claude Code: Skills](https://code.claude.com/docs/en/skills)
