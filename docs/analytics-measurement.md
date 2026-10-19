# Website measurement

GA4 property: `510902401`; web stream: `12366257791`; measurement ID: `G-F7F28TQPBP`.

| Event | Meaning | Key event |
| --- | --- | --- |
| `page_view` | Google's automatic page/history view | No |
| `speaking_inquiry` | The inquiry API accepted the request and sent both emails | Yes |
| `newsletter_signup` | Mailchimp confirms a new subscribed contact in Ian's topic group | Yes |
| `booking_open` | Visitor follows a Google Calendar booking link | No — this is intent, not a booking |

The bootstrap queue runs before hydration; the external Google library loads after interaction readiness. Early commands stay queued. Page location is the actual full URL, including campaign tags; section labels use `form_location`. No form name, email, phone or message is passed to Analytics by these flows.

Newsletter signup uses the existing Mailchimp audience and Ian topic group directly. The former Make scenario (`4375186`, hook `2499047`) is inactive and invalid. A webhook acknowledgment was not evidence of an active subscriber. Existing subscribed contacts return `newSignup: false`; failed writes do not return success. Optional welcome mail uses the existing Resend connection, and signup data is not logged.

## Verification

Run `node --test tests/analytics.test.mjs tests/newsletter-signup.test.mjs tests/speaking-inquiry.test.mjs`, TypeScript, targeted lint and the production build.

For live checks, use a distinct self-addressed test alias and a URL with `utm_source=analytics_verification&utm_medium=qa&utm_campaign=20261019&analytics_test=qa20261019`. The last parameter enables GA debug mode and labels custom events with `test_run_id`; it does not fabricate success. Check one event per successful action, full page URL, confirmation email, and the actual Mailchimp member. Repeat the same newsletter email: no new signup event should fire. Invalid/failed submissions must not fire success events.

Google Calendar is a separate origin. A completed appointment cannot be inferred from the website click. Verify an actual test booking in Calendar and remove that test booking afterward. Counting confirmed appointments in GA4 requires a separate Calendar-to-GA server integration with explicit source matching; do not mark `booking_open` as a conversion or represent it as a completed booking.
