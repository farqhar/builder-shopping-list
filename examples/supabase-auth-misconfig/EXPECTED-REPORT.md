# Expected report

What the [`auth-check`](../../skills/auth-check/SKILL.md) skill should find
in this example, when told it's an internal tool. The wording will vary,
but the findings and their colours should match.

## Summary

**3 things to fix now, 5 to check, and the rest looking good or not
applicable.**

| Check | Result | Meaning |
| --- | --- | --- |
| A1 Server checks the user | 🔴 Fix now | `src/middleware.ts` trusts `getSession()` |
| A2 Where roles come from | 🔴 Fix now | `src/lib/isAdmin.ts` reads `user_metadata` |
| A4 Admin features | 🔴 Fix now | The delete button is only hidden in the browser |
| A5 Email confirmation | 🟡 Check this | Off in `config.toml` |
| A6 Link expiry | 🟡 Check this | 86400 seconds (24 hours) |
| A7 Public sign-ups | 🟡 Check this | On, for an internal tool |
| A8 Redirect URLs | 🟡 Check this | `**` wildcard in production |
| A10 MFA | 🟡 Check this | Off, for an admin tool |
| A3 Secret keys | 🟢 Looks good | Only the publishable key is used |
| A9 Anonymous sign-ins | 🟢 Looks good | Off |
| A13 Implicit flow | 🟢 Looks good | Not used |
| `src/app/api/orders/route.ts` | 🟢 Looks good | Checks the user with `getClaims()` |
| A11 Password length | ⚪ Can't check | A dashboard setting. The skill should ask |
| A12, A14, A15 | Not applicable | Not a mobile app, extension or AI agent |

## Findings

### 🔴 A1: the admin area trusts `getSession()`

`src/middleware.ts` runs on the server and lets people into `/admin` based
on `supabase.auth.getSession()`. Supabase's docs say never to trust it in
server code: it reads the session cookie without revalidating it, and
anyone can forge that cookie. **Fix:** use `supabase.auth.getClaims()`, as
`src/app/api/orders/route.ts` already does.

### 🔴 A2: admins are decided by `user_metadata`

`src/lib/isAdmin.ts` checks `user.user_metadata.role === "admin"`. Users can
edit their own `user_metadata`, so anyone can make themselves an admin.
**Fix:** keep roles in a table, or in a custom access token claim.

### 🔴 A4: the delete button is only hidden, not protected

`src/app/admin/page.tsx` hides "Delete all orders" from non-admins, but the
delete runs from the browser with no server check. Anyone signed in can run
the same request without the button. Combined with A2, anyone can also make
themselves "admin". **Fix:** an RLS policy (or a server route) that only
lets real admins delete. Then run `supabase-rls-check`.

### 🟡 A5 to A10: settings for an invite-only tool

- **A5:** `enable_confirmations = false`, so people can sign up with
  someone else's email.
- **A6:** `otp_expiry = 86400`, so sign-in and reset links work for 24
  hours. Supabase recommends 3600 or less.
- **A7:** `enable_signup = true`, so strangers can create accounts in a
  tool meant only for invited staff.
- **A8:** `https://my-app.example.com/**` allows redirects to any path.
  Supabase recommends exact URLs in production.
- **A10:** TOTP MFA is off, for an admin tool with powerful access.

All five are in `config.toml`, which sets up the *local* project. The skill
should remind you to check the live project's dashboard too, or push the
file with `supabase config push`.
