---
name: auth-check
description: >-
  Audit how an app handles sign-in with Supabase Auth: auth settings (email
  confirmation, link expiry, sign-ups, redirect URLs, anonymous sign-ins,
  MFA), how server code checks who is signed in, where roles come from, and
  whether secret keys or unsafe sign-in flows ship in web, mobile or browser
  extension code. Explains the results in plain English for a beginner, with
  fixes linked to official docs.
when_to_use: >-
  For example "is my login set up right?", "check my auth", "is my Supabase
  Auth secure?", "can people sign up to my internal tool?", "am I checking
  the user correctly on the server?", or before launching any app that has
  sign-in.
---

# Auth check

You are auditing how an app signs people in, for someone who is probably not
a software engineer. Your job is to **check and explain**, then **offer**
fixes. Use the guide at
`${CLAUDE_PLUGIN_ROOT}/guides/auth-by-app-type.md` for background if it
exists.

## Ground rules

- **Never change anything without asking.** Show the exact edit first, and
  apply it only after the user agrees to that specific change.
- **Never print secret values.** Say where a key is and what kind it is,
  showing only its first few characters.
- **Don't guess.** If a setting isn't in the files, ask the user to read it
  from their dashboard, or mark it ⚪ **Can't check**.
- Define each technical term in plain words the first time you use it:
  session, token, OAuth, redirect URL, MFA, PKCE.

## Step 1: Work out what kind of app this is

Ask the user, or infer it from the code and confirm. The app type changes
which checks matter:

| Type | Clues |
| --- | --- |
| Website or web app | `src/`, `app/`, `pages/`, Vite or Next.js config |
| Mobile app | React Native or Expo (`app.json`), Flutter (`pubspec.yaml`), iOS or Android folders |
| Browser extension | `manifest.json` with `manifest_version` |
| B2B SaaS (teams) | tables like `organizations`, `teams`, `memberships` |
| Marketplace | two kinds of user, such as buyer and seller |
| Internal tool or admin panel | the user says only their team should get in |
| AI agent or MCP server | MCP server code, OAuth server settings |

## Step 2: Gather the evidence

1. **`supabase/config.toml`.** Read the `[auth]`, `[auth.email]` and
   `[auth.mfa]` sections. **Important:** this file sets up the user's
   *local* development project. It only changes the live project if they
   run `supabase config push`. Always ask whether the live project
   (Authentication settings in the dashboard) matches it. If the user has
   the Supabase CLI linked to their project, `supabase config diff` shows
   the differences and changes nothing. Suggest they run it.
2. **No `config.toml`?** Ask the user to open their Supabase dashboard and
   tell you these settings: Authentication → Sign In / Providers ("Allow new
   users to sign up", "Confirm email", anonymous sign-ins, email OTP expiry,
   minimum password length), URL Configuration (Site URL and Redirect URLs),
   and Multi-Factor.
3. **Code.** Search for `createClient`, `createServerClient`,
   `createBrowserClient`, `getSession`, `getUser`, `getClaims`,
   `user_metadata`, `app_metadata`, `flowType`, `signInWithOAuth`,
   `WebView` or `webview`, and `launchWebAuthFlow`, plus any key-like
   variables (`SERVICE_ROLE`, `SECRET`, `sb_secret_`).

## Step 3: Check

Record a result for every finding: 🔴 **Fix now**, 🟡 **Check this**, 🟢
**Looks good** or ⚪ **Can't check**.

### 🔴 Fix now

| # | Look for | Why it matters | Source |
| --- | --- | --- | --- |
| A1 | Server code (middleware, API routes, server components, Edge Functions) deciding access with `supabase.auth.getSession()` | Supabase's docs: never trust `getSession()` in server code, because it reads the session cookie without revalidating it, and anyone can forge that cookie. Use `getClaims()`. | Supabase: Creating a server client |
| A2 | Roles or permissions read from `user_metadata` or `raw_user_meta_data`, in code or in policies | Users can edit their own `user_metadata`, so they can make themselves admin. | Supabase: RLS; Supabase: Custom claims and RBAC |
| A3 | A secret or `service_role` key in anything that ships to users: browser code, a mobile app or a browser extension | Supabase: "anything you ship" gets the publishable key only. A secret key bypasses every permission rule. | Supabase: API keys |
| A4 | Admin or role-only features protected **only** in the frontend (hidden buttons or pages) with no matching RLS policy or server check | OWASP: "Developers must never rely on client-side access control checks." | OWASP: Authorization |

### 🟡 Check this

