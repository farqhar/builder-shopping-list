# CI/CD

**Last verified:** 2026-11-20

**Who this is for:** Anyone whose code is on GitHub and who wants mistakes caught automatically, before they reach users.
**When to do it:** As soon as your code is in a repo. A basic check takes ten minutes to set up and pays off on the first broken change it catches.

**[CI](../glossary.md#ci-continuous-integration)** (continuous integration)
means every change is automatically checked: built, linted and tested. GitHub
describes it as "a software practice that requires frequently committing code
to a shared repository", where committing often "detects errors sooner".
**[CD](../glossary.md#cd-continuous-deployment)** (continuous deployment)
means "using automation to publish and deploy software updates", where "the
code is automatically built and tested before deployment".
[GitHub: About continuous integration](https://docs.github.com/en/actions/get-started/continuous-integration)
· [GitHub: About continuous deployment](https://docs.github.com/en/actions/get-started/continuous-deployment)

**This repo is a worked example.** Its own workflows check every change, and
every line is commented:
[`lint.yml`](../.github/workflows/lint.yml) (Markdown style),
[`links.yml`](../.github/workflows/links.yml) (broken links) and
[`plugin.yml`](../.github/workflows/plugin.yml) (skill validation).

## If you only do three

1. **[Run checks on every pull request](#run-checks-on-every-pull-request).** Copy the [starter workflow](../examples/github-actions/README.md).
2. **[Don't let failing checks merge](#dont-let-failing-checks-merge).** A check you can ignore is a suggestion.
3. **[Keep secrets out of workflow files](#keep-secrets-in-github-secrets-not-in-workflow-files).** Use GitHub's encrypted secrets.

## Track your progress

Copy this list into a GitHub issue in your own repo to get boxes you can tick.

```markdown
- [ ] A workflow runs checks on every pull request
- [ ] Failing checks block merging into main
- [ ] Workflows only get the permissions they need
- [ ] Actions are locked to exact versions (lockfile or commit SHA)
- [ ] Untrusted text never goes straight into a run: script
- [ ] Secrets live in GitHub secrets, not in workflow files
- [ ] Dependabot keeps my actions up to date
- [ ] Preview deployments use test data, not production
- [ ] Database changes are deployed by a pipeline, not from my laptop
```

## Checks

### Run checks on every pull request

- **What:** Add a **[workflow](../glossary.md#workflow)**, a **[GitHub Actions](../glossary.md#github-actions)** file in `.github/workflows/`, that runs your project's build, lint and tests whenever a **[pull request](../glossary.md#pull-request)** is opened or updated.
- **Why it matters:** An AI tool can confidently break something in a file you didn't look at. An automatic check catches it while the change is still on its own branch.
- **How to check:** Your pull requests show a list of checks with green ticks or red crosses. To start, copy [`starter-ci.yml`](../examples/github-actions/starter-ci.yml), which is commented line by line.
- **Learn more:** [GitHub: About continuous integration](https://docs.github.com/en/actions/get-started/continuous-integration)

### Don't let failing checks merge

- **What:** Make your checks **[required status checks](../glossary.md#status-check)** on your main branch.
- **Why it matters:** GitHub: "If status checks are required for a protected branch, they must pass before the pull request can be merged." Without that, a red cross is only a warning.
- **How to check:** Import the ruleset in [`examples/github-rulesets/`](../examples/github-rulesets/README.md) with your own check names, or see the [governance checklist](08-governance.md#protect-your-main-branch). Only require checks that run on every pull request, or merging gets blocked forever.
- **Learn more:** [GitHub: Status checks](https://docs.github.com/en/pull-requests/reference/status-checks)

## Workflow safety

Workflows run code with access to your repository, so they need the same care
as the rest of your app.

### Give workflows only the permissions they need

- **What:** Add a `permissions:` block to every workflow. For checks, `contents: read` is usually enough.
- **Why it matters:** GitHub: "As a good security practice, you should always make sure that actions only have the minimum access they require by limiting the permissions granted to the `GITHUB_TOKEN`" (the key each workflow run gets automatically).
- **How to check:** Every file in `.github/workflows/` has a `permissions:` block. All three of this repo's workflows do.
- **Learn more:** [GitHub: Authenticate with GITHUB_TOKEN](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token)

### Lock actions to exact versions

- **What:** Actions referenced by a tag like `@v3` can change without you knowing. Lock them down instead. GitHub's first recommendation is a **workflow dependency lockfile** (`.github/workflows/actions.lock`, created with the `gh actions-lock` command), which also covers the actions *your* actions use. Where you can't use one, pin each action to a full-length commit **[SHA](../glossary.md#sha-pinning)**.
- **Why it matters:** GitHub: "Tags and branches can move… If an upstream maintainer's account is compromised and a tag is repointed, your repositories could run malicious code."
- **How to check:** Every `uses:` line ends in a 40-character SHA (like this repo's workflows), or your repo has an `actions.lock` file.
- **Learn more:** [GitHub: Workflow dependency lockfiles](https://docs.github.com/en/actions/concepts/security/workflow-dependency-lockfiles) · [GitHub: Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)

### Never paste untrusted text straight into a script

- **What:** Text that anyone can control, like a pull request title, branch name or issue comment, must not go directly into a `run:` command. Pass it in through an environment variable instead.
- **Why it matters:** Otherwise someone can craft a title that runs their own commands inside your workflow (a **[script injection](../glossary.md#script-injection)** attack). GitHub's preferred fix for inline scripts is "to set the value of the expression to an intermediate environment variable".
- **How to check:** Search your workflows for `${{ github.event.` inside `run:` blocks. Each one should move to an `env:` entry. See how [`links.yml`](../.github/workflows/links.yml) does it.
- **Learn more:** [GitHub: Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)

### Keep secrets in GitHub secrets, not in workflow files

- **What:** Store API keys and deploy tokens as GitHub Actions secrets (repository Settings, then Secrets and variables, then Actions), and refer to them as `${{ secrets.NAME }}`.
- **Why it matters:** GitHub: "Sensitive data should never be stored as plaintext in workflow files." Workflow files are part of your code, and anyone who can read the repo can read them.
- **How to check:** Search `.github/workflows/` for anything that looks like a key or password. There should be none.
- **Learn more:** [GitHub: Using secrets in GitHub Actions](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets) · [GitHub: Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)

### Let Dependabot keep your actions up to date

- **What:** Add a `.github/dependabot.yml` that watches the `github-actions` ecosystem, so you get pull requests when the actions you use release fixes.
- **Why it matters:** Pinned versions don't update themselves. Without this, security fixes in the actions you depend on never reach you.
- **How to check:** Your repo has a `dependabot.yml` like [this repo's](../.github/dependabot.yml).
- **Learn more:** [GitHub: Keeping your actions up to date with Dependabot](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/keeping-your-actions-up-to-date-with-dependabot)

## Deploys

### Point preview deployments at test data

- **What:** Hosts like Vercel and Netlify build a **[preview deployment](../glossary.md#preview-deployment)**, a live copy of your app with its own link, for every pull request. Give previews their own environment variables, pointing at a test database.
- **Why it matters:** Previews let you click through a change before it goes live. But Vercel's "Preview environment variables" are set separately from production ones, and if previews use production settings, your experiments touch real users' data.
- **How to check:** In your host's settings, the database URL and keys for the **Preview** environment are different from **Production**.
- **Learn more:** [Vercel: Environments](https://vercel.com/docs/deployments/environments) · [Netlify: Deploy Previews](https://docs.netlify.com/deploy/deploy-types/deploy-previews/)

### Deploy database changes from a pipeline, not your laptop

- **What:** Apply **[migrations](../glossary.md#migration)** to production automatically when changes merge, rather than running commands from your own computer.
- **Why it matters:** Supabase's environments guide: "In a production environment, we recommend using a CI/CD pipeline to deploy new migrations with GitHub Actions rather than deploying from your local machine."
- **How to check:** Your production database only changes after a pull request merges. See the [data checklist](02-data.md#change-your-tables-with-migrations).
- **Learn more:** [Supabase: Managing environments](https://supabase.com/docs/guides/deployment/managing-environments)

## Further reading

- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [GitHub: Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)
- [This repo's starter workflow](../examples/github-actions/README.md)
- [Supabase: Managing environments](https://supabase.com/docs/guides/deployment/managing-environments)
