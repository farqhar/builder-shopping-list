# Go-live report: my-app

> This is a **sample** of the file the
> [`ready-to-deploy`](../../skills/ready-to-deploy/SKILL.md) skill saves, for
> a made-up web app with sign-in, a Supabase database and one AI feature.
> Your own report will look like this, with your own results.

**Date:** 2026-11-20
**Verdict:** 🟡 **Ready, with known gaps.** No audit found anything urgent,
and the security basics are done, but 14 items are still open.

This is a learning tool, not a professional security audit.

## Scorecard

| Checklist | Done | Applies | Biggest gap |
| --- | --- | --- | --- |
| 00 Before you start | 9 | 9 | None |
| 01 Security | 17 | 17 | None |
| 02 Data | 9 | 11 | No restore tested yet |
| 03 Infrastructure | 6 | 8 | No HSTS or security headers |
| 04 CI/CD | 8 | 9 | Previews share the production database |
| 05 Monitoring | 6 | 9 | No outside uptime check |
| 06 Costs | 7 | 9 | AI feature has no per-user rate limit |
| 07 Privacy | 8 | 10 | No way to delete one person's data |
| 08 Governance | 8 | 10 | Only one owner on critical accounts |

## Top five next steps

1. **Add a per-user rate limit to the AI feature.** One account could
   otherwise run up the AI bill. See Costs: rate-limit anything that costs
   you per use, and the `cost-trap-check` finding C3.
2. **Set a budget alert on the hosting account.** It has no spend cap, and
   nothing would tell you if usage spiked. See Costs: set budget alerts.
3. **Add a second owner to GitHub, Supabase and the domain registrar.** If
   your one account is locked out, so is the business. See Governance: have
   more than one owner.
4. **Test a restore.** You know what backups you have, but not whether they
   work. See Data: test a restore before you need one.
5. **Write the one-page incident plan,** including who to tell about a
   breach and by when. See Governance and Privacy.

## What's going well

- No secrets in the code, `.env` files or Git history (`secrets-scan`: all
  🟢).
- Row Level Security is on for every table, with no public policies by
  mistake (`supabase-rls-check`: all 🟢).
- `main` is protected, and every change runs checks in a pull request.

## Checklists

### [00 Before you start](https://github.com/farqhar/builder-shopping-list/blob/main/checklists/00-before-you-start.md)

- [x] My code is in Git, with a copy on GitHub that I control
- [x] My repo is private, unless I've chosen to make it public
- [x] I have a .gitignore before my first commit
- [x] I make changes on a branch and merge them with a pull request
- [x] MFA is on for my GitHub account
- [x] I have a separate database for development
- [x] My development database uses made-up seed data
- [x] Settings and secrets live in environment variables, not code
- [x] I've listed every service my app depends on

### [01 Security](https://github.com/farqhar/builder-shopping-list/blob/main/checklists/01-security.md)

- [x] Secret keys are in environment variables, and .env is in .gitignore
- [x] I know where to rotate every key if it leaks
- [x] I know which of my keys are public and which are secret
- [x] No secret key is exposed to the browser
- [x] Row Level Security is on for every table
- [x] Every `using (true)` policy is on data that's meant to be public
- [x] Views don't leak rows that RLS protects
- [x] Security Advisor shows no errors
- [x] Logins use a ready-made auth system
- [x] Email confirmation is on
- [x] Password reset is safe
- [x] MFA is on for my GitHub, hosting and database accounts
- [x] Input is validated on the server, not only in the browser
- [x] Database queries use parameters, never glued-together text
- [x] Dependabot alerts and security updates are on
- [x] Secret scanning is on
- [x] Push protection is on

### [02 Data](https://github.com/farqhar/builder-shopping-list/blob/main/checklists/02-data.md)

- [x] Every table has a primary key
- [x] Relationships use foreign keys, and each one has an index
- [x] I've chosen what happens when linked rows are deleted
- [x] Dates use timestamptz, and money uses integer cents or numeric
- [x] Table changes go through migrations saved in Git
- [x] I test changes on a separate database before production
- [x] I know what backups my plan includes
- [x] I've decided whether I need point-in-time recovery
- [ ] Uploaded files are backed up separately
- [ ] I've tested a restore
- [x] I know that deleting a project deletes its backups

### [03 Infrastructure](https://github.com/farqhar/builder-shopping-list/blob/main/checklists/03-infrastructure.md)

