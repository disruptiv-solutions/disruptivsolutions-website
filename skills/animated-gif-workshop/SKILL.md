---
name: animated-gif-workshop
description: "Create looping GIFs and animated WebP from reference artwork using generated transformation poses, inspected sprite sheets, and reproducible frame assembly. Use for logo morphs, small illustrated loops, multi-logo cycles, and animated brand lockups with a fixed wordmark."
---

# Animated GIF Workshop

Turn a reference image into a loop that keeps the character of the original artwork. Generate the changing shapes as images, then assemble and inspect the animation. A convincing transformation needs intermediate geometry; fading one finished logo into another is a different treatment.

## Start with the reference and the motion

Inspect the supplied artwork before editing. Use the actual reference as an image input, including an exact destination logo when relevant. Preserve its silhouette, colors, flat or dimensional treatment, internal dark shapes, and transparent holes. Do not substitute a generic 3D object for distinctive flat artwork.

Infer sensible defaults from the request. Ask only for missing inputs that determine the result: reference artwork, destination, or intended background. For a small web loop, a useful starting point is a square canvas with generous clearance, 12–24 distinct poses per transformation, 70–100 ms between moving poses, and a 600–1,000 ms hold on recognizable endpoints. These are starting points, not required frame counts.

Describe the action as beats: hold → anticipate → transform → settle → hold → return. For a chain, plan every transition, including the final return to the first mark. Read [frame-prompts.md](references/frame-prompts.md) for generation prompts and the fixed-wordmark variation.

## Generate poses

Use the environment's available image-generation/editing tool and follow its instructions. Feed in the references and request a numbered-in-order sprite sheet with separate, consistently sized cells, generous gutters, identical framing, and no drawn labels or grid lines. The result should contain actual transitional poses.

An image tool usually produces a static sheet, not a finished GIF. Save the original sheet unchanged. If no image tool is available, use supplied poses or give the user the generation prompt and request the resulting sheet. Do not invent tool availability or switch to a paid API without authorization. No personal account, API key, local file path, or other skill is required by this package.

## Slice and inspect before exporting

Use Python 3.10+ and Pillow for the included helper. Install Pillow into a project environment if needed. See [assembly.md](references/assembly.md) for commands and the manifest format.

Inspect the sheet dimensions and actual artwork rows. Generated sheets can have uneven row spacing even when a perfect grid was requested. Use explicit `x_edges` / `y_edges` or individual crop boxes if equal divisions cut through artwork. Do not compensate for a bad crop by shrinking the clipped frame.

Run `slice`, then inspect its light/dark contact sheet and every suspect pose. Correct missing tips, neighboring-cell fragments, jitter, shape drift, or unwanted backgrounds before continuing. Keep deliberate fragments and black interior shapes. Do not globally remove black pixels or tiny islands. Thresholding alpha is optional and can destroy fine detail.

Prefer a common canvas, stable center, and consistent scale. The helper keeps cell coordinates by default. Its `--fit` option independently sizes each pose and can cause scale breathing; use it only when the visual review confirms that is appropriate. For intentional expansion, preserve the shared coordinate system and enough outer clearance.

## Assemble with exact holds

Use exact reference artwork for the held endpoints when feasible, registered to the same canvas. A brief final join can ease a small mismatch, but it should not replace the transformation itself.

Write an explicit ordered manifest of PNG paths and durations. Do not add a second copy of the first pose at the end unless its hold is intentional: the loop already returns there. A ping-pong sequence should omit duplicate turning poses. Keep moving timing on GIF's 10 ms increments; the helper rejects unsupported timing instead of silently changing it.

Run `export`. It writes a GIF, full-alpha animated WebP, still PNG, light/dark review sheet, and a JSON inspection report. It uses an infinite loop, an explicit transparent palette index, and disposal that clears previous frames. GIF has a 256-color palette and binary transparency; WebP is useful for smooth edges and gradients. Render an opaque background variant when the destination needs one.

For a lockup, use an existing wordmark image on the right and keep it fixed in every frame. Only the symbol should transform. Preserve the lettering and aspect ratio; do not regenerate the wordmark per pose. Leave visible space between symbol and text. The helper supports a separate animation area and wordmark region.

## Review the actual export

Play the exported GIF through at least two loops. Inspect the seam, endpoint recognition, stable scale, alpha edges, first-frame appearance, and pauses. Review on the intended page color as well as light and dark. A black logo can disappear on a dark surface even when its alpha is correct.

Check the JSON report for actual frame count, duration, loop metadata, and edge contact. Edge contact is a review signal, not automatic proof of clipping. GIF encoders may merge identical consecutive frames; compare total duration and visible behavior, not only source-frame count. Do not call a loop seamless based only on a contact sheet or successful export.

Deliver the GIF, WebP when useful, a still preview, and the reproducible source frames/manifest. State the canvas size, duration, and background variant. Keep originals unchanged. Offer placement in a site or deck only within the user's requested scope.
