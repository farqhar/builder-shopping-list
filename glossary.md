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

### Authentication

How an app checks who someone is, usually with an email and password, a magic
link, or a social login. (Deciding what that person is *allowed* to do is a
separate job, handled by things like [policies](#policy).)
[OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

## C

### Constraint

A rule the database checks every time data is added or changed, such as "this can't be empty" (`not null`) or "quantity must be above zero" (`check`). It applies however the data arrives, which makes it stronger than a check in your app.
[Postgres: Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)

## D

### Dependabot

A free GitHub tool that watches the packages your project uses. It warns you
when one has a known security problem, and can open a pull request to update
it. [GitHub: Dependabot alerts](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-alerts)

### Dependency

A package of someone else's code that your app relies on, for example a date
library installed with `npm install`. Your app inherits any bugs or security
holes in its dependencies.
[GitHub: Dependabot alerts](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-alerts)

## E

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

### Index

A lookup structure, like the index at the back of a book, that lets the database find rows without reading the whole table. Postgres doesn't create one for foreign keys automatically.
[Supabase: Managing indexes](https://supabase.com/docs/guides/database/postgres/indexes)

## J

### Join table

A table that sits between two others to link them many-to-many, for example `order_items` linking `orders` and `products`. Each row holds a foreign key to each side.
[Supabase: Joining tables with foreign keys](https://supabase.com/docs/guides/database/tables#joining-tables-with-foreign-keys)

## M

### Migration

A numbered SQL file that makes one change to your database structure, saved in Git so every change is recorded, reviewable and repeatable.
[Supabase: Database migrations](https://supabase.com/docs/guides/deployment/database-migrations)

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

## P

### Parameterized query

A database query where user input is passed separately from the SQL text,
using placeholders. The database then always treats the input as data, never
as part of the command. This is the main defence against
[SQL injection](#sql-injection).
[OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

### Point-in-time recovery (PITR)

A backup method that lets you restore your database to any moment, down to the second, rather than only to the last daily backup.
[Supabase: Database backups](https://supabase.com/docs/guides/platform/backups#point-in-time-recovery)

### Policy

In [Row Level Security](#row-level-security-rls), a rule that says who can
read, add, change or delete which rows, for example "a user can only see
orders where `user_id` matches their own ID".
[Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

### Primary key

A column whose value is unique for every row in a table, like a passport number for that row. Usually called `id`.
[Supabase: Primary keys](https://supabase.com/docs/guides/database/tables#primary-keys)

### Publishable key

An [API key](#api-key) that is safe to put in your frontend. It can only do
what your permission rules (like [RLS policies](#policy)) allow. Supabase calls
it the publishable key (`sb_publishable_...`). Its older equivalent is the
`anon` key. [Supabase: API keys](https://supabase.com/docs/guides/getting-started/api-keys)

### Push

Sending the commits on your computer up to a shared copy of the repository,
such as GitHub (`git push`).
[GitHub: Push protection](https://docs.github.com/en/code-security/concepts/secret-security/push-protection)

### Push protection

A GitHub feature that checks your [push](#push) for recognisable secrets and
blocks it before the secret reaches GitHub.
[GitHub: Push protection](https://docs.github.com/en/code-security/concepts/secret-security/push-protection)

## R

### Relationship

How rows in two tables connect: one-to-one (a user has one profile), one-to-many (a user has many orders) or many-to-many (orders and products, through a [join table](#join-table)).
[Supabase: Relationships between tables](https://supabase.com/docs/guides/database/tables#relationships-between-tables)

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

### SQL injection

An attack where someone types SQL code into a form field, and a badly built
query runs it as part of the command. It can expose or delete a whole
database. [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

### Staging environment

A copy of your app and database that's set up like production but used only for testing, so mistakes land there first.
[Supabase: Managing environments](https://supabase.com/docs/guides/deployment/managing-environments)

## T

### Table

Where a database stores one kind of thing, such as products or orders, as rows and columns, a bit like a spreadsheet. Every column has a fixed type.
[Supabase: Tables and data](https://supabase.com/docs/guides/database/tables)

## U

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
