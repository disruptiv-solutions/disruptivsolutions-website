export const skillUrl = 'https://raw.githubusercontent.com/disruptiv-solutions/disruptivsolutions-website/fe644f97b593ca94fe32198aa460a9d8d033925a/public/skills/animated-gif-workshop-1.0.0.zip';
export const skillSha256 = '6d0012359128bd8659940b075b4de44e2afed1040d28cbdab869d5d075c95c80';
export const geminiSkillUrl = '/skills/animated-gif-workshop-gemini-1.0.0.zip';

export const geminiImportPrompt = 'Import and activate the attached Animated GIF Workshop skill for this chat. Read its instructions and confirm when it is ready. Wait for my artwork and motion request before starting.';

export const geminiCreationPrompt = 'Use the Animated GIF Workshop skill with my attached artwork. Make a short looping animation that [describe one clear action]. Generate the in-between artwork, inspect the frames, and assemble the animation. Preserve the artwork’s character and keep the original unchanged. Show me the finished animation, then provide downloadable GIF, animated WebP, still PNG, and source files.';

export const installPrompt = `Help me create an animated GIF using Ian McDonald’s Animated GIF Workshop skill.

Download this skill ZIP:
${skillUrl}

Verify its SHA-256 is:
${skillSha256}

Inspect the archive paths, then extract its animated-gif-workshop folder into this project’s .agents/skills directory, or the skill location your agent supports. Do not replace a different existing skill without checking with me. If you do not support installed skills, keep the folder in this project and read its SKILL.md directly.

Read SKILL.md and the relevant references before starting. The included helper needs Python 3.10+ and Pillow. Use an available image-generation tool for the artwork; if you cannot generate images, give me the exact prompt and ask me for the resulting sheet. Do not silently switch to a paid API.

Help me make a short loop from my reference artwork. Use actual transformation poses, preserve the artwork’s character, inspect the extracted frames, and assemble a GIF with a clean return. Give me a WebP version, still preview, and reusable source files too. If I have not attached artwork yet, ask for it and what I want it to do.`;

export const steps = [
  {
    number: '01', title: 'Start with your actual artwork.',
    text: 'A logo, a little character, a paper crane. Give the agent the real image. If one image should become another, attach both. Tell it where the finished animation will appear.',
    prompt: 'Use the attached artwork as the reference. Make a small looping animation for [my website / a slide / an email]. The motion is [describe one clear action]. Preserve [the flat colors, distinctive shape, internal dark areas, and transparent background]. First inspect the image, then suggest a short sequence of poses. Keep the original file unchanged.',
    check: 'The plan describes your artwork and a specific action. The agent has the source image, not just the name of your brand.',
  },
  {
    number: '02', title: 'Make the in-between frames.',
    text: 'Ask the image tool for a sprite sheet: several poses in one image, arranged in order. Sixteen poses is a useful starting point for one transformation. Use more poses or several sheets when the movement needs them.',
    prompt: 'Create a static sprite sheet with 16 sequential poses in a 4 by 4 grid, read left to right, top to bottom. Use attached image A as the exact starting artwork and image B as the exact destination. Show [describe how the pieces change shape] through distinct intermediate poses. Keep a stable center, camera, scale, and generous gutters. Every shape and fragment must stay inside its cell. Preserve the reference style. Transparent outside the artwork. No text, numbers, or grid lines. The first pose holds A and the last settles into B.',
    check: 'The middle poses show the shape changing. Each cell has room around the artwork. A static sheet is the input to the animation, not the finished GIF.',
  },
  {
    number: '03', title: 'Cut the sheet. Check the cuts.',
    text: 'Your agent separates the sheet into individual PNGs. Generated grids can have uneven rows. Check the actual gaps before slicing, then review the poses on light and dark backgrounds.',
    prompt: 'Use the installed skill’s assembly helper to slice this sheet. Inspect its real dimensions and gutters first. If equal divisions would clip a shape, measure the row and column boundaries or supply individual crop boxes. Keep a common canvas and consistent scale. Show me a contact sheet on light and dark backgrounds. Preserve intentional fragments, transparent holes, and black interior shapes.',
    check: 'No missing tips. No piece of the next row. No unexpected changes in size. Correct the crop before trying to hide the problem by shrinking the image.',
  },
  {
    number: '04', title: 'Give it time to land.',
    text: 'Hold on the recognizable artwork, move through the transformation, and settle. Then design the return. A loop can retrace its movement or follow a new path back to the start.',
    prompt: 'Assemble these inspected frames into a loop. Start with about 800 ms on the recognizable endpoints and 80 ms per moving pose, then adjust to the action. Use exact registered reference images for the held poses where possible. Plan the return and avoid accidentally doubling the first or turning frame. Export a transparent GIF, animated WebP, still PNG, and review sheet. Read the files back to verify the actual duration, size, and infinite loop setting.',
    check: 'Play the exported file through two full loops. Look for an abrupt join, an extra pause, or the artwork drifting around the canvas. A passing export check cannot judge the motion for you.',
  },
  {
    number: '05', title: 'Make it work where it lives.',
    text: 'Test at the size and background you will actually use. GIF is handy, but it has limited colors and hard transparency. WebP can keep smoother edges. Save the frames and timing so the next revision is easy.',
    prompt: 'Preview the export on [my page background color] at [intended display size]. Check contrast, alpha edges, framing, timing, and the loop seam. Give me a background-matched version if needed. For a horizontal lockup, put the supplied wordmark to the right, leave visible breathing room, and keep the lettering identical in every frame. Deliver the final files plus the source frames and timing manifest.',
    check: 'The logo is readable on its real background. The text stays still. The deliverable includes the editable source, not only the finished GIF.',
  },
];
