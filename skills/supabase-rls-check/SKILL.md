---
name: supabase-rls-check
description: >-
  Audit a Supabase project's database permissions (Row Level Security, grants,
  policies, views and security definer functions) and check that no secret or
  service_role key is exposed to frontend code, then explain the results in
  plain English for a beginner with fixes linked to Supabase's docs. Works
  from migration files in the repo, or from the output of a read-only query
  the user runs in the Supabase SQL editor.
when_to_use: >-
  For example "is my Supabase database secure?", "check my RLS", "can anyone
  read my tables?", "did I set up row level security right?", "is my service
  role key exposed?", or before launching an app built with Lovable, Bolt or
  another AI tool on Supabase.
---

# Supabase RLS check

You are auditing a Supabase project for someone who is probably not a
software engineer. Your job is to **check and explain**, then **offer**
fixes. A finding is only useful if the user understands it and knows what to
do next.

## Ground rules

- **Never change anything without asking.** Don't edit files, write
  migrations or run SQL that changes the database until the user has seen
  exactly what you'll do and agreed to it.
- **Never run SQL against a live database yourself**, except the read-only
  audit query below, and only if the user asks you to run it through a
  database connection they've set up (for example a Supabase MCP server in
  read-only mode). Otherwise, give them the query to run.
- **Never print secret values.** If you find a real-looking key, say where it
  is and what kind it is, and show only its first few characters.
- **Don't guess.** If you can't tell whether something is intended (like a
  table that everyone can read), ask.
- Define each technical term in plain words the first time you use it:
  RLS, policy, grant, `anon`, `authenticated`, view, migration.

## Step 1: Gather the evidence

Work out what you have to look at, in this order.

1. **Migration files.** Look for `supabase/migrations/*.sql` and any other
   `.sql` files in the repo. Read them **in filename order**. They run in
   order, so a later file can enable RLS, drop a policy or revoke a grant
   that an earlier file set up. Judge the **final** state.
2. **Exposed schemas.** Read `supabase/config.toml` if it exists. The
   `schemas` setting under `[api]` lists the schemas the Data API exposes.
   If it's missing, assume `public` (Supabase's default list is `public`,
   `storage` and `graphql_public`). Audit tables and views in exposed
   schemas, and ignore Supabase's own `storage` and `graphql_public` schemas.
3. **Frontend code.** Note where browser-side code lives, for example
   `src/`, `app/`, `pages/`, `components/`, `public/`, and any `.env*` files.
4. **No migration files?** Many Lovable and Bolt projects keep their schema
   only in the hosted database. Ask the user to open **SQL Editor** in their
   Supabase dashboard, run the read-only query below, and paste the results
   back. Explain that it only reads settings and changes nothing.

```sql
-- Read-only RLS audit for the public schema. Changes nothing.
select 'table' as kind,
       c.relname as name,
       case when c.relrowsecurity then 'RLS on' else 'RLS OFF' end as detail
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind in ('r', 'p')

union all
select 'grant',
       c.relname,
       r.rolname || ' can: ' || coalesce(nullif(concat_ws(', ',
         case when has_table_privilege(r.rolname, c.oid, 'SELECT') then 'select' end,
         case when has_table_privilege(r.rolname, c.oid, 'INSERT') then 'insert' end,
         case when has_table_privilege(r.rolname, c.oid, 'UPDATE') then 'update' end,
         case when has_table_privilege(r.rolname, c.oid, 'DELETE') then 'delete' end), ''), 'nothing')
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
cross join (values ('anon'), ('authenticated')) as r(rolname)
where n.nspname = 'public' and c.relkind in ('r', 'p', 'v')

union all
select 'policy',
       p.tablename || ': ' || p.policyname,
       p.cmd || ' to ' || array_to_string(p.roles, ', ')
         || ' | using: ' || coalesce(p.qual, '-')
         || ' | with check: ' || coalesce(p.with_check, '-')
from pg_policies p
where p.schemaname = 'public'

union all
select 'view',
       c.relname,
       coalesce(array_to_string(c.reloptions, ', '), 'no options (runs as its owner and skips RLS)')
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'v'

union all
select 'function',
       p.proname,
       'security definer' || coalesce(' | ' || array_to_string(p.proconfig, ', '), ' | search_path NOT set')
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.prosecdef

order by 1, 2;
```

If the user has other exposed schemas, tell them to change `'public'` in each
`where` line to that schema's name and run it again.

## Step 2: Check

Record a result for every finding: 🔴 **Fix now**, 🟡 **Check this**, or
🟢 **Looks good**. A policy with no `to` clause applies to every role,
including signed-out visitors. In query results it shows as `to public`.

### 🔴 Fix now

| # | Look for | Why it matters |
| --- | --- | --- |
| R1 | A table in an exposed schema with RLS off (no `enable row level security`, or `RLS OFF` in the query) | Supabase's docs: a table without RLS is readable and writable by any role with a grant on it. Since the publishable key is public, that can mean anyone. |
| R2 | An `insert`, `update`, `delete` or `all` policy whose `using` or `with check` is just `true` | Anyone the policy applies to can add, change or delete any row. If it applies to `anon` or has no `to`, that's every visitor. |
| R3 | A `select` policy with `using (true)` that applies to `anon` or has no `to` clause, on a table that holds personal or private data (columns like `email`, `phone`, `address`, `user_id`, payment or health fields) | Every signed-out visitor can read every row. |
| R4 | A secret key reachable from the browser: `service_role`, `sb_secret_`, `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SECRET_KEY` in frontend code, in a variable starting `VITE_` or `NEXT_PUBLIC_`, or passed to `createClient` in browser code | A secret key bypasses RLS completely. Vite and Next.js copy variables with those prefixes into the code every visitor downloads. |
| R5 | A policy that decides access using `user_metadata`, `raw_user_meta_data` or `auth.jwt() -> 'user_metadata'` | Supabase's docs warn that users can edit their own `user_metadata`, so they can grant themselves access. Use `app_metadata` instead. |

