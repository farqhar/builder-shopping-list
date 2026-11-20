---
name: cost-trap-check
description: >-
  Check a project for surprise-bill traps: paid API calls (AI, SMS, email)
  that run in loops or from public endpoints with no limits, uploads with no
  size limit, unbounded list queries, anonymous sign-ins without a CAPTCHA,
  and scheduled jobs that call paid services too often. Asks about spend caps
  and budget alerts it can't see. Explains the results in plain English for a
  beginner.
when_to_use: >-
  For example "could my app run up a huge bill?", "check my costs", "is my AI
  feature safe from abuse?", "what happens if a bot hits my app?", or before
  launching any app that calls a paid API or uses usage-based hosting.
---

# Cost trap check

You are checking a project for ways it could run up a surprise bill, for
someone who is probably not a software engineer. Most services charge by
usage, so a bug, a bot or one abusive user can cost real money in minutes.
Your job is to **find and explain**, then **offer** fixes. Use
`${CLAUDE_PLUGIN_ROOT}/checklists/06-costs.md` for background if it exists.

## Ground rules

- **Never change anything without asking.** Show the exact change first, and
  apply it only after the user agrees to that specific change.
- **Never print secret values** you come across. If you find one, mention
  the file and suggest the `secrets-scan` skill.
- **Don't guess at prices.** You can estimate *how many* calls something
  makes ("every minute = about 43,000 times a month"), but not what that
  costs. Point the user to each provider's pricing page.
- **Dashboard settings are invisible to you.** Ask the user, or mark them ⚪
  **Can't check**.
- Define each technical term in plain words the first time you use it: rate
  limit, endpoint, Edge Function, cron job, CAPTCHA, spend cap.

## Step 1: Gather the evidence

1. **Paid services.** Search for calls to:
   - AI: `anthropic`, `messages.create`, `openai`, `chat.completions`,
     `responses.create`, `generateText`, `streamText`.
   - SMS and phone: `twilio`, `messages.create`, `verify`, and any URL or
     variable name containing `sms`.
   - Email: `resend`, `sendgrid`, `postmark`, `nodemailer`, `.send(`.
   - Anything else the user says costs them per use.
2. **Where each call runs.** For each paid call, work out what triggers it:
   a public page or form, an API route or Edge Function (a small piece of
   server code that runs when a URL is called), a loop, or a schedule.
3. **Limits around each call.** Look for a sign-in check, a rate limit (a cap
   on how often one person can do something), a maximum on loop length, or
   a queue.
4. **Uploads.** Find storage uploads (`storage.from(...).upload`,
   `createBucket`, file inputs) and any size checks. In
   `supabase/config.toml`, read `[storage] file_size_limit`.
5. **List queries.** Find queries that return many rows
   (`.select(` without `.limit(` or `.range(`). In `config.toml`, read
   `[api] max_rows`.
6. **Anonymous sign-ins.** In `config.toml`, read
   `[auth] enable_anonymous_sign_ins`.
7. **Scheduled jobs.** Find `cron.schedule(` in SQL migrations, scheduled
   functions, and cron settings in hosting config (`vercel.json` `crons`,
   `.github/workflows` with `schedule:`). Note each schedule and what it
   calls.

## Step 2: Check

Record a result for every check: 🔴 **Fix now**, 🟡 **Check this**, 🟢
**Looks good** or ⚪ **Can't check**.

### 🔴 Fix now

| # | Look for | Why it matters | Source |
| --- | --- | --- | --- |
| C1 | A paid API called inside a loop or retry with no maximum, or once per item of user-supplied input with no cap on how many items | One request can trigger thousands of paid calls. OWASP describes an attacker triggering an SMS flow "tens of thousands of times", costing "thousands of dollars in a matter of minutes". | OWASP API4:2023 |
| C2 | A public endpoint (API route, Edge Function, form handler) that calls a paid API with no sign-in check **and** no rate limit | Anyone on the internet can call it as often as they like, on your bill. OWASP: "Implement a limit on how often a client can interact with the API within a defined timeframe". | OWASP API4:2023 |

### 🟡 Check this

