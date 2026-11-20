# Infrastructure

**Last verified:** 2026-11-20

**Who this is for:** Anyone putting an app on its own web address and sending email from it, whether that's sign-up confirmations, password resets or newsletters.
**When to do it:** Before launch. Email especially: if this isn't set up, your users' sign-up emails may never arrive.

This checklist covers the plumbing between your app and the outside world:
your domain, the secure connection to it, and the email it sends.

## If you only do three

1. **[Set up your own email sending before launch](#set-up-your-own-email-sending-before-launch).** Supabase's built-in email isn't meant for real users.
2. **[Authenticate your email with SPF, DKIM and DMARC](#authenticate-your-email-with-spf-and-dkim).** Gmail and Yahoo require it.
3. **[Serve everything over HTTPS](#serve-everything-over-https).** No exceptions.

## Track your progress

Copy this list into a GitHub issue in your own repo to get boxes you can tick.

```markdown
- [ ] My app is on my own domain, and I know where its DNS is managed
- [ ] My domain registrar account is protected (see the governance checklist)
- [ ] Every page is served over HTTPS
- [ ] HSTS is on, starting with a short max-age
- [ ] Basic security headers are set
- [ ] App emails go through my own email provider (custom SMTP)
- [ ] SPF and DKIM are set up for my sending domain
- [ ] A DMARC policy is published, starting with p=none
- [ ] Marketing email has one-click unsubscribe and low spam rates
```

## Domains and DNS

### Know where your domain's DNS is managed

- **What:** **[DNS](../glossary.md#dns)** is the internet's address book: it points your domain at your host and your email provider. Find out which company manages your **[DNS records](../glossary.md#dns-record)**: your registrar, your host, or a DNS service.
- **Why it matters:** Every change in this checklist is made there. Vercel's docs show it can be either place: if you use its nameservers you manage records in Vercel, and "otherwise, you must configure nameservers and DNS records through your domain registrar".
- **How to check:** You can log in to wherever your DNS is managed and see your records listed. Follow your host's own instructions for connecting a domain, rather than guessing.
- **Learn more:** [Vercel: Working with domains](https://vercel.com/docs/domains/working-with-domains) · [Cloudflare: DNS docs](https://developers.cloudflare.com/dns/)

### Protect the account that owns your domain

- **What:** Turn on auto-renew and MFA at your registrar, and keep its contact email on a different domain.
- **Why it matters:** Whoever controls the domain controls where your website and email go. This is covered in detail in the governance checklist.
- **How to check:** See [Governance: Protect your domain name](08-governance.md#protect-your-domain-name).
- **Learn more:** [ICANN SSAC: SAC 044](https://itp.cdn.icann.org/en/files/security-and-stability-advisory-committee-ssac-reports/sac-044-en.pdf)

## HTTPS and headers

### Serve everything over HTTPS

- **What:** **[HTTPS](../glossary.md#https)** encrypts the connection between your users and your app. Modern hosts set up and renew the certificate for you.
- **Why it matters:** Without it, logins and data travel in readable form. Certificates no longer need to be a chore: Let's Encrypt's goal is for servers to "automatically obtain browser-trusted certificates without any human intervention".
- **How to check:** Visit `http://` plus your domain. It should redirect to `https://`, and the browser should show no certificate warning.
- **Learn more:** [Let's Encrypt: How it works](https://letsencrypt.org/how-it-works/)

### Turn on HSTS, starting carefully

- **What:** **[HSTS](../glossary.md#hsts)** is a header that tells browsers your site "should only be accessed using HTTPS", so they never try the insecure version again.
- **Why it matters:** It closes the gap where a first visit over plain HTTP could be intercepted. But OWASP recommends starting with a short `max-age` "in case of mistakes during initial rollout", and warns that the `preload` option "can have PERMANENT CONSEQUENCES".
- **How to check:** Your site sends a `Strict-Transport-Security` header. Start with something like `max-age=86400`, and only consider `preload` once you're sure every subdomain works over HTTPS.
- **Learn more:** [MDN: Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security) · [OWASP: HSTS Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html)

### Set basic security headers

- **What:** **[Security headers](../glossary.md#security-headers)** are instructions your site sends with each page, telling the browser to be stricter. A good starting set from OWASP: `X-Content-Type-Options: nosniff` (stop browsers guessing file types) and `X-Frame-Options: DENY` (stop other sites showing your pages inside theirs, which is called clickjacking).
- **Why it matters:** They block whole classes of attack for one line of config each. A full **[Content Security Policy (CSP)](../glossary.md#content-security-policy-csp)** is stronger still, but OWASP notes it "is complex to configure and maintain", so treat it as a next step.
- **How to check:** Scan your live site with MDN's free HTTP Observatory and work through what it flags. Your host's docs explain where to set headers.
- **Learn more:** [OWASP: HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html) · [MDN: HTTP Observatory](https://developer.mozilla.org/en-US/observatory) · [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)

## Email

### Set up your own email sending before launch

- **What:** Connect your auth system to a real email provider through **[SMTP](../glossary.md#smtp)** (the standard way programs send email), sending from your own domain.
- **Why it matters:** Supabase's built-in email server "is not meant for production use". It only delivers to members of your project's team, so **real users won't get their sign-up or reset emails**, and it's limited to 2 messages per hour.
- **How to check:** In Supabase, open Authentication, then the SMTP settings, and confirm custom SMTP is configured. Then sign up with an email address outside your team and check the email arrives.
- **Learn more:** [Supabase: Send emails with custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)

### Authenticate your email with SPF and DKIM

- **What:** **[SPF](../glossary.md#spf)** and **[DKIM](../glossary.md#dkim)** are DNS records that prove emails "from" your domain really came from you. Your email provider gives you the exact records to add.
- **Why it matters:** Since 2024, Google requires all senders to Gmail to "set up SPF or DKIM email authentication", and Yahoo requires at least one of them too. Senders of 5,000 or more messages a day to Gmail need both. Unauthenticated email ends up in spam, or doesn't arrive.
- **How to check:** Your email provider's dashboard shows your domain as verified, with SPF and DKIM passing.
- **Learn more:** [Google: Email sender guidelines](https://support.google.com/mail/answer/81126) · [Yahoo: Sender best practices](https://senders.yahooinc.com/best-practices/)

### Publish a DMARC policy, starting with monitoring

- **What:** **[DMARC](../glossary.md#dmarc)** is a DNS record that tells inboxes what to do with email that fails SPF and DKIM checks, and can send you reports.
- **Why it matters:** Its goal is to let receivers "reject unauthenticated messages", which stops people sending fake email in your name. Google requires DMARC for bulk senders, and Yahoo "strongly urges all senders to publish a DMARC policy". Yahoo's bulk-sender rules accept starting "with at least p=none", a monitoring-only setting, plus a reporting address.
- **How to check:** Your domain has a `_dmarc` TXT record, starting at `p=none` with a reporting address (`rua`). Tighten it once the reports show your real email passing.
- **Learn more:** [DMARC.org: Overview](https://dmarc.org/overview/) · [Yahoo: Sender best practices](https://senders.yahooinc.com/best-practices/)

### Keep marketing email unsubscribable and low-complaint

- **What:** Marketing and newsletter emails need a one-click unsubscribe and a visible unsubscribe link. Keep spam complaints low.
- **Why it matters:** Google says senders must "keep spam rates reported in Postmaster Tools below 0.3%", and bulk senders' "marketing messages and subscribed messages must support one-click unsubscribe". High complaint rates hurt delivery of *all* your email, including password resets.
- **How to check:** Your marketing emails have a working unsubscribe link. If you send at volume, check Google Postmaster Tools for your spam rate.
- **Learn more:** [Google: Email sender guidelines](https://support.google.com/mail/answer/81126)

## Further reading

- [Google: Email sender guidelines](https://support.google.com/mail/answer/81126)
- [OWASP: HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [NCSC: Email security and anti-spoofing](https://www.ncsc.gov.uk/collection/email-security-and-anti-spoofing)
- [Supabase: Send emails with custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
