# Security

**Last verified:** 2026-11-19

**Who this is for:** Anyone whose app has logins, a database, or API keys. That's almost every app.
**When to do it:** Before real users sign up. Come back each time you add a table, a login method or a new service.

## If you only do three

1. **[Keep secret keys out of your code and out of Git](#keep-secret-keys-out-of-your-code).** A leaked key is a stranger with your password.
2. **[Turn on Row Level Security for every table](#turn-on-row-level-security-for-every-table).** Without it, anyone with your public key can read and change your data.
3. **[Never give the browser a secret key](#never-give-the-browser-a-secret-key).** Anything the browser receives, any visitor can read.

## Track your progress

Copy this list into a GitHub issue in your own repo to get boxes you can tick.

```markdown
- [ ] Secret keys are in environment variables, and .env is in .gitignore
- [ ] I know where to rotate every key if it leaks
- [ ] I know which of my keys are public and which are secret
- [ ] No secret key is exposed to the browser
- [ ] Row Level Security is on for every table
- [ ] Every `using (true)` policy is on data that's meant to be public
- [ ] Views don't leak rows that RLS protects
- [ ] Security Advisor shows no errors
- [ ] Logins use a ready-made auth system
- [ ] Email confirmation is on
- [ ] Password reset is safe
- [ ] MFA is on for my GitHub, hosting and database accounts
- [ ] Input is validated on the server, not only in the browser
- [ ] Database queries use parameters, never glued-together text
- [ ] Dependabot alerts and security updates are on
- [ ] Secret scanning is on
- [ ] Push protection is on
```

## Secrets

A **[secret](../glossary.md#secret)** is anything that grants access: an
**[API key](../glossary.md#api-key)**, a database password, a token.

### Keep secret keys out of your code

- **What:** Store secrets in **[environment variables](../glossary.md#environment-variable)** (usually a `.env` file locally, and your host's settings in production), and list `.env` in your **[`.gitignore`](../glossary.md#gitignore)** so Git never uploads it.
- **Why it matters:** Once a secret is in your Git history, anyone who can see the repo can find it, even after you delete the line.
- **How to check:** Run `git ls-files | grep -i env`. It should list only `.env.example` (placeholder values like `sk_live_REPLACE_ME`), never `.env`. Note that `.gitignore` doesn't affect files Git already tracks: those need `git rm --cached .env`.
- **Learn more:** [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) · [Git: gitignore](https://git-scm.com/docs/gitignore) · The [`secrets-scan`](../skills/secrets-scan/SKILL.md) skill checks this for you

### If a key leaks, rotate it first

- **What:** If a secret ends up somewhere public, **[rotate](../glossary.md#rotate-a-key)** it (make a new one and switch off the old one) before you do anything else.
- **Why it matters:** Deleting the file or rewriting Git history doesn't help if someone already copied the key. GitHub's own guidance is to revoke or rotate it as the first step.
- **How to check:** For each variable in your `.env.example`, write down which dashboard issues it, so you know exactly where to go in an emergency.
- **Learn more:** [GitHub: Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

## Keys: public and secret

### Know which of your keys are public and which are secret

- **What:** Many services give you two kinds of key. A **[publishable key](../glossary.md#publishable-key)** is meant to be seen and can only do what your permission rules allow. A **[secret key](../glossary.md#secret-key)** skips those rules and must stay on a server you control.
- **Why it matters:** Mixing them up either breaks your app or hands a visitor full control of your data.
- **How to check:** List every key your app uses and label it public or secret. In Supabase, the publishable key (`sb_publishable_...`, or the older `anon` key) is public. The secret key (`sb_secret_...`, or the older `service_role` key) bypasses Row Level Security. Supabase is retiring the older `anon` and `service_role` keys by the end of 2026.
- **Learn more:** [Supabase: Understanding API keys](https://supabase.com/docs/guides/getting-started/api-keys)

### Never give the browser a secret key

- **What:** Code that runs in the browser (the **[frontend](../glossary.md#frontend-and-backend)**) is downloaded by every visitor, so a secret key must only be used in **[backend](../glossary.md#frontend-and-backend)** code: a server, an API route, or an edge function.
- **Why it matters:** Build tools copy some environment variables straight into the browser code. Vite does this for anything starting `VITE_`, and Next.js for anything starting `NEXT_PUBLIC_`. A secret key under those names is public.
- **How to check:** Search your code and `.env` for secret key names with a `VITE_`, `NEXT_PUBLIC_` (or similar) prefix. Then open your live site, open the browser's developer tools, and search the loaded JavaScript for `sb_secret_` or `service_role`. Neither search should find anything.
- **Learn more:** [Vite: Env variables](https://vite.dev/guide/env-and-mode) · [Next.js: Environment variables](https://nextjs.org/docs/app/guides/environment-variables)

## Database permissions

Broken access control (people seeing or changing data they shouldn't) is
number one on the [OWASP Top 10:2025](https://top10.owasp.org/2025/A01_2025-Broken_Access_Control/)
list of web app security risks. For AI-built apps, the usual cause is a
database table with no permission rules.

### Turn on Row Level Security for every table

- **What:** **[Row Level Security (RLS)](../glossary.md#row-level-security-rls)** is a database feature that checks every request against rules you write, called **[policies](../glossary.md#policy)**, for example "people can only see their own orders".
- **Why it matters:** Supabase's docs say a table in an **[exposed schema](../glossary.md#exposed-schema)** without RLS is readable and writable by any role with access to it. Since the publishable key is public, that can mean anyone.
- **How to check:** In the Supabase SQL editor, run `select tablename, rowsecurity from pg_tables where schemaname = 'public';`. Every row should say `true`. Check any other schema you've exposed too.
- **Learn more:** [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

### Treat `using (true)` as "this is public"

- **What:** A policy containing `using (true)` lets every user it applies to see every row. That's fine for genuinely public data, like a list of blog posts.
- **Why it matters:** AI tools sometimes write `using (true)` to make an error go away, which quietly makes a private table public.
- **How to check:** Search your SQL or migrations for `true)`. For each match, ask whether you'd be happy for a stranger to see or change every row in that table.
- **Learn more:** [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

### Check that views don't leak protected rows

- **What:** A **[view](../glossary.md#view)** is a saved query that behaves like a table. In Postgres, views skip RLS by default.
- **Why it matters:** A view over a protected `orders` table can hand out every row your policies were meant to hide.
- **How to check:** List your views (`select table_name from information_schema.views where table_schema = 'public';`). For each one, follow Supabase's guidance on exposing a view safely.
- **Learn more:** [Supabase: Views and RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)

### Run the Security Advisor before you launch

- **What:** Supabase's Security Advisor scans your database for common problems, including tables with RLS switched off and policies that exist while RLS is off.
- **Why it matters:** It catches the mistakes above automatically, including ones you didn't know to look for.
- **How to check:** Open your project dashboard, go to Advisors, then Security Advisor. Fix every error before launch.
- **Learn more:** [Supabase: Advisors](https://supabase.com/docs/guides/observability/advisors) · [Supabase: Production security checklist](https://supabase.com/docs/guides/security/production-checklist)

## Logins

**[Authentication](../glossary.md#authentication)** is how your app checks
who someone is.

### Use a ready-made login system

- **What:** Use your platform's built-in auth (Supabase Auth, for example) or a dedicated auth provider, rather than writing your own sign-up, password storage and reset code.
- **Why it matters:** Passwords must be stored with slow, salted **[hashing](../glossary.md#hashing)**, and reset flows are a common source of vulnerabilities. OWASP points out that most modern frameworks already provide this built in.
- **How to check:** Your app should never store a raw password in a table you created. Passwords should only exist inside the auth system.
- **Learn more:** [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) · [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) · [Guide: Auth by app type](../guides/auth-by-app-type.md)

### Require people to confirm their email

- **What:** Make new users click a link in an email before their account works.
- **Why it matters:** Without it, anyone can sign up with someone else's email address.
- **How to check:** In Supabase, go to Authentication, then Sign In / Providers, and make sure email confirmation is enabled. Then sign up with a test address and confirm you can't log in until you've clicked the link.
- **Learn more:** [Supabase: Production security checklist](https://supabase.com/docs/guides/security/production-checklist)

### Make password reset safe

- **What:** The "forgot password" screen should show the same message whether or not the email has an account, and reset links should work once and expire quickly.
- **Why it matters:** Different messages let attackers work out who has an account (**[user enumeration](../glossary.md#user-enumeration)**). Long-lived links can be reused if they leak.
- **How to check:** Request a reset for a real account and a made-up one. The messages should match. In Supabase, the email link expiry should be 3600 seconds (1 hour) or less.
- **Learn more:** [OWASP Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html) · [Supabase: Production security checklist](https://supabase.com/docs/guides/security/production-checklist)

### Turn on MFA for your own accounts

- **What:** Turn on **[multi-factor authentication (MFA)](../glossary.md#multi-factor-authentication-mfa)** for every account that controls your app: GitHub, your host, your database, your domain registrar.
- **Why it matters:** OWASP calls MFA "by far the best defense" against most password attacks. If someone gets into your GitHub or Supabase account, every other safeguard is bypassed.
- **How to check:** Visit each account's security settings and confirm MFA is on.
- **Learn more:** [OWASP Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) · [GitHub: Configuring 2FA](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication)

## User input

### Validate on the server, not only in the browser

- **What:** **[Validation](../glossary.md#validation)** in the browser (like a red "invalid email" message) is for convenience. Check the same rules again on the server or in the database.
- **Why it matters:** Anyone can skip your frontend and send requests straight to your API. OWASP describes client-side validation as bypassable.
- **How to check:** For each form, find where the data is saved and confirm there's a server-side or database check, such as a database constraint, an RLS policy, or validation in your API route.
- **Learn more:** [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

### Never build database queries by gluing text together

- **What:** If your code writes SQL itself, pass user input as **[parameters](../glossary.md#parameterized-query)**, not by pasting it into the query text.
- **Why it matters:** Pasted-in text can rewrite the query. That's **[SQL injection](../glossary.md#sql-injection)**, one of the oldest and most damaging attacks.
- **How to check:** Search for SQL built with `+` or template strings like `` `...${userInput}...` ``. Client libraries such as `supabase-js` use parameters for you, so look most closely at any raw SQL in your backend.
- **Learn more:** [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

## Dependencies

Your app is built on other people's packages, called
**[dependencies](../glossary.md#dependency)**. Software supply chain failures
are number three on the [OWASP Top 10:2025](https://top10.owasp.org/2025/).

### Turn on Dependabot alerts and security updates

- **What:** **[Dependabot](../glossary.md#dependabot)** is a free GitHub tool that warns you when a package you use has a known security hole, and can open a pull request to fix it.
- **Why it matters:** Vulnerabilities are discovered in popular packages all the time. Without alerts, you won't know.
- **How to check:** In your repo, go to Settings, then Advanced Security (in the "Security and quality" part of the sidebar), and make sure Dependabot alerts and Dependabot security updates are on.
- **Learn more:** [GitHub: Configuring Dependabot alerts](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configure-dependabot-alerts) · [GitHub: Dependabot security updates](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-security-updates)

## GitHub protections

### Turn on secret scanning

- **What:** **[Secret scanning](../glossary.md#secret-scanning)** searches your repo's entire history, plus issues and pull requests, for keys and passwords, and alerts you.
- **Why it matters:** It catches the leaks you didn't notice, including old ones buried in history.
- **How to check:** On public repositories, GitHub turns secret scanning on by default. Check for alerts on your repo's Security tab. For private repos, it may need a paid plan.
- **Learn more:** [GitHub: Secret scanning](https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning) · [GitHub security features](https://docs.github.com/en/code-security/getting-started/github-security-features)

### Turn on push protection

- **What:** **[Push protection](../glossary.md#push-protection)** blocks a **[push](../glossary.md#push)** that contains a recognised secret, before it reaches GitHub.
- **Why it matters:** Preventing a leak is far easier than cleaning one up. For public repos, GitHub turns on push protection for your personal account by default.
- **How to check:** In your repo, go to Settings, then Advanced Security, and make sure Push protection is enabled under "Secret Protection".
- **Learn more:** [GitHub: Push protection](https://docs.github.com/en/code-security/concepts/secret-security/push-protection) · [GitHub: Enabling push protection](https://docs.github.com/en/code-security/how-tos/secure-your-secrets/prevent-future-leaks/enable-push-protection)

## Further reading

- [OWASP Top 10:2025](https://top10.owasp.org/2025/): the most critical web app security risks
- [Supabase: Production security checklist](https://supabase.com/docs/guides/security/production-checklist)
- [GitHub security features](https://docs.github.com/en/code-security/getting-started/github-security-features)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/): short, practical guides on specific topics
