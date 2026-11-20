# Expected report

What the [`cost-trap-check`](../../skills/cost-trap-check/SKILL.md) skill
should find in this example. The wording will vary from run to run, but the
findings and their colours should match.

## Summary

**2 things to fix now, 5 to check, 1 to ask about.**

| Check | Result | Meaning |
| --- | --- | --- |
| C1 Paid calls in a loop | 🔴 Fix now | `summarise` makes one paid AI call per item, with no cap on items |
| C2 Public endpoint calling a paid API | 🔴 Fix now | `summarise` has no sign-in check and no rate limit |
| C3 No per-user rate limit | 🟡 Check this | `send-code` checks sign-in, but one user can send unlimited SMS |
| C4 Upload size | 🟡 Check this | `file_size_limit` is raised to 5 GiB |
| C5 Large list queries | 🟡 Check this | `max_rows` is 100,000, and `src/orders.js` asks for every order |
| C6 Anonymous sign-ins | 🟡 Check this | On; the skill should ask whether a CAPTCHA is turned on |
| C7 Scheduled jobs | 🟡 Check this | `summarise` runs every minute: about 43,000 runs a month |
| C8 Spend caps and alerts | ⚪ Ask | The skill should ask about the AI and SMS providers |

`src/products.js` should be mentioned as done right: it pages through results
50 at a time with `.range()`.

## Paid services found

| Service | Where it's called | What triggers it | Limit in place |
| --- | --- | --- | --- |
| AI API | `summarise/index.ts` | Anyone calling the function, plus the every-minute schedule | None |
| SMS | `send-code/index.ts` | Any signed-in user | Sign-in only |

## What to do next

1. Set a monthly spend limit with the AI provider and the SMS provider today.
2. Require sign-in in `summarise`, and cap how many items one request can
   send.
3. Add per-user rate limits to `summarise` and `send-code`.
4. Run the schedule less often (hourly is about 720 runs a month).
5. Lower `max_rows` and `file_size_limit`, add `.range()` to `listAllOrders`,
   and confirm CAPTCHA is on for anonymous sign-ins.
