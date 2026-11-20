# Costs

**Last verified:** 2026-11-20

**Who this is for:** Anyone with a card attached to a database, host, email or AI service, which is anyone with a live app.
**When to do it:** Before launch, and again whenever you add a paid service or upgrade a plan.

Most modern services charge partly by **[usage](../glossary.md#usage-based-pricing)**:
the more requests, storage or AI tokens you use, the more you pay. That's
great when you're small, and dangerous when a bug, a bot or a leaked key uses
far more than you expected. This checklist is about making sure a bad day
costs you a bad day, not a bad year.

## If you only do three

1. **[Set spending limits everywhere you can](#turn-on-spend-caps-where-they-exist).** OWASP: "Configure spending limits for all service providers/API integrations."
2. **[Remember that an alert is not a cap](#set-budget-alerts-and-know-theyre-not-caps).** An email at 2am doesn't stop the meter.
3. **[Rate-limit anything that costs you per use](#rate-limit-anything-that-costs-you-per-use).** SMS, email and AI calls are the classic runaway bills.

## Track your progress

Copy this list into a GitHub issue in your own repo to get boxes you can tick.

```markdown
- [ ] I know what each service charges for, and whose card pays
- [ ] I know that every extra project or branch can cost money
- [ ] Spend caps are on wherever they exist
- [ ] My AI API accounts have monthly spend limits
- [ ] Budget alerts are set where caps don't exist
- [ ] Anything that costs per use (SMS, email, AI) is rate-limited
- [ ] Uploads and list sizes have maximums
- [ ] Anonymous sign-ups are protected by a CAPTCHA
- [ ] I'd rotate a leaked key immediately
- [ ] Unused projects are backed up and deleted
```

## Know your bill

### Know what each service charges for

- **What:** For each service on your [services list](00-before-you-start.md#write-down-every-service-your-app-depends-on), write down the fixed monthly price, what usage it charges for, and whose card pays.
- **Why it matters:** Supabase, for example, bills paid plans as "a fixed subscription fee based on your chosen plan and variable usage fees". The fixed part is predictable. The usage part is where surprises come from.
- **How to check:** Open each service's billing or usage page. You can say roughly what you paid last month, and why.
- **Learn more:** [Supabase: About billing](https://supabase.com/docs/guides/platform/billing-on-supabase)

### Know that every extra project can cost money

- **What:** Test projects, preview branches and forgotten experiments can each carry their own monthly charge.
- **Why it matters:** Supabase warns: "Each project you launch increases your monthly Compute costs", which is charged "independent of your database usage". An idle project still costs money.
- **How to check:** List every project in each paid account. For each one, ask "do we still need this?"
- **Learn more:** [Supabase: About billing](https://supabase.com/docs/guides/platform/billing-on-supabase)

## Caps and alerts

### Turn on spend caps where they exist

- **What:** A **[spend cap](../glossary.md#spend-cap)** stops or limits a service when your usage reaches a set amount, instead of charging you more.
- **Why it matters:** Supabase says its spend cap protects you from high usage caused by "system attacks or bugs in your software". It's available on the Pro plan. But it doesn't cover everything: compute and other add-ons you've chosen are excluded.
- **How to check:** In Supabase, open your organisation's billing settings and confirm the spend cap is on. Note which usage items it covers. Do the same for every other service that offers a cap.
- **Learn more:** [Supabase: Spend cap](https://supabase.com/docs/guides/platform/cost-control) · [OWASP API4:2023 Unrestricted Resource Consumption](https://api-security.owasp.org/editions/2023/en/0xa4-unrestricted-resource-consumption/)

### Put a monthly spend limit on AI API accounts

- **What:** If your app calls an AI model, set a monthly spend limit in the provider's console.
- **Why it matters:** Every AI call costs money, and a loop or an abuser can make thousands of them. Anthropic lets you "set your own spend limit below your tier's cap to control costs". OpenAI recommends "setting spend limits for your organization or projects to control monthly API spend".
- **How to check:** In each AI provider's console, find the spend or usage limits page and confirm a limit you could afford to lose is set.
- **Learn more:** [Anthropic: Rate and spend limits](https://platform.claude.com/docs/en/api/rate-limits) · [OpenAI: Rate limits and spend](https://developers.openai.com/api/docs/guides/rate-limits)

### Set budget alerts, and know they're not caps

- **What:** Where a service can't cap spending, set a **[budget alert](../glossary.md#budget-alert)** that emails you when spending passes an amount.
- **Why it matters:** An alert only tells you. It doesn't stop anything. Google Cloud warns that an alerts-only budget "doesn't automatically cap" usage, and Vercel says "setting a budget does not stop usage on its own". To actually stop costs, turn on Vercel's **Pause production deployments** option. Even then, Vercel's checks "are not continuous" and can trigger "several minutes after" you reach the budget.
- **How to check:** Every usage-billed service has either a cap or an alert, and for each one you know which it is.
- **Learn more:** [Vercel: Spend management](https://vercel.com/docs/spend-management) · [Google Cloud: Budgets and budget alerts](https://docs.cloud.google.com/billing/docs/how-to/budgets)

## Runaway-bill traps

### Rate-limit anything that costs you per use

- **What:** **[Rate limiting](../glossary.md#rate-limiting)** caps how often one person or bot can do something, such as request a password-reset SMS or call your AI feature.
- **Why it matters:** OWASP describes an app where an attacker triggered an SMS-sending flow "tens of thousands of times", costing the company "thousands of dollars in a matter of minutes". Anything you pay for per use, like SMS, email or AI tokens, is a target.
- **How to check:** For each feature that costs you money per use, you can say what stops one user from triggering it 10,000 times.
- **Learn more:** [OWASP API4:2023 Unrestricted Resource Consumption](https://api-security.owasp.org/editions/2023/en/0xa4-unrestricted-resource-consumption/)

### Put maximums on uploads and lists

- **What:** Set a maximum upload size, and a maximum number of records any one request can return.
- **Why it matters:** OWASP recommends limits on "maximum upload file size" and "the number of records to be returned". Without them, one request can fill your storage or download your whole database, and you pay for the storage and the data transfer.
- **How to check:** Try uploading a very large file and requesting a huge page of results. Both should be refused.
- **Learn more:** [OWASP API4:2023 Unrestricted Resource Consumption](https://api-security.owasp.org/editions/2023/en/0xa4-unrestricted-resource-consumption/)

### Protect anonymous sign-ups with a CAPTCHA

- **What:** If your app lets people try it without an account (anonymous sign-ins), add a CAPTCHA.
- **Why it matters:** Supabase warns that "bad actors can abuse the endpoint to increase your database size drastically", and it "strongly recommends" CAPTCHA or Cloudflare Turnstile. Database size is billed.
- **How to check:** If anonymous sign-ins are on, a CAPTCHA is on too. The [`auth-check`](../skills/auth-check/SKILL.md) skill checks this.
- **Learn more:** [Supabase: Anonymous sign-ins](https://supabase.com/docs/guides/auth/auth-anonymous)

### Treat a leaked key as a leaked credit card

- **What:** If a secret API key leaks, anyone can run up charges on your account. Revoke and replace it straight away.
- **Why it matters:** OWASP: when secrets are "potentially compromised, you must securely revoke them". A leaked AI or cloud key is spent at the attacker's pace, on your bill.
- **How to check:** You know where to rotate each paid service's keys. See the [security checklist](01-security.md#if-a-key-leaks-rotate-it-first).
- **Learn more:** [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

### Clean up what you don't use, after backing it up

- **What:** Delete projects, branches and services you've stopped using.
- **Why it matters:** Idle projects still cost money. But on Supabase, deleting a project also deletes its backups, so take a copy first.
- **How to check:** Your services list matches what you're paying for. Before deleting anything, follow the [data checklist's warning about deleting projects](02-data.md#know-that-deleting-a-project-deletes-its-backups).
- **Learn more:** [Supabase: About billing](https://supabase.com/docs/guides/platform/billing-on-supabase)

## Further reading

- [OWASP API4:2023 Unrestricted Resource Consumption](https://api-security.owasp.org/editions/2023/en/0xa4-unrestricted-resource-consumption/)
- [Supabase: Spend cap](https://supabase.com/docs/guides/platform/cost-control)
- [Vercel: Spend management](https://vercel.com/docs/spend-management)
- [Google Cloud: Budgets and budget alerts](https://docs.cloud.google.com/billing/docs/how-to/budgets)
