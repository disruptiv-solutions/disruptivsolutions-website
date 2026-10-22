# Project inquiries

The forms on `/contact` and `/learn/find-leads` share `ProjectInquiryForm` and post name, email, one of four interests, optional project details, and a source to `/api/project-inquiry`. The source is `contact` for the general contact page and `find_leads` for the lesson form. The API rejects values outside that allowlist; omitted source defaults to `find_leads` for compatibility with the original form. Lesson resources remain available without submitting the form.

The route sends one Resend notification to `ALERT_EMAIL` (default `ian@ianmcdonald.ai`), from `RESEND_FROM` (default `Ian McDonald <ian@ianmcdonald.ai>`), using `RESEND_API_KEY`. The visitor's email is the reply-to address. The message identifies the appropriate contact or Find Leads page as its source, using a server-defined label and URL. No confirmation email, newsletter subscription, or CRM record is created.

Successful submissions emit the existing `generate_lead` analytics event with `form_name: project_inquiry`, the allowlisted source as `form_location`, and the selected interest. No visitor name, email, or project details are included. Contact-page success links to `/learn`; lesson-form success links back to the lesson steps.

Vercel BotID Basic protects the route in both client instrumentation and server verification. Same-origin JSON requests are required. Bot detection and verification failures stop before sending. Name, email, interest, and note lengths are validated; malformed JSON returns 400, and all visitor-controlled HTML is escaped. Submission succeeds only when Resend returns a message ID. This confirms provider acceptance, not inbox delivery.

Run `node --test tests/project-inquiry.test.mjs` for mocked validation, BotID, mail-routing, escaping, and provider-failure coverage. These tests send no email. BotID bypasses local development by design, so verify browser submission on a deployment with an operator-controlled address and clearly labeled test details. A direct POST without a browser challenge should be rejected on Vercel. Never include name, email, or project details in analytics events.
