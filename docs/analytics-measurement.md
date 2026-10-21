# Website measurement

GA4 property: `510902401`; web stream: `12366257791`; measurement ID: `G-F7F28TQPBP`.

| Event | Meaning | Key event |
| --- | --- | --- |
| `page_view` | Google's automatic page/history view | No |
| `speaking_inquiry` | The inquiry API accepted the request and sent both emails | Yes |
| `newsletter_signup` | Mailchimp confirms a new subscribed contact in Ian's topic group | Yes |
| `booking_open` | Visitor follows a Google Calendar booking link | No — this is intent, not a booking |
| `disruptiv_visit` | Visitor follows a Disruptiv project, work, or case-study link | No — this is a handoff |
| `generate_lead` | Disruptiv confirms a saved project/video enquiry | Yes |

## Ian → Disruptiv journey

From October 19, 2026, the same stream (`G-F7F28TQPBP`) also runs on the public Disruptiv website. Both sites configure Google's supported `linker` before the tag's `js`/`config` commands, with `ianmcdonald.ai` and `disruptiv.solutions` as linked domains and incoming links accepted. This also covers their `www` hosts. Google decorates links with `_gl` to preserve the anonymous user and session across the handoff. Do not add internal UTM parameters: these would replace the original campaign attribution.

Use **Hostname** to separate personal-site traffic from Disruptiv traffic in this shared property. The existing personal-site traffic report already filters the Ian hostname. Disruptiv's existing `G-NB7QTC7G75` destination continues receiving its own traffic and saved-lead events.

For a funnel, use `disruptiv_visit` → `page_view` where Hostname is `www.disruptiv.solutions` → `generate_lead`. Use an indirectly-followed sequence to allow visitors to browse work before submitting. Break down by Session source / medium to see the original acquisition source. Link placement is `link_location` (`home_v2_hero`, `home_v2_project`, or `home_v2_footer`); destination is `link_url`. Lead form is `form_name` (`contact` or `video_quote`). Register these event parameters as custom dimensions when using them in processed reports.

`generate_lead` fires only after the existing inquiry API confirms that the enquiry was saved. Failed, blocked, pending and unconfirmed submissions do not count. Retries of the same submission do not emit another event in the mounted form. Names, emails, websites and messages are not sent with the lead event.

Verify a real browser click: `_gl` must be present on arrival, and network requests to the shared measurement ID must retain the same `cid` and `sid` on both websites. Complete one clearly labeled self-addressed QA inquiry, then check `generate_lead` in GA4 DebugView/Realtime. The event in Analytics is anonymous; the saved inquiry/receipt is verified separately. Do not infer a saved inquiry from `form_submit` or a button click. New journey data is prospective; it cannot repair historical cross-domain attribution.

The bootstrap queue runs before hydration; the external Google library loads after interaction readiness. Early commands stay queued. Page location is the actual full URL, including campaign tags; section labels use `form_location`. No form name, email, phone or message is passed to Analytics by these flows.

Newsletter signup uses the existing Mailchimp audience and Ian topic group directly. The former Make scenario (`4375186`, hook `2499047`) is inactive and invalid. A webhook acknowledgment was not evidence of an active subscriber. Existing subscribed contacts return `newSignup: false`; failed writes do not return success. Optional welcome mail uses the existing Resend connection, and signup data is not logged.

## Verification

Run `node --test tests/analytics.test.mjs tests/newsletter-signup.test.mjs tests/speaking-inquiry.test.mjs`, TypeScript, targeted lint and the production build.

For live checks, use a distinct self-addressed test alias and a URL with `utm_source=analytics_verification&utm_medium=qa&utm_campaign=20261019&analytics_test=qa20261019`. The last parameter enables GA debug mode and labels custom events with `test_run_id`; it does not fabricate success. Check one event per successful action, full page URL, confirmation email, and the actual Mailchimp member. Repeat the same newsletter email: no new signup event should fire. Invalid/failed submissions must not fire success events.

Google Calendar is a separate origin. A completed appointment cannot be inferred from the website click. Verify an actual test booking in Calendar and remove that test booking afterward. Counting confirmed appointments in GA4 requires a separate Calendar-to-GA server integration with explicit source matching; do not mark `booking_open` as a conversion or represent it as a completed booking.
