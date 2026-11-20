# Monitoring

**Last verified:** 2026-11-20

**Who this is for:** Anyone with real users, because something will break, and you want to hear about it before they do.
**When to do it:** Before launch. Logs and alerts only help if they were switched on *before* the problem happened.

Monitoring answers three questions: is my app up, is it throwing errors, and
what happened when something went wrong? OWASP puts it simply: "Without
logging and monitoring, attacks and breaches cannot be detected."
[OWASP Top 10:2025 A09](https://top10.owasp.org/2025/A09_2025-Security_Logging_and_Alerting_Failures/)

## If you only do three

1. **[Turn on error tracking](#track-errors-automatically).** You'll see crashes your users never report.
2. **[Know how long your logs are kept](#know-where-your-logs-are-and-how-long-theyre-kept).** On some free plans, it's one hour.
3. **[Check your app from the outside](#check-your-app-from-the-outside).** "Is it up?" should be answered by a robot, not a customer.

## Track your progress

Copy this list into a GitHub issue in your own repo to get boxes you can tick.

```markdown
- [ ] I know where each service's logs are, and how long they're kept
- [ ] My app logs sign-ins, failed sign-ins and permission failures
- [ ] My logs never contain passwords, keys, tokens or personal data
- [ ] Error tracking is on
- [ ] Error tracking scrubs sensitive data
- [ ] An outside check tells me if my app goes down
- [ ] My alerts are few, and each one needs action
- [ ] I'm notified when a deploy or CI run fails
- [ ] I'm subscribed to my providers' status pages
```

## Logs

A **[log](../glossary.md#log)** is a timestamped record of what your app and
its services did: requests, errors, sign-ins.

### Know where your logs are, and how long they're kept

- **What:** For each service, find its logs and check how long it keeps them.
- **Why it matters:** Logs vanish faster than you'd expect. Supabase keeps API and database logs for 1 day on Free, 7 days on Pro and 28 days on Team. Vercel keeps runtime logs for just 1 hour on Hobby and 1 day on Pro. If a user reports a problem from last week, the evidence may already be gone.
- **How to check:** Open the logs page in each dashboard and note the retention. If you need more, Supabase can send ("drain") logs to longer-term storage.
- **Learn more:** [Supabase: Logs](https://supabase.com/docs/guides/telemetry/logs) · [Vercel: Runtime logs](https://vercel.com/docs/logs/runtime) · [Supabase: Log drains](https://supabase.com/docs/guides/telemetry/log-drains)

### Log the events that matter

- **What:** Make sure your app records sign-ins, failed sign-ins, permission failures and rejected input.
- **Why it matters:** OWASP says to always log "authentication successes and failures", "authorization (access control) failures" and "input validation failures". Failed sign-ins are the early warning of someone guessing passwords.
- **How to check:** Sign in with a wrong password, then find that attempt in your logs. If you can't, it isn't being recorded.
- **Learn more:** [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

### Never log secrets or personal data

- **What:** Keep passwords, API keys, tokens, database connection strings and personal details out of your logs.
- **Why it matters:** Logs are copied, exported and read by more people and tools than your database. OWASP lists "authentication passwords", "database connection strings", "encryption keys and other primary secrets", "access tokens" and sensitive personal data as things that should not go into logs as they are.
- **How to check:** Search your code for `console.log` (or your language's equivalent) near passwords, tokens or user records. Look through a day of real logs for anything that looks like a key or an email address.
- **Learn more:** [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

## Errors

### Track errors automatically

- **What:** Add an **[error tracking](../glossary.md#error-tracking)** service. It catches crashes in your app (in the browser and on the server) and groups them, so you see each problem once, with how often it happens.
- **Why it matters:** Most users don't report bugs; they just leave. Sentry, one such tool, "automatically captures unhandled exceptions and groups similar errors into issues", with the details needed to fix them.
- **How to check:** Trigger a test error on purpose, and confirm it shows up in your error tracker within a minute or two.
- **Learn more:** [Sentry: Product overview](https://docs.sentry.io/product/)

### Scrub sensitive data before it leaves your app

- **What:** Configure your error tracker so personal data and secrets are removed before errors are sent.
- **Why it matters:** An error report can include whatever was on screen or in the request. Sentry's own advice is to "ensure sensitive data either never reaches the Sentry servers, or at the very least it doesn't get stored", including personal data "such as a user's name or email address".
- **How to check:** Look at a few real error reports. You shouldn't see passwords, tokens, emails or names in them. If you do, turn on scrubbing.
- **Learn more:** [Sentry: Scrubbing sensitive data](https://docs.sentry.io/platforms/javascript/data-management/sensitive-data/) · [Sentry: Data scrubbing](https://docs.sentry.io/security-legal-pii/scrubbing/)

## Uptime and alerts

### Check your app from the outside

- **What:** Use an **[uptime monitor](../glossary.md#uptime-monitoring)**: a service that visits your app every few minutes from the internet, just like a user, and alerts you if it fails.
- **Why it matters:** Google's site reliability guide calls this "black-box monitoring": "testing externally visible behavior as a user would see it". It catches what your own logs can't, such as your app being completely unreachable.
- **How to check:** You get an alert within minutes when your app goes down. Test it once by pointing the monitor at a page that doesn't exist.
- **Learn more:** [Google SRE book: Monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/)

### Keep alerts few and actionable

- **What:** Send **[alerts](../glossary.md#alert)** to a person only when something needs doing now. Everything else goes to a dashboard or a weekly email.
- **Why it matters:** Too many alerts teach you to ignore them. Google's SRE guide warns that people "second-guess, skim, or even ignore incoming alerts", and that "every page should be actionable". OWASP adds that "without alerting it is very difficult to respond quickly".
- **How to check:** For each alert you get, you can say what you'd do about it. If the answer is "nothing", turn it off or downgrade it.
- **Learn more:** [Google SRE book: Monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/) · [OWASP Top 10:2025 A09](https://top10.owasp.org/2025/A09_2025-Security_Logging_and_Alerting_Failures/)

### Get told when a deploy or CI run fails

- **What:** Turn on notifications for failed workflow runs and deploys.
- **Why it matters:** A silent failed deploy means your fix never went live. With GitHub Actions notifications on, you're told when a workflow you triggered completes, including when it fails.
- **How to check:** Your GitHub notification settings have Actions turned on, and your host emails you about failed deploys.
- **Learn more:** [GitHub: Notifications for workflow runs](https://docs.github.com/en/actions/concepts/workflows-and-actions/notifications-for-workflow-runs) · [CI/CD checklist](04-ci-cd.md)

### Subscribe to your providers' status pages

- **What:** Most services publish a **[status page](../glossary.md#status-page)** showing outages, and you can subscribe to updates.
- **Why it matters:** When your app breaks, the first question is "is it us or them?" Supabase's status page, for example, offers "Subscribe to updates".
- **How to check:** You're subscribed to the status pages of every service on your [services list](00-before-you-start.md#write-down-every-service-your-app-depends-on).
- **Learn more:** [Supabase status](https://status.supabase.com/)

For logs of *who changed what* in your accounts, see
[Governance: Know where your audit logs are](08-governance.md#know-where-your-audit-logs-are).

## Further reading

- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [Google SRE book: Monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [OWASP Top 10:2025 A09: Security Logging and Alerting Failures](https://top10.owasp.org/2025/A09_2025-Security_Logging_and_Alerting_Failures/)
- [Supabase: Logs](https://supabase.com/docs/guides/telemetry/logs)
