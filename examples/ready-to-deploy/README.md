# Ready to deploy example

This folder shows what the
[`ready-to-deploy`](../../skills/ready-to-deploy/SKILL.md) skill produces.
It has no broken project of its own, because the skill runs the other five
audits plus all nine checklists, and the other example folders already have
planted problems for it to find.

| File | What it is |
| --- | --- |
| [`SAMPLE-GO-LIVE-REPORT.md`](SAMPLE-GO-LIVE-REPORT.md) | A sample of the `GO-LIVE-REPORT.md` file the skill saves (with your permission), for a made-up app that's nearly ready |

## Try it

1. Install the skills (see [`skills/README.md`](../../skills/README.md)).
2. Open Claude Code in one of the broken examples, for example
   [`examples/supabase-auth-misconfig`](../supabase-auth-misconfig/).
3. Ask: *"Am I ready to launch?"*
4. Tell it the app is an internal tool, and answer its other questions as
   if it were your app. It should give a 🔴 **Not ready yet** verdict,
   because `auth-check` finds three 🔴 problems with how the app checks who's
   signed in (compare with that folder's
   [`EXPECTED-REPORT.md`](../supabase-auth-misconfig/EXPECTED-REPORT.md)).
   Try [`examples/leaky-secrets`](../leaky-secrets/) too: there it should
   stop early and tell you to rotate the leaked keys first.

Then try it on your own project. Run it again after fixing things: it reads
your last `GO-LIVE-REPORT.md` and shows what's changed.
