# Skills

Skills are instruction files that teach [Claude Code](https://code.claude.com/docs/en/overview)
how to do a specific job, like auditing your repo's settings. Every skill in
this folder **checks and explains** things, then *offers* fixes. None of them
changes your project without asking you first.

| Skill | What it does |
| --- | --- |
| [`repo-protection-check`](repo-protection-check/SKILL.md) | Checks your GitHub repo's protection and security settings, explains each one in plain English, and offers to fix the gaps |

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