- [x] My app is on my own domain, and I know where its DNS is managed
- [x] My domain registrar account is protected (see the governance checklist)
- [x] Every page is served over HTTPS
- [ ] HSTS is on, starting with a short max-age
- [ ] Basic security headers are set
- [x] App emails go through my own email provider (custom SMTP)
- [x] SPF and DKIM are set up for my sending domain
- [x] A DMARC policy is published, starting with p=none
- [ ] Marketing email has one-click unsubscribe and low spam rates (doesn't apply: no marketing email yet)

### [04 CI/CD](https://github.com/farqhar/builder-shopping-list/blob/main/checklists/04-ci-cd.md)

- [x] A workflow runs checks on every pull request
- [x] Failing checks block merging into main
- [x] Workflows only get the permissions they need
- [x] Actions are locked to exact versions (lockfile or commit SHA)
- [x] Untrusted text never goes straight into a run: script
- [x] Secrets live in GitHub secrets, not in workflow files
- [x] Dependabot keeps my actions up to date
- [ ] Preview deployments use test data, not production
- [x] Database changes are deployed by a pipeline, not from my laptop

### [05 Monitoring](https://github.com/farqhar/builder-shopping-list/blob/main/checklists/05-monitoring.md)

- [x] I know where each service's logs are, and how long they're kept
- [ ] My app logs sign-ins, failed sign-ins and permission failures
- [x] My logs never contain passwords, keys, tokens or personal data
- [x] Error tracking is on
- [ ] Error tracking scrubs sensitive data
- [ ] An outside check tells me if my app goes down
- [x] My alerts are few, and each one needs action
- [x] I'm notified when a deploy or CI run fails
- [x] I'm subscribed to my providers' status pages

### [06 Costs](https://github.com/farqhar/builder-shopping-list/blob/main/checklists/06-costs.md)

- [x] I know what each service charges for, and whose card pays
- [x] I know that every extra project or branch can cost money
- [x] Spend caps are on wherever they exist
- [x] My AI API accounts have monthly spend limits
- [ ] Budget alerts are set where caps don't exist
- [ ] Anything that costs per use (SMS, email, AI) is rate-limited
- [x] Uploads and list sizes have maximums
- [ ] Anonymous sign-ups are protected by a CAPTCHA (doesn't apply: anonymous sign-ins are off)
- [x] I'd rotate a leaked key immediately
- [x] Unused projects are backed up and deleted

### [07 Privacy](https://github.com/farqhar/builder-shopping-list/blob/main/checklists/07-privacy.md)

- [x] I've listed the personal data my app collects, where it's stored, and why
- [x] I only collect what I actually need, and delete what I no longer need
- [x] I know which privacy laws apply to me
- [x] My privacy notice says what I collect, why, how long I keep it, and who I share it with
- [x] Non-essential cookies and analytics wait for consent (where the law requires it)
- [x] I know which of my services are processors, and I've accepted their DPAs
- [x] My database region matches what I promise users
- [x] I know whether my AI provider trains on what my app sends it
- [ ] I can export and delete one person's data, including in other services
- [ ] I know when a breach must be reported, and to whom

### [08 Governance](https://github.com/farqhar/builder-shopping-list/blob/main/checklists/08-governance.md)

- [ ] Every critical account has at least two owners
- [x] My domain auto-renews, has MFA, and its contact email is on a different domain
- [x] Everyone has the lowest role that lets them do their job
- [x] MFA is on, and enforced where possible, for every admin account
- [x] I remove access the day someone leaves, including deploy keys
- [x] I revoke or rotate secrets that a departed person could see
- [x] main is protected, and changes need a pull request
- [ ] CODEOWNERS asks the right person to review changes (doesn't apply: solo builder, no other reviewers yet)
- [x] I know where my audit logs are
- [ ] I have a one-page incident plan
- [x] People can report security problems privately

## Audits

| Skill | Result |
| --- | --- |
| `secrets-scan` | 🟢 Nothing found |
| `repo-protection-check` | 🟢 All set, except CODEOWNERS (solo builder) |
| `supabase-rls-check` | 🟢 All tables protected |
| `auth-check` | 🟢 One 🟡: MFA available but not required for admins |
| `cost-trap-check` | 🟡 C3: AI feature has no per-user rate limit |
