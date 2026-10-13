# Speaking inquiry protection

Both speaking forms post to `/api/speaking-inquiry`. Vercel BotID Basic initializes in `src/instrumentation-client.ts`, and the route verifies each request before reading the inquiry or sending either notification or confirmation email. Same-origin JSON requests are required. Detected bots receive 403; verification errors receive 503 with a direct-email fallback. No bot-verification failure falls through to email sending.

Basic is explicitly selected in both client and server; this does not enable paid Deep Analysis. Local development bypasses BotID by design, so deployment verification is required. Test a request without a browser challenge on Vercel, then test the actual browser form with an operator-controlled email address.

Run `node --test tests/speaking-inquiry.test.mjs` and `npm run build`. Tests mock both BotID and Resend and send no real emails.