| # | Look for | Why it matters | Source |
| --- | --- | --- | --- |
| A5 | Email confirmation off (`[auth.email] enable_confirmations = false`, or "Confirm email" off in the dashboard) | Anyone can sign up as someone else's email address. Supabase's production checklist says to enable it. In `config.toml` this is 🟡; if the live project has it off, it's 🔴. | Supabase: Production security checklist |
| A6 | Email OTP and link expiry over 3600 seconds (`[auth.email] otp_expiry`) | Supabase's production checklist recommends 1 hour or less. The same setting covers reset and invite links. | Supabase: Production security checklist |
| A7 | Public sign-ups on (`[auth] enable_signup = true`) for an internal tool or invite-only app | Strangers can create accounts. **Ask the user** whether anyone should be able to sign up. | Supabase: General configuration |
| A8 | Redirect URLs with `**` wildcards, or non-localhost `http://` URLs, in `additional_redirect_urls`, `site_url` or the dashboard's URL Configuration for production | Supabase recommends exact redirect URLs in production. Wildcards are for local development and previews. | Supabase: Redirect URLs |
| A9 | Anonymous sign-ins on (`[auth] enable_anonymous_sign_ins = true`) with no CAPTCHA (ask the user) | Bots can fill the database with fake users. Supabase "strongly recommends" CAPTCHA or Cloudflare Turnstile. | Supabase: Anonymous sign-ins |
| A10 | MFA not available (`[auth.mfa.totp] enroll_enabled = false`, or Multi-Factor off) in an app with admins, teams or internal users | MFA is the strongest defence against stolen passwords. | Supabase: MFA; OWASP: MFA |
| A11 | Minimum password length under 8 (ask the user, it's a dashboard setting) | Supabase: "Anything less than 8 characters is not recommended." | Supabase: Password security |
| A12 | **Mobile:** OAuth sign-in opened in an in-app web view, or `flowType: 'implicit'` | The OAuth standard for native apps says to use the system browser, and requires PKCE. | RFC 8252; Supabase: PKCE flow |
| A13 | **Any app:** `flowType: 'implicit'` set explicitly | Current OAuth security guidance says clients "SHOULD NOT use the implicit grant". | RFC 9700 |
| A14 | **Browser extension:** OAuth not done through the browser's identity API (`launchWebAuthFlow`), or secrets passed to content scripts | Chrome's security guidance says not to send secrets to content scripts. Both Chrome and Firefox provide `launchWebAuthFlow` for OAuth. | Chrome: Stay secure; Chrome and MDN: identity API |
| A15 | **AI agent or MCP server:** an agent given a user's password, a secret key or broad standing access instead of an OAuth token | MCP's authorization is built on OAuth 2.1. OWASP says to grant agents the minimum tools they need, and to require approval for high-impact actions. | MCP: Authorization; OWASP: AI Agent Security |

A 🟢 result means the setting or code matches the recommendation. Say so
briefly. People like to know what they got right.

## Step 4: Report

Write the report in this order, in plain English:

1. **Summary.** One line, for example "1 thing to fix now, 3 to check, 6
   looking good", then a table: Check | Result | One-line meaning.
2. **Findings.** For every 🔴, then every 🟡:
   - **What we found:** the file and line, or the setting.
   - **Why it matters:** one sentence, phrased as what a stranger could do.
   - **How to fix it:** a short code or config change, or the dashboard
     click path.
   - **Learn more:** the matching link from "Sources" below.
3. **What to do next.** At most five numbered steps, most urgent first.

Rules for "What to do next":

- If A3 found a secret key in shipped code, step 1 is always: **rotate that
  key now** in the Supabase dashboard, because copies already exist wherever
  the app was downloaded or deployed.
- If any setting was only checked in `config.toml`, remind the user to check
  the live project's dashboard too, or push the file with
  `supabase config push`.
- Always end by pointing to the `supabase-rls-check` skill. Sign-in is only
  half the job: permissions decide what signed-in people can see.

## Step 5: Offer fixes (only with permission)

Offer each fix separately. Show the change before making it.

- **A1:** replace `getSession()` with `getClaims()` in server code, following
  Supabase's server client guide for the user's framework.
- **A2:** move roles into a table or a custom access token claim. Point to
  Supabase's RBAC guide; don't invent the code.
- **A3:** switch the shipped code to the publishable key, and move work that
  truly needs the secret key to a server or Edge Function.
- **A4:** add the matching RLS policy or server check. Suggest running the
  `supabase-rls-check` skill.
- **A5–A10 in `config.toml`:** offer the exact line change, then remind them
  it affects their local project until they run `supabase config push`.
- **Dashboard-only settings (A5–A11 on the live project):** give the click
  path. Never change a live project yourself.

## Sources

Use these for the "Learn more" links:

- Supabase: Creating a server client (`getSession` vs `getClaims`): <https://supabase.com/docs/guides/auth/server-side/creating-a-client>
- Supabase: Row Level Security (`user_metadata`): <https://supabase.com/docs/guides/database/postgres/row-level-security>
- Supabase: Custom claims and RBAC: <https://supabase.com/docs/guides/api/custom-claims-and-role-based-access-control-rbac>
- Supabase: API keys: <https://supabase.com/docs/guides/getting-started/api-keys>
- Supabase: Production security checklist: <https://supabase.com/docs/guides/security/production-checklist>
- Supabase: General configuration: <https://supabase.com/docs/guides/auth/general-configuration>
- Supabase: Redirect URLs: <https://supabase.com/docs/guides/auth/redirect-urls>
- Supabase: Anonymous sign-ins: <https://supabase.com/docs/guides/auth/auth-anonymous>
- Supabase: MFA: <https://supabase.com/docs/guides/auth/auth-mfa>
- Supabase: Password security: <https://supabase.com/docs/guides/auth/password-security>
- Supabase: PKCE flow: <https://supabase.com/docs/guides/auth/sessions/pkce-flow>
- Supabase CLI config reference: <https://supabase.com/docs/guides/local-development/cli/config>
- Supabase CLI: config push: <https://supabase.com/docs/reference/cli/supabase-config-push>
- OWASP: Authorization: <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>
- OWASP: Multifactor Authentication: <https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html>
- OWASP: AI Agent Security: <https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html>
- RFC 8252, OAuth for native apps: <https://datatracker.ietf.org/doc/html/rfc8252>
- RFC 9700, OAuth 2.0 security best practice: <https://datatracker.ietf.org/doc/html/rfc9700>
- MCP: Authorization: <https://modelcontextprotocol.io/specification/latest/basic/authorization>
- Chrome: Stay secure: <https://developer.chrome.com/docs/extensions/develop/security-privacy/stay-secure>
- Chrome: identity API: <https://developer.chrome.com/docs/extensions/reference/api/identity>
- MDN: WebExtensions identity: <https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/identity>
