# Find Leads project inquiries

The optional form on `/learn/find-leads` posts name, email, one of four interests, and optional project details to `/api/project-inquiry`. Lesson resources remain available without submitting the form.

The route sends one Resend notification to `ALERT_EMAIL` (default `ian@ianmcdonald.ai`), from `RESEND_FROM` (default `Ian McDonald <ian@ianmcdonald.ai>`), using `RESEND_API_KEY`. The visitor's email is the reply-to address. The message identifies the Find Leads resource page as its source. No confirmation email, newsletter subscription, or CRM record is created.

Vercel BotID Basic protects the route in both client instrumentation and server verification. Same-origin JSON requests are required. Bot detection and verification failures stop before sending. Name, email, interest, and note lengths are validated; malformed JSON returns 400, and all visitor-controlled HTML is escaped. Submission succeeds only when Resend returns a message ID. This confirms provider acceptance, not inbox delivery.

Run `node --test tests/project-inquiry.test.mjs` for mocked validation, BotID, mail-routing, escaping, and provider-failure coverage. These tests send no email. BotID bypasses local development by design, so verify browser submission on a deployment with an operator-controlled address and clearly labeled test details. A direct POST without a browser challenge should be rejected on Vercel. Never include name, email, or project details in analytics events.
