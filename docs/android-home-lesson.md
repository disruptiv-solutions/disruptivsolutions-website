# Public Android home-screen lesson

Canonical route: `/learn/android-home`. Listed on `/learn` as a free, public lesson.

The approved lesson source is the Android home-screen Site at commit `ddbd996`. Its five chapters, prompts, checklists, downloads and both interactive hero phones are preserved. The lesson uses the website’s normal header, footer and locally scoped styles. It has no account, email or ChatGPT access requirement. No source auth/runtime or private service credentials are included.

`lesson-content.ts` contains the sanitized public teaching markup. `lesson-runtime.js` scopes the original interactions to the lesson root, cleans up listeners/timers/observers on navigation, and keeps both phone frames mounted while switching. Notes and completion are stored in the current browser. The original Site’s saved state does not migrate between domains.

Both phone demos use sample data and local capture storage. They are browser examples, not proof of a new physical-device installation or live AgentOps transcription. The generic skill ZIP contains eight source/instruction files; it excludes APKs, SDKs and credentials. The existing 30-second square teaser is reused with a native, on-demand video player.

The project discussion destination is centralized in `discussion.ts`. The toolbar and contextual panel use the same link. The community discussion links back to the public lesson. A free community account is needed to post or reply; lesson access and downloads remain public. The shared generic invitation is omitted on this route because the lesson has its own project-specific invitation.

Discussion: https://www.launchbox.space/ianmcdonaldai/community?post=mcp_3c4014005747c497a1ba216fb04616ea855b467d442846f3853f59ef3648ac7f

Validation: both phone switches and drawers, a local sample capture, prompt-copy acknowledgement, note/progress persistence after reload, mobile Contents menu and dismissal, public download byte checks, video range delivery, canonical metadata and the Learn card. Existing website tests and targeted lint also run before release. No real device connection or microphone permission was requested for this website release.
