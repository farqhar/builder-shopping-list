# Governance

**Last verified:** 2026-11-20

**Who this is for:** Anyone whose app depends on accounts (code host, database, hosting, domain, email, payments), which is everyone, and especially anyone who's ever let a freelancer or friend in.
**When to do it:** Before launch, every time someone joins or leaves, and straight away after any security scare.

Security is about keeping attackers out. **Governance** is about the people
side: who owns your accounts, who can get in, what happens when someone
leaves, and what you do when something goes wrong. It's the difference
between "we got hacked" and "we lost access to our own app".

## If you only do three

1. **[Have more than one owner](#have-more-than-one-owner-on-every-critical-account).** One person locked out shouldn't mean everyone is.
2. **[Remove access the day someone leaves](#remove-access-the-day-someone-leaves).** Ex-team members and old freelancers are a common way in.
3. **[Write a one-page incident plan](#write-a-one-page-incident-plan).** Decide what to do *before* something goes wrong.

## Track your progress

Copy this list into a GitHub issue in your own repo to get boxes you can tick.

```markdown
- [ ] Every critical account has at least two owners
- [ ] My domain auto-renews, has MFA, and its contact email is on a different domain
- [ ] Everyone has the lowest role that lets them do their job
- [ ] MFA is on, and enforced where possible, for every admin account
- [ ] I remove access the day someone leaves, including deploy keys
- [ ] I revoke or rotate secrets that a departed person could see
- [ ] main is protected, and changes need a pull request
- [ ] CODEOWNERS asks the right person to review changes
- [ ] I know where my audit logs are
- [ ] I have a one-page incident plan
- [ ] People can report security problems privately
```

## Ownership

### Have more than one owner on every critical account

- **What:** Give at least two trusted people the **owner** role on your code host, database host and other critical accounts.
- **Why it matters:** GitHub warns that if an organisation has only one owner, its projects "can become inaccessible if the owner is unreachable", and recommends "at least two people" with the owner role. Supabase's production checklist says the same about its organisations.
- **How to check:** List every service your app depends on (code, database, hosting, domain, email, payments). For each one, open its team or members page and count the owners.
- **Learn more:** [GitHub: Maintaining ownership continuity](https://docs.github.com/en/organizations/managing-peoples-access-to-your-organization-with-roles/maintaining-ownership-continuity-for-your-organization) · [Supabase: Production security checklist](https://supabase.com/docs/guides/security/production-checklist)

### Protect your domain name

- **What:** Your domain lives in an account at a **[domain registrar](../glossary.md#domain-registrar)** (the company you bought it from). Turn on auto-renew and multi-factor authentication there, and use domain locks if your registrar offers them. Make sure the account's contact email is **not** on the same domain.
- **Why it matters:** ICANN's security committee warns that if a registration lapses, "a different party may register the domain name". If the registrar account is taken over, an attacker can change where your domain points and block your email. A contact email on the same domain means you can't receive the recovery emails at exactly the moment you need them.
- **How to check:** Log in to your registrar. Confirm the expiry date, auto-renew, MFA and any lock settings, and that the contact email is on a different domain from the one it manages.
- **Learn more:** [ICANN SSAC: A Registrant's Guide to Protecting Domain Name Registration Accounts (SAC 044)](https://itp.cdn.icann.org/en/files/security-and-stability-advisory-committee-ssac-reports/sac-044-en.pdf)

## Access

### Give each person the lowest role that works

- **What:** Follow **[least privilege](../glossary.md#least-privilege)**: give each person only the access their job needs, not "admin, just in case".
- **Why it matters:** Every extra admin is another account an attacker can use, and another person who can delete something by mistake. Both GitHub and Supabase offer roles below admin for this reason.
- **How to check:** On GitHub, check each person's repository role (Read, Triage, Write, Maintain or Admin). GitHub describes who each one is "recommended for". On Supabase, check member roles (Owner, Administrator, Developer, Read-only).
- **Learn more:** [GitHub: Repository roles](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization) · [Supabase: Access control](https://supabase.com/docs/guides/platform/access-control)

### Turn on MFA for every admin, and enforce it where you can

- **What:** Everyone with admin access uses **[multi-factor authentication](../glossary.md#multi-factor-authentication-mfa)**. If your plan allows it, *require* it for the whole organisation.
- **Why it matters:** One stolen password on an admin account can undo every other safeguard. On Pro plans and above, Supabase can enforce MFA for every organisation member.
- **How to check:** See the MFA item in the [security checklist](01-security.md#turn-on-mfa-for-your-own-accounts). Then check whether your organisation settings can *enforce* it.
- **Learn more:** [Supabase: Production security checklist](https://supabase.com/docs/guides/security/production-checklist)

### Remove access the day someone leaves

- **What:** When a team member, freelancer or agency finishes, remove them from every account on their last day. This is called **[offboarding](../glossary.md#offboarding)**.
- **Why it matters:** The CIS Controls, a widely used security framework, include managing *and revoking* access as a core control. Watch for leftovers that removal misses. GitHub warns that anyone holding a repository's **[deploy key](../glossary.md#deploy-key)** can still read or write the repo "even if they're later removed from the organization".
- **How to check:** Go through the same list of services from the first item and remove the person from each one. On GitHub, also check the repository's deploy keys under Settings, and delete any you can't explain.
- **Learn more:** [CIS Controls list](https://www.cisecurity.org/controls/cis-controls-list) · [GitHub: Repository roles (deploy key warning)](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization)

### Revoke or rotate secrets they could see

- **What:** If someone who's leaving could see API keys, database passwords or tokens, revoke or **[rotate](../glossary.md#rotate-a-key)** those secrets.
- **Why it matters:** Removing someone's account doesn't change the keys they copied. OWASP: when secrets "are no longer required or potentially compromised, you must securely revoke them".
- **How to check:** Look through your `.env.example` and your host's environment settings. For each secret, ask "could they have seen this?", and rotate the ones where the answer is yes.
- **Learn more:** [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

## Change control

### Protect your main branch

- **What:** Require every change to `main` to go through a pull request with passing checks, and block force pushes and deletion.
- **Why it matters:** One bad push, by anyone (including you, tired, at midnight), shouldn't be able to break or erase your app.
- **How to check:** Import the ready-made ruleset in [`examples/github-rulesets/`](../examples/github-rulesets/README.md), or run the [`repo-protection-check`](../skills/repo-protection-check/SKILL.md) skill to audit your settings.
- **Learn more:** [GitHub: About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)

### Make sure the right person reviews changes

- **What:** Add a `CODEOWNERS` file, so GitHub automatically asks the owner of each part of the code to review changes to it.
- **Why it matters:** Reviews only protect you if the right person actually sees the change.
- **How to check:** Your repo has `.github/CODEOWNERS`. This repo's own [CODEOWNERS](../.github/CODEOWNERS) is a one-line example.
- **Learn more:** [GitHub: About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

## Records

### Know where your audit logs are

- **What:** An **[audit log](../glossary.md#audit-log)** records who did what and when. Find the logs for your key services before you need them.
- **Why it matters:** After a scare, the first question is "what happened?" GitHub's security log covers the last 90 days of your account's activity. Supabase's platform audit logs (Team and Enterprise plans) record what organisation members did in the dashboard and API, and its Auth audit logs record sign-in activity.
- **How to check:** Open GitHub's security log (Settings, then Security log) and your Supabase organisation's audit page, so you know where they are.
- **Learn more:** [GitHub: Reviewing your security log](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/reviewing-your-security-log) · [Supabase: Platform audit logs](https://supabase.com/docs/guides/security/platform-audit-logs)

## When things go wrong

### Write a one-page incident plan

- **What:** A short document saying what to do in an **[incident](../glossary.md#incident)** (a leaked key, a hacked account, lost data): who to contact, where to rotate each key, how to restore from backup, and who tells your users.
- **Why it matters:** The UK's National Cyber Security Centre: "Incidents can and will happen, so it's important to be prepared for them." Decisions made calmly in advance beat decisions made in a panic.
- **How to check:** You can answer, in writing, "if our database key leaked right now, what are the first three things we'd do?" Link it to your [backup restore steps](02-data.md#test-a-restore-before-you-need-one).
- **Learn more:** [NCSC: Incident management](https://www.ncsc.gov.uk/collection/incident-management) · [NIST SP 800-61r3: Incident response recommendations](https://csrc.nist.gov/pubs/sp/800/61/r3/final)

### Give people a private way to report security problems

- **What:** Add a **[security policy](../glossary.md#security-policy)** (a `SECURITY.md` file) and turn on GitHub's private vulnerability reporting.
- **Why it matters:** If someone finds a hole in your app, you want them to tell you privately, not in a public issue. With private vulnerability reporting on, researchers get a "Report a vulnerability" button and can report "without resorting to public disclosure".
- **How to check:** Your repo has a `SECURITY.md`, and Settings, then Advanced Security, shows private vulnerability reporting as enabled. This repo's own [SECURITY.md](../SECURITY.md) is an example.
- **Learn more:** [GitHub: Adding a security policy](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/configure-vulnerability-reporting/add-security-policy) · [GitHub: Private vulnerability reporting](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/configure-vulnerability-reporting/configure-for-a-repository)

## Further reading

- [NCSC: Small organisations guide to cyber security](https://www.ncsc.gov.uk/collection/small-organisations-guide-to-cyber-security)
- [CIS Controls list](https://www.cisecurity.org/controls/cis-controls-list)
- [Supabase: Production security checklist](https://supabase.com/docs/guides/security/production-checklist)
- [GitHub: Maintaining ownership continuity](https://docs.github.com/en/organizations/managing-peoples-access-to-your-organization-with-roles/maintaining-ownership-continuity-for-your-organization)