### 🟡 Check this

| # | Look for | Why it matters |
| --- | --- | --- |
| R6 | A `select` policy with `using (true)` for `anon` (or no `to`) on a table that looks public, like products or blog posts | Fine if it's meant to be public. **Ask the user** and mark 🟢 if they confirm. |
| R7 | A view in an exposed schema without `security_invoker = true` | Views skip RLS by default and can leak every row of a protected table. |
| R8 | A table where `anon` or `authenticated` keep grants the app doesn't need (no `revoke ... from anon, authenticated` in the migrations, or extra privileges in the query's `grant` rows) | Policies don't take grants back. Supabase recommends revoking all, then granting only what each role needs. Some projects don't add default grants, so say "may". |
| R9 | A policy with no `to` clause | Supabase recommends always naming the role, usually `to authenticated`. |
| R10 | A `for all` policy | Supabase recommends one policy per operation, so it's clear what each rule allows. |
| R11 | A `security definer` function in an exposed schema, or one without `set search_path` | It runs with its creator's powers and can bypass RLS. |
| R12 | An `update` policy on a table with no `select` policy | Supabase's docs: updates need a matching `select` policy, or they won't work as expected. |
| R13 | RLS on, but no policies at all | Nobody can reach the table through the API. Fine if that's intended (for example, server-only data). Otherwise the app will look broken. |
| R14 | No RLS tests (`supabase/tests/*.sql`) | Supabase recommends a test file per table that checks what `anon` and `authenticated` can and can't do. |

Mark a table 🟢 when it has RLS on, a policy per operation with a `to`
clause, nothing in R1–R5, and grants that match what the app does.

## Step 3: Report

Write the report in this order, in plain English:

1. **Summary.** One line, for example "2 things to fix now, 3 to check, 2
   tables looking good". Then a table: Table or file | Result | One-line
   meaning.
2. **Findings.** For every 🔴, then every 🟡:
   - **What we found:** the table, policy or file and line.
   - **Why it matters:** one sentence. Describe what a stranger could do,
     for example "anyone on the internet could download every customer's
     address".
   - **How to fix it:** the SQL or code change, as a short snippet.
   - **Learn more:** the matching link from "Sources" below.
3. **What to do next.** At most five numbered steps, most urgent first.

Rules for "What to do next":

- If R4 found a secret key in frontend code that has ever been deployed or
  pushed to GitHub, step 1 is always: **rotate that key now** in the Supabase
  dashboard (Project Settings, then API Keys), then move it to server-side
  code. Removing it from the code isn't enough, because copies already exist.
- Always end with: run **Security Advisor** in the Supabase dashboard
  (Advisors, then Security Advisor) to double-check against the live
  database, and add RLS tests.

## Step 4: Offer fixes (only with permission)

Offer to write the fixes as a **new migration file**, for example
`supabase/migrations/<timestamp>_fix_rls.sql`. Never edit old migrations,
because they may already have run. Show the full file before writing it. If
the user agrees, write it and explain how to apply it: run
`supabase db push` if they use the Supabase CLI, or paste it into the SQL
Editor. Never apply it yourself.

Templates, all from Supabase's RLS guide:

```sql
-- Turn on RLS and reset grants (R1, R8)
alter table public.<table> enable row level security;
revoke all on table public.<table> from anon, authenticated;
grant select, insert, update, delete on table public.<table> to authenticated;

-- Owner-only access, one policy per operation (R2, R3, R9, R10)
create policy "Users can read their own <table>"
on public.<table> for select to authenticated
using ( (select auth.uid()) = user_id );

create policy "Users can add their own <table>"
on public.<table> for insert to authenticated
with check ( (select auth.uid()) = user_id );

create policy "Users can edit their own <table>"
on public.<table> for update to authenticated
using ( (select auth.uid()) = user_id )
with check ( (select auth.uid()) = user_id );

create policy "Users can delete their own <table>"
on public.<table> for delete to authenticated
using ( (select auth.uid()) = user_id );

-- Remove an unsafe policy (R2, R3, R5)
drop policy "<policy name>" on public.<table>;

-- Make a view respect RLS, Postgres 15 and later (R7)
alter view public.<view> set (security_invoker = true);
```

Adapt each template to the real table. If a table has no `user_id`-style
column, don't invent one. Ask the user who should be able to see each row.

For R4, offer to change the frontend client to use the publishable key
(`sb_publishable_...`, or the older `anon` key), and move anything that
truly needs the secret key into server-side code such as an Edge Function.

## Sources

Use these for the "Learn more" links:

- Row Level Security (grants, policies, roles, views, `user_metadata`, security definer, tests): <https://supabase.com/docs/guides/database/postgres/row-level-security>
- API keys (publishable vs secret): <https://supabase.com/docs/guides/getting-started/api-keys>
- Securing your API (default privileges, exposed schemas): <https://supabase.com/docs/guides/api/securing-your-api>
- Security Advisor: <https://supabase.com/docs/guides/observability/advisors>
- Database migrations: <https://supabase.com/docs/guides/deployment/database-migrations>
- Production security checklist: <https://supabase.com/docs/guides/security/production-checklist>
- Vite env variables: <https://vite.dev/guide/env-and-mode>
- Next.js env variables: <https://nextjs.org/docs/app/guides/environment-variables>