| # | Look for | Why it matters | Source |
| --- | --- | --- | --- |
| C3 | Paid API calls behind sign-in but with no per-user rate limit | A single account (or a script using one) can still run up the bill. OWASP: "Limit/throttle how many times or how often a single API client/user can execute a single operation". | OWASP API4:2023 |
| C4 | Uploads with no size limit in code, and `[storage] file_size_limit` left at the default or raised (or the dashboard's global limit unchecked) | You pay for storage and transfer. OWASP: enforce a "maximum upload file size". Supabase recommends setting the global limit to the largest file your app accepts, with smaller per-bucket limits. | OWASP API4:2023; Supabase: Storage upload limits |
| C5 | `[api] max_rows` raised well above the default of 1,000, or list queries with no `.limit()` or `.range()` where the table can grow large | Supabase returns at most 1,000 rows by default and recommends keeping it low "to limit the payload size of accidental or malicious requests". | Supabase: JavaScript `limit()`; OWASP API4:2023 |
| C6 | Anonymous sign-ins on (`enable_anonymous_sign_ins = true`) with no CAPTCHA (ask the user, it's a dashboard setting) | Supabase: "bad actors can abuse the endpoint to increase your database size drastically", and it "strongly" recommends CAPTCHA or Cloudflare Turnstile. | Supabase: Anonymous sign-ins |
| C7 | A scheduled job that calls a paid API or an Edge Function frequently. Show the user the maths: every minute is about 43,000 runs a month, every second about 2.6 million | Supabase Cron jobs "can run anywhere from every second to once a year". A schedule copied from an example can cost far more than intended. | Supabase: Cron; Supabase: Scheduling Edge Functions |

### ⚪ Ask the user

| # | Ask | Why it matters | Source |
| --- | --- | --- | --- |
| C8 | For each paid service you found: is there a spend cap or monthly limit? If not, is there a budget alert? | OWASP: "Configure spending limits for all service providers/API integrations. When setting spending limits is not possible, billing alerts should be configured instead." An alert tells you; it doesn't stop anything. | OWASP API4:2023; Costs checklist |

A 🟢 result means the code or setting has a sensible limit. Say so briefly.
People like to know what they got right.

## Step 3: Report

Write the report in this order, in plain English:

1. **Summary.** One line, for example "1 thing to fix now, 2 to check, 4
   looking good", then a table: Check | Result | One-line meaning.
2. **Paid services found.** A short table: Service | Where it's called | What
   triggers it | Limit in place.
3. **Findings.** For every 🔴, then every 🟡:
   - **What we found:** the file and line, or the setting.
   - **Why it matters:** one sentence, phrased as what a bot or abuser
     could do, and roughly how many calls that is.
   - **How to fix it:** see step 4.
   - **Learn more:** the matching link from "Sources" below.
4. **What to do next.** At most five numbered steps, most urgent first.

Rules for "What to do next":

- If C1 or C2 is 🔴, step 1 is: set a spend limit in that provider's
  dashboard **today**. It's the fastest protection while the code fix is made.
- If C8 wasn't answered, include it. A cap is the only thing that actually
  stops the meter.
- Always end by pointing to the costs checklist, and to the `secrets-scan`
  skill: a leaked key is the other way to get a surprise bill.

## Step 4: Offer fixes (only with permission)

Offer each fix separately. Show the change before making it.

- **C1:** add a maximum (for example, cap the number of items processed per
  request) and stop retrying after a few attempts.
- **C2, C3:** require sign-in before the paid call, then add a per-user rate
  limit. Don't invent a rate-limiting library; ask what the user's host
  offers, and point to OWASP's guidance.
- **C4:** offer the `config.toml` change to `file_size_limit`, add a size
  check before upload, and point to the global limit in the dashboard's
  Storage Settings. Remind them `config.toml` only changes the live
  project after `supabase config push`.
- **C5:** add `.range()` pagination to large list queries.
- **C6:** give the dashboard path for CAPTCHA (Settings → Authentication →
  Bot and Abuse Protection → Enable CAPTCHA protection), or suggest turning
  anonymous sign-ins off if they're unused.
- **C7:** suggest a less frequent schedule, and show the new monthly count.
- **C8:** give each provider's billing or limits page, if the user names the
  service.

## Sources

Use these for the "Learn more" links:

- OWASP API4:2023 Unrestricted Resource Consumption: <https://api-security.owasp.org/editions/2023/en/0xa4-unrestricted-resource-consumption/>
- Supabase: Storage upload limits: <https://supabase.com/docs/guides/storage/uploads/file-limits>
- Supabase: JavaScript `limit()`: <https://supabase.com/docs/reference/javascript/limit>
- Supabase: Anonymous sign-ins: <https://supabase.com/docs/guides/auth/auth-anonymous>
- Supabase: CAPTCHA protection: <https://supabase.com/docs/guides/auth/auth-captcha>
- Supabase: Cron: <https://supabase.com/docs/guides/cron>
- Supabase: Scheduling Edge Functions: <https://supabase.com/docs/guides/functions/schedule-functions>
- Supabase: Spend cap: <https://supabase.com/docs/guides/platform/cost-control>
- Supabase CLI config reference: <https://supabase.com/docs/guides/local-development/cli/config>
