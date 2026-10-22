# Animated GIF Workshop

Public lesson: `/learn/animated-gifs`.

The original examples were created in Codex. On October 21, 2026, Ian tested the same skill in Gemini on desktop: attaching the Gemini-ready ZIP in a chat imported and activated the skill. The conversation then generated a 3×3 crane sprite sheet and returned GIF, WebP, still, review, and reproducible source ZIP outputs. The private conversation and account details are not public lesson dependencies.

The desktop section teaches that observed upload/import/confirm path, followed by reference artwork and a motion prompt. The original generic-agent download and install prompt remain available. Public wording follows Ian's approved statement:

> I created the original examples in Codex. I also successfully tested the shared Animated GIF Workshop skill in Gemini on desktop, where it generated the artwork and assembled the finished GIF.

## Gemini-ready archive

`public/skills/animated-gif-workshop-gemini-1.0.0.zip` is the exact archive used in the successful test, with SHA-256 `60cd50ce7c0e3757d73358b0aaf2098e56323bc6a7dfbbbe30d5cb58245b7501`.

It contains unchanged v1.0.0 source files, with `SKILL.md` at the archive root:

- `SKILL.md`
- `references/frame-prompts.md`
- `references/assembly.md`
- `scripts/assemble.py`

Repackage those four files from `skills/animated-gif-workshop/` without an outer folder to reproduce this structure. The helper uses Python and Pillow and makes no API calls. The original generic archive keeps its existing folder structure and download URL.

Google's documented skill upload requirements and optional Skills-page route: https://support.google.com/gemini/answer/17094296?hl=en . Tool and image-generation availability depend on the learner's session/account.
