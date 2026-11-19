# Expected report

What the [`supabase-rls-check`](../../skills/supabase-rls-check/SKILL.md)
skill should find in this example. The wording will vary from run to run,
but the findings and their colours should match.

## Summary

**3 things to fix now, 3 to check, 2 tables looking good.**

| Table or file | Result | Meaning |
| --- | --- | --- |
| `orders` | 🔴 Fix now | RLS is off: anyone can read, change or delete every order |
| `profiles` | 🔴 Fix now | Policies let anyone read every profile and add new ones |
| `src/lib/supabase.js` | 🔴 Fix now | The secret key is used in browser code |
| `order_summaries` (view) | 🟡 Check this | Skips RLS, so it shows every customer's totals |
| `products` | 🟢 Looks good | Public read on purpose, no writes from the app (the skill should ask you to confirm it's meant to be public) |
| `notes` | 🟢 Looks good | RLS on, one owner-only policy per operation, grants reset |

## Findings

### 🔴 R1: `orders` has RLS turned off

The table is created but never has `enable row level security`. Supabase's
docs say a table without RLS is readable and writable by any role with a
grant on it, and new tables grant everything to `anon` by default.

**We tested it:** as a signed-out visitor, reading and deleting every order
both succeeded.

### 🔴 R2 and R3: `profiles` policies let anyone in

- `"Enable read access for all users"`: `using (true)` with no `to` clause.
  Every visitor can read every user's email and phone number (R3).
- `"Enable insert for everyone"`: `with check (true)` with no `to` clause.
  Anyone can add rows (R2).

**We tested it:** a signed-out visitor could read every profile. Their
attempt to insert a fake profile failed, but only because of a foreign key
(the made-up ID didn't match a real user), not because of RLS. The policy
itself allowed it.

### 🔴 R4: secret key in browser code

`src/lib/supabase.js` passes `VITE_SUPABASE_SERVICE_ROLE_KEY` to
`createClient`. Vite copies any `VITE_` variable into the code every visitor
downloads, and the secret key bypasses RLS completely. In a real project this
means: rotate the key first, then use the publishable key in the browser.

### 🔴 R8 (counted with the tables above): default grants never revoked

`orders` and `profiles` never run `revoke all ... from anon, authenticated`,
so signed-out visitors keep select, insert, update and delete grants. Policies
don't take grants back.

### 🟡 R7: `order_summaries` view skips RLS

The view is created without `security_invoker = true`, so it runs as its
owner and ignores the RLS on `orders`. **We tested it:** a signed-out visitor
could read it.

### 🟡 R9: policies with no `to` clause

Both `profiles` policies. Supabase recommends always naming the role.

### 🟡 R14: no RLS tests

There's no `supabase/tests/` folder.

## What a fix looks like

[`solution/20260102000000_fix_rls.sql`](solution/20260102000000_fix_rls.sql)
fixes every database finding. After applying it, a signed-out visitor is
blocked from reading orders, profiles and the view, from adding profiles,
and from deleting orders. Checked by applying both files to a real Postgres
17 database.

The `src/lib/supabase.js` finding is fixed in code: use the publishable key
(`VITE_SUPABASE_PUBLISHABLE_KEY` set to an `sb_publishable_...` value) in the
browser, and keep the secret key on a server.
