# Privacy

**Last verified:** 2026-11-20

**Who this is for:** Anyone whose app stores anything about a person: an email address, a name, a sign-in record, a chat message.
**When to do it:** Before launch. Retrofitting a privacy policy is easy; retrofitting a way to find and delete one person's data is not.

> **This is not legal advice.** Privacy law depends on where you are and where
> your users are. This checklist uses the EU and UK GDPR as the worked example,
> because it's the most widely documented and one of the strictest. Check the
> law that applies to you, and get professional advice if you handle sensitive
> data.

Privacy comes down to four habits: know what personal data you have, keep
less of it, be honest about it, and be able to hand it over or delete it when
someone asks.

## If you only do three

1. **[List the personal data you collect](#list-the-personal-data-you-collect).** You can't protect, explain or delete what you haven't found.
2. **[Publish a privacy notice that matches reality](#publish-a-privacy-notice-that-matches-reality).** Including every service you share data with.
3. **[Be able to delete one person's data](#be-able-to-find-and-delete-one-persons-data).** Under the GDPR, you have one month to answer.

## Track your progress

Copy this list into a GitHub issue in your own repo to get boxes you can tick.

```markdown
- [ ] I've listed the personal data my app collects, where it's stored, and why
- [ ] I only collect what I actually need, and delete what I no longer need
- [ ] I know which privacy laws apply to me
- [ ] My privacy notice says what I collect, why, how long I keep it, and who I share it with
- [ ] Non-essential cookies and analytics wait for consent (where the law requires it)
- [ ] I know which of my services are processors, and I've accepted their DPAs
- [ ] My database region matches what I promise users
- [ ] I know whether my AI provider trains on what my app sends it
- [ ] I can export and delete one person's data, including in other services
- [ ] I know when a breach must be reported, and to whom
```

## Know your data

**[Personal data](../glossary.md#personal-data)** is any information about an
identifiable person. The UK GDPR's definition names "a name, an
identification number, location data, an online identifier" as examples. So
email addresses, user IDs, IP addresses and chat messages all count.

### List the personal data you collect

- **What:** For each kind of personal data, write down what it is, where it's stored (which table, which service), why you need it, and how long you keep it.
- **Why it matters:** Every other item depends on this list. Your privacy notice describes it, deletion requests are answered from it, and breach reports start with it. It also tends to surprise people: analytics tools, error trackers and AI APIs all receive personal data too.
- **How to check:** Start from your [services list](00-before-you-start.md#write-down-every-service-your-app-depends-on) and your database tables. For each, ask "could this identify a person?" Note that pseudonymised data, such as a user ID instead of a name, "remains personal data" under the GDPR.
- **Learn more:** [ICO: What is personal data?](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/personal-information-what-is-it/what-is-personal-data/what-is-personal-data/)

### Collect only what you need

- **What:** **[Data minimisation](../glossary.md#data-minimisation)** means collecting the least personal data that does the job, and deleting it when you no longer need it.
- **Why it matters:** Data you don't have can't leak, and doesn't need protecting or explaining. The ICO is blunt: "You must not collect personal data on the off-chance that it might be useful in the future." OWASP lists "Collection of Data Not Required for the User-Consented Purpose" among its top 10 privacy risks.
- **How to check:** For each field on your sign-up and profile forms, you can say why you need it. Do you really need a date of birth, a phone number, a full address? Set a reminder to review what you hold and delete what's no longer needed.
- **Learn more:** [ICO: Data minimisation](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/data-minimisation/) · [OWASP Top 10 Privacy Risks](https://owasp.org/projects/top-10-privacy-risks)

### Know which privacy laws apply to you

- **What:** Find out which laws cover you, based on where you are *and* where your users are.
- **Why it matters:** Laws can reach you from abroad. The GDPR applies to organisations outside the EU when they offer "goods/services (paid or for free) to individuals in the EU". It also applies to small businesses: an SME processing personal data "must comply with the GDPR", though some obligations are lighter. California's CCPA, by contrast, only applies to for-profit businesses above certain thresholds, such as revenue over $25 million or handling data on 100,000 or more California residents or households.
- **How to check:** You can name the laws that apply to you, and the regulator for each. If you're unsure, that's the point to get advice.
- **Learn more:** [European Commission: Data protection explained](https://commission.europa.eu/law/law-topic/data-protection/data-protection-explained_en) · [California Attorney General: CCPA](https://oag.ca.gov/privacy/ccpa)

## Tell people

### Publish a privacy notice that matches reality

- **What:** A **[privacy notice](../glossary.md#privacy-notice)** (often called a privacy policy) tells people what you collect, why, how long you keep it, and who you share it with.
- **Why it matters:** It's a legal requirement under the GDPR: you "must provide privacy information to individuals at the time you collect their personal data from them", in "clear and plain language". It's also a promise. If it says you don't share data but your app sends it to an analytics or AI service, the notice is wrong. You must also tell people about new uses "before you start the processing".
- **How to check:** Compare your notice with your data list. Every service that receives personal data is mentioned, and the notice is linked from your sign-up page. Update it whenever you add a service.
- **Learn more:** [ICO: The right to be informed](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/)

### Ask before setting non-essential cookies

- **What:** Cookies and similar tracking for analytics or advertising need consent before they're set, under UK and EU rules. Cookies your app needs to work, such as keeping someone signed in, are usually exempt.
- **Why it matters:** The ICO says "you cannot set non-essential cookies on your website's homepage before the user has consented to them", and that consent must be "more than simply continuing to use the website". The exemption covers cookies "essential to provide an online service at someone's request".
- **How to check:** Open your site in a private window and look at the cookies set before you click anything (your browser's developer tools show them). Only essential ones should be there.
- **Learn more:** [ICO: Cookies and similar technologies](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/)

## Third parties

### Know who's a processor, and accept their DPAs

- **What:** In GDPR terms you are usually the **[controller](../glossary.md#controller-and-processor)** (you decide why and how data is used), and services like your database host are **processors** (they handle data on your behalf). Processors offer a **[DPA](../glossary.md#data-processing-agreement-dpa)** (data processing agreement) that sets out how they treat your users' data.
- **Why it matters:** As controller, "you are responsible for complying with the UK GDPR". A processor "should only process personal data in line with a controller's instructions", and the DPA is where those instructions and protections are written down. Supabase, for example, publishes a Data Processing Addendum, which also covers its sub-processors.
- **How to check:** For each service on your data list, you know whether it's a processor and where its DPA is. Some providers apply it automatically through their terms; others ask you to sign it.
- **Learn more:** [ICO: Controllers and processors](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/controllers-and-processors/controllers-and-processors/what-are-controllers-and-processors/) · [Supabase: Data Processing Addendum](https://supabase.com/legal/customer-resources/data-processing-addendum)

### Choose where your data lives

- **What:** Your database region decides which country your users' data is stored in.
- **Why it matters:** Supabase says "the region you choose also determines where your primary project data is stored". Its "Europe" general region "includes London and Zurich, which are not EU member states", so pick a specific region if you need data to stay in one jurisdiction. Supabase also notes that "region selection is a data-location control, not proof of regulatory compliance".
- **How to check:** You know your project's region, and it matches anything your privacy notice or customer contracts promise.
- **Learn more:** [Supabase: Available regions](https://supabase.com/docs/guides/platform/regions)

### Know what your AI provider does with what you send it

- **What:** If your app sends user content to an AI model, that's personal data going to another processor. Check its data-usage terms.
- **Why it matters:** Your users didn't agree to their messages training someone else's model. The major APIs don't train on API data by default: Anthropic "will not use your inputs or outputs from our commercial products", and OpenAI says API data "is not used to train or improve OpenAI models (unless you explicitly opt in)". But data may still be kept for a while: OpenAI keeps abuse-monitoring logs "for up to 30 days" by default. Consumer chat apps can have different terms, so don't paste user data into them.
- **How to check:** For each AI service, you know whether it trains on your data and how long it keeps it, and your privacy notice mentions it.
- **Learn more:** [Anthropic: Is my data used for model training?](https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training) · [OpenAI: Your data](https://developers.openai.com/api/docs/guides/your-data)

## Users' rights

### Be able to find and delete one person's data

- **What:** When someone asks, you can find everything you hold about them, give them a copy, and delete it, across your database, file storage and every service on your data list.
- **Why it matters:** People have a right of access and a right to erasure (the "right to be forgotten"). For erasure, the ICO says you "must respond to a request for erasure without undue delay and at the latest within one month". Erasure reaches backups too: data that can't be removed at once must be put "beyond use" until the backup is overwritten. OWASP lists "Insufficient Deletion of User Data" and "Inability of Users to Access and Modify Data" among its top 10 privacy risks.
- **How to check:** Make a test account, use the app, then follow your own deletion steps. Afterwards, search your database and each service for that account. You should find nothing, except what you've documented a reason to keep. Write the steps down so you're not inventing them under a deadline.
- **Learn more:** [ICO: Right to erasure](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-to-erasure/) · [ICO: Right of access](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/right-of-access/) · [Data: Know what backups your plan includes](02-data.md#know-what-backups-your-plan-includes)

## When it goes wrong

### Know when a breach must be reported

- **What:** A **[personal data breach](../glossary.md#personal-data-breach)** is personal data being lost, stolen, or seen by someone who shouldn't see it. Some breaches must be reported to the regulator, and sometimes to the people affected.
- **Why it matters:** Under the UK GDPR, a reportable breach must go to the regulator "within 72 hours of becoming aware of the breach, where feasible". If it's likely to result in a high risk to people, "you must also inform those individuals without undue delay". If you decide a breach doesn't need reporting, "you need to be able to justify this decision, so you should document it". OWASP lists "Insufficient Data Breach Response" as a top privacy risk.
- **How to check:** Your [incident plan](08-governance.md#write-a-one-page-incident-plan) names your regulator, how to report to them, and the deadline.
- **Learn more:** [ICO: Personal data breaches](https://ico.org.uk/for-organisations/report-a-breach/personal-data-breach/personal-data-breaches-a-guide/)

Privacy also depends on items elsewhere in this list:
[Row Level Security](01-security.md#turn-on-row-level-security-for-every-table)
stops users reading each other's data, [made-up development
data](00-before-you-start.md#fill-your-development-database-with-made-up-data)
keeps real people out of test databases, and
[keeping personal data out of logs](05-monitoring.md#never-log-secrets-or-personal-data)
stops it spreading to places you'd forget to delete.

## Further reading

- [ICO: UK GDPR guidance and resources](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/)
- [European Commission: Data protection explained](https://commission.europa.eu/law/law-topic/data-protection/data-protection-explained_en)
- [OWASP Top 10 Privacy Risks](https://owasp.org/projects/top-10-privacy-risks)
- [OWASP User Privacy Protection Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/User_Privacy_Protection_Cheat_Sheet.html)
