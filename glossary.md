# Glossary

Plain-English definitions for every technical term used in this repo.
Checklists link here the first time they use a term.

Terms are listed A to Z. Each one has its own heading, so you can link
straight to it, for example `glossary.md#environment-variable`.

<!--
Format for each term:

### Term name

One or two plain-English sentences. Add an everyday comparison if it helps.
[Source](https://...)
-->

## A

### API key

A long string of characters that lets your app use another service, like a
password for software. Some API keys are meant to be public and some must stay
secret. See [publishable key](#publishable-key) and [secret key](#secret-key).
[Supabase: API keys](https://supabase.com/docs/guides/getting-started/api-keys)

### Audit log

A record of who did what, and when, in a system: sign-ins, setting changes, deleted projects. It's what you check after a security scare.
[GitHub: Reviewing your security log](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/reviewing-your-security-log)

### Authentication

How an app checks who someone is, usually with an email and password, a magic
link, or a social login. (Deciding what that person is *allowed* to do is a
separate job, handled by things like [policies](#policy).)
[OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

### Authorization

Deciding what a signed-in person (or program) is allowed to do, such as which rows they can read. It's separate from [authentication](#authentication), which only checks who they are.
[OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

## B

### Branch

A separate line of work in a Git repository. You make changes on a branch so the main version keeps working, then merge the branch back when it's ready.
[GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow)

### Budget alert

A notification (usually an email) when your spending passes an amount you set. It warns you, but on its own it doesn't stop the spending. Compare [spend cap](#spend-cap).
[Google Cloud: Budgets and budget alerts](https://docs.cloud.google.com/billing/docs/how-to/budgets)

## C

### CD (continuous deployment)

Automatically releasing your app after each change passes its checks, instead of deploying by hand.
[GitHub: About continuous deployment](https://docs.github.com/en/actions/get-started/continuous-deployment)

### CI (continuous integration)

Automatically checking every change (building, linting and testing it) as soon as it's pushed, so mistakes are caught early.
[GitHub: About continuous integration](https://docs.github.com/en/actions/get-started/continuous-integration)

### Constraint

A rule the database checks every time data is added or changed, such as "this can't be empty" (`not null`) or "quantity must be above zero" (`check`). It applies however the data arrives, which makes it stronger than a check in your app.
[Postgres: Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)

## D

### Deep link

A link that opens a specific screen inside a mobile app instead of a web page. Sign-in emails and social logins use deep links to bring people back into the app.
[Supabase: Native mobile deep linking](https://supabase.com/docs/guides/auth/native-mobile-deep-linking)

### Dependabot

A free GitHub tool that watches the packages your project uses. It warns you
when one has a known security problem, and can open a pull request to update
it. [GitHub: Dependabot alerts](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-alerts)

### Dependency

A package of someone else's code that your app relies on, for example a date
library installed with `npm install`. Your app inherits any bugs or security
holes in its dependencies.
[GitHub: Dependabot alerts](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-alerts)

### Deploy key

An access key attached to one GitHub repository, often used by servers to pull code. Whoever holds it keeps access even after they're removed from the organisation, so delete ones you can't explain.
[GitHub: Repository roles](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization)

### Domain registrar

The company you bought your domain name from, and where its settings live. Whoever controls that account controls where your website and email point.
[ICANN SSAC: SAC 044](https://itp.cdn.icann.org/en/files/security-and-stability-advisory-committee-ssac-reports/sac-044-en.pdf)

## E

### Environment

One running copy of your app with its own settings and data. Most apps have a development environment for building and testing, and a production environment that real users use.
[Twelve-Factor: Dev/prod parity](https://12factor.net/dev-prod-parity)

### Environment variable

A named setting, like `DATABASE_URL`, that your app reads when it runs instead
of having the value written into the code. Locally they usually live in a
`.env` file. In production, you set them in your host's dashboard. This keeps
secrets out of your code and lets the same code run with different settings.
[Vite: Env variables](https://vite.dev/guide/env-and-mode)

### Exposed schema

A schema is a named group of tables in a database. In Supabase, an exposed
schema is one that apps can reach over the internet through the Data API. The
`public` schema is exposed by default.
[Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

## F

### Foreign key

A column that points at a row in another table, such as an order's `user_id` pointing at a user. The database refuses links to rows that don't exist.
[Supabase: Joining tables with foreign keys](https://supabase.com/docs/guides/database/tables#joining-tables-with-foreign-keys)

### Frontend and backend

The **frontend** is the part of your app that runs in the visitor's browser or
on their phone. Every visitor downloads it, so they can read it. The
**backend** is the part that runs on a server you control, out of sight.
Secrets belong only in the backend.
[Next.js: Environment variables](https://nextjs.org/docs/app/guides/environment-variables)

## G

### Git

A version control system: it records every change to your project's files so you can see what changed, who changed it, and go back to an earlier version.
[Git: About version control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)

### GitHub Actions

GitHub's built-in automation. It runs your workflows on GitHub's computers when things happen in your repo, such as a push or a pull request.
[GitHub: About continuous integration](https://docs.github.com/en/actions/get-started/continuous-integration)

### .gitignore

A file in your project that lists files and folders Git should never track,
like `.env` or `node_modules/`. It only affects files Git isn't already
tracking. [Git: gitignore](https://git-scm.com/docs/gitignore)

## H

### Hashing

Scrambling a password into a fixed string that can't be turned back into the
original. When someone logs in, the system hashes what they typed and compares
the results. Passwords should be stored hashed with a slow algorithm, never as
plain text.
[OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

## I

### Incident

Anything that threatens your app's security or data, such as a leaked key, a hacked account or deleted data, and needs a response.
[NCSC: Incident management](https://www.ncsc.gov.uk/collection/incident-management)

### Index

A lookup structure, like the index at the back of a book, that lets the database find rows without reading the whole table. Postgres doesn't create one for foreign keys automatically.
[Supabase: Managing indexes](https://supabase.com/docs/guides/database/postgres/indexes)

## J

### Join table

A table that sits between two others to link them many-to-many, for example `order_items` linking `orders` and `products`. Each row holds a foreign key to each side.
[Supabase: Joining tables with foreign keys](https://supabase.com/docs/guides/database/tables#joining-tables-with-foreign-keys)

### JWT

JSON Web Token: a signed digital pass that says who someone is and when the pass expires. Supabase's access tokens are JWTs. Anyone can read one, but changing it breaks the signature.
[Supabase: User sessions](https://supabase.com/docs/guides/auth/sessions)

## L

### Least privilege

Giving each person, or program, only the access they need to do their job, and no more.
[Supabase: Access control](https://supabase.com/docs/guides/platform/access-control)

## M

### Magic link

A sign-in link sent by email. Clicking it signs you in without a password. Supabase's magic links can only be used once.
[Supabase: Magic links](https://supabase.com/docs/guides/auth/auth-magic-link)

### Migration

A numbered SQL file that makes one change to your database structure, saved in Git so every change is recorded, reviewable and repeatable.
[Supabase: Database migrations](https://supabase.com/docs/guides/deployment/database-migrations)

### Model Context Protocol (MCP)

An open standard for connecting AI agents to tools and data. A remote MCP server uses OAuth so a user can let an agent act for them without sharing their password.
[MCP: Authorization](https://modelcontextprotocol.io/specification/latest/basic/authorization)

### Multi-factor authentication (MFA)

Logging in with something you know (a password) plus something you have (an
app on your phone, a security key). A stolen password alone is then not
enough. Also called two-factor authentication (2FA).
[OWASP Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html)

### Multi-tenant

An app where several organisations (tenants) share the same database, and each must only see its own data. Common in business software.
[Supabase: Advanced pgTAP testing](https://supabase.com/docs/guides/local-development/testing/pgtap-extended)

## N

### Normalization

Organising tables so each fact is stored in one place, which avoids copies that drift out of sync.
[Microsoft: Database normalization basics](https://learn.microsoft.com/en-us/previous-versions/troubleshoot/microsoft-365/microsoft-365-apps/access/database-normalization-description)

## O

### OAuth

An open standard that lets someone grant an app access to their account somewhere else without sharing their password. It powers "Sign in with Google" buttons.
[Supabase: Social login](https://supabase.com/docs/guides/auth/social-login)

### Offboarding

Removing someone's access to every account and system when they leave a team or finish a contract, and rotating any secrets they could see.
[CIS Controls list](https://www.cisecurity.org/controls/cis-controls-list)

## P

### Parameterized query

A database query where user input is passed separately from the SQL text,
using placeholders. The database then always treats the input as data, never
as part of the command. This is the main defence against
[SQL injection](#sql-injection).
[OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

### Passkey

A passwordless sign-in that uses your fingerprint, face or device PIN, backed by a key stored on your device. Passkeys resist phishing.
[FIDO Alliance: Passkeys](https://fidoalliance.org/passkeys/)

### PKCE

Proof Key for Code Exchange: a one-time secret an app creates at the start of a sign-in, so an intercepted login code is useless to anyone else. Required for mobile apps using OAuth.
[Supabase: PKCE flow](https://supabase.com/docs/guides/auth/sessions/pkce-flow)

### Point-in-time recovery (PITR)

A backup method that lets you restore your database to any moment, down to the second, rather than only to the last daily backup.
[Supabase: Database backups](https://supabase.com/docs/guides/platform/backups#point-in-time-recovery)

### Policy

In [Row Level Security](#row-level-security-rls), a rule that says who can
read, add, change or delete which rows, for example "a user can only see
orders where `user_id` matches their own ID".
[Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

### Preview deployment

A temporary live copy of your app, built from a branch or pull request, with its own link, so you can try changes before they go to production.
[Vercel: Environments](https://vercel.com/docs/deployments/environments)

### Primary key

A column whose value is unique for every row in a table, like a passport number for that row. Usually called `id`.
[Supabase: Primary keys](https://supabase.com/docs/guides/database/tables#primary-keys)

### Publishable key

An [API key](#api-key) that is safe to put in your frontend. It can only do
what your permission rules (like [RLS policies](#policy)) allow. Supabase calls
it the publishable key (`sb_publishable_...`). Its older equivalent is the
`anon` key. [Supabase: API keys](https://supabase.com/docs/guides/getting-started/api-keys)

### Pull request

A request to merge the changes on one branch into another, usually `main`. It's where changes get reviewed and automatic checks run before they go in. Often shortened to PR.
[GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow)

### Push

Sending the commits on your computer up to a shared copy of the repository,
such as GitHub (`git push`).
[GitHub: Push protection](https://docs.github.com/en/code-security/concepts/secret-security/push-protection)

### Push protection

A GitHub feature that checks your [push](#push) for recognisable secrets and
blocks it before the secret reaches GitHub.
[GitHub: Push protection](https://docs.github.com/en/code-security/concepts/secret-security/push-protection)

## R

### Rate limiting

Capping how often one user, device or bot can do something in a period of time, such as "5 password-reset texts per hour", to stop abuse and runaway costs.
[OWASP API4:2023 Unrestricted Resource Consumption](https://api-security.owasp.org/editions/2023/en/0xa4-unrestricted-resource-consumption/)

### Relationship

How rows in two tables connect: one-to-one (a user has one profile), one-to-many (a user has many orders) or many-to-many (orders and products, through a [join table](#join-table)).
[Supabase: Relationships between tables](https://supabase.com/docs/guides/database/tables#relationships-between-tables)

### Repository

A project's folder of files plus its full Git history, usually shared on a site like GitHub. Often shortened to repo.
[GitHub: About repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories)

### Rotate (a key)

Creating a new key, switching your app over to it, and switching off the old
one. If a key leaks, rotating it makes the leaked copy useless.
[GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

### Row Level Security (RLS)

A database feature that checks every request against [policies](#policy)
before returning or changing a row. With RLS on and no policies, nobody gets
in. With RLS off, the table is open to anyone who can reach it.
[Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

## S

### Script injection

An attack where someone puts commands into text your workflow uses (like a pull request title), and a badly written script runs them.
[GitHub: Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)

### Secret

Anything that grants access and must stay private: [secret keys](#secret-key),
database passwords, tokens, private certificates.
[OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

### Secret key

An [API key](#api-key) with full access that skips your permission rules. It
must only ever be used on a server you control. Supabase calls it the secret
key (`sb_secret_...`). Its older equivalent is the `service_role` key.
[Supabase: API keys](https://supabase.com/docs/guides/getting-started/api-keys)

### Secret scanning

A GitHub feature that searches a repository's whole history, plus its issues
and pull requests, for leaked secrets and raises an alert.
[GitHub: Secret scanning](https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning)

### Security policy

A `SECURITY.md` file in a repository that tells people how to report a security problem privately.
[GitHub: Adding a security policy](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/configure-vulnerability-reporting/add-security-policy)

### Seed data

Made-up sample data used to fill a development or test database, so you never need real users' data to try things out.
[Supabase: Seeding your database](https://supabase.com/docs/guides/local-development/seeding-your-database)

### Session

How an app remembers you're signed in between pages and visits. In Supabase, a short-lived access token plus a refresh token that gets a new one.
[Supabase: User sessions](https://supabase.com/docs/guides/auth/sessions)

### SHA pinning

Referring to an exact version of a GitHub Action by its full commit ID (a 40-character SHA) instead of a tag like `v3`, which can be moved to different code.
[GitHub: Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)

### Single sign-on (SSO)

Signing in to many apps with one company account, managed by an identity provider such as Okta or Microsoft Entra. Businesses often ask for it.
[Supabase: SAML SSO](https://supabase.com/docs/guides/auth/enterprise-sso/auth-sso-saml)

### Spend cap

A setting that stops or limits a service when your usage reaches a set amount, instead of charging you for more. Caps often cover only some kinds of usage, so check which.
[Supabase: Spend cap](https://supabase.com/docs/guides/platform/cost-control)

### SQL injection

An attack where someone types SQL code into a form field, and a badly built
query runs it as part of the command. It can expose or delete a whole
database. [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

### Staging environment

A copy of your app and database that's set up like production but used only for testing, so mistakes land there first.
[Supabase: Managing environments](https://supabase.com/docs/guides/deployment/managing-environments)

### Status check

A pass or fail result shown on a pull request, usually from a CI workflow. Required status checks must pass before the pull request can be merged.
[GitHub: Status checks](https://docs.github.com/en/pull-requests/reference/status-checks)

## T

### Table

Where a database stores one kind of thing, such as products or orders, as rows and columns, a bit like a spreadsheet. Every column has a fixed type.
[Supabase: Tables and data](https://supabase.com/docs/guides/database/tables)

## U

### Usage-based pricing

Paying for how much you use (requests, storage, data transfer, AI tokens) rather than only a fixed monthly price, so your bill can grow with traffic, or with a bug.
[Supabase: About billing](https://supabase.com/docs/guides/platform/billing-on-supabase)

### User enumeration

Working out which email addresses have accounts on a site, usually because
login or password reset shows a different message for real and fake accounts.
Attackers use the list for targeted attacks.
[OWASP Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)

## V

### Validation

Checking that input is what you expect (an email looks like an email, a
quantity is a positive number) before you use it. It must happen on the
server, because browser checks can be skipped.
[OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

### View

A saved database query that you can use like a table. In Postgres, views skip
[Row Level Security](#row-level-security-rls) by default unless you set them up
otherwise.
[Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

## W

### Workflow

A file in `.github/workflows/` that tells GitHub Actions what to run and when, for example "on every pull request, install and test the app".
[GitHub: About continuous integration](https://docs.github.com/en/actions/get-started/continuous-integration)
