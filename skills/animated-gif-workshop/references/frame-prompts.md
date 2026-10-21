# Prompts for transformation poses

Replace bracketed text and attach the actual reference images. Use these as starting points rather than rules for every style. If a tool cannot generate so many legible cells at once, use smaller sheets with a shared endpoint.

## One image becomes another

> Create a static sprite sheet of 16 sequential animation poses in a 4 by 4 grid, read left to right, top to bottom. Use attached image A as the exact starting artwork and image B as the exact final artwork. The action: [the red cube's faces separate, curve into ribbons, then resolve into the four-point star]. Show distinct intermediate geometry. Preserve [flat colors, sharp edges, yellow border, and internal black shapes] from the supplied artwork while the form changes. Keep an identical camera, stable center, consistent scale, and generous empty gutters in every cell. Keep all pieces fully inside their cell. Transparent outside the artwork, including any intended holes. No text, frame labels, grid lines, shadows outside the art, or extra symbols. First pose holds A. Last pose settles into B.

Generate the return transformation too if a natural forward cycle is desired. Reversing the outward sequence is suitable when the physical action should retrace itself, such as panels opening and closing.

## A small illustrated loop

> Use the attached illustration as the reference. Create [16] sequential poses arranged [4 by 4]. The [paper crane] holds still, [gently raises its wings], [opens them], then returns to exactly the starting posture. Keep the [folded paper texture, color, silhouette, and camera angle]. Only [wings and a small body response] move. Preserve the same framing and scale, with room around every pose. Transparent outside the artwork. No labels or grid lines.

## A chain of logos

Make a separate sheet for each adjacent pair. Reuse the same canonical endpoint image between sheets. Do not ask for five unrelated logos on one sheet and assume the tool has animated the transitions.

Example plan: A holds → A transforms into B → B holds → B becomes C → C holds → C becomes A. Each held mark is exact supplied artwork. Review recognition and the A→B, B→C, C→A joins separately.

## Fixed wordmark on the right

Generate only the moving symbol. Composite an existing transparent wordmark image afterward. Use the manifest's `canvas`, `animation_box`, and `wordmark` settings. A practical starting layout is a 960×384 canvas, a 384×384 animation area at the left, and a wordmark beginning around x=400 with at least 24 px of visible clearance. Adjust to the actual mark and lettering; these numbers are illustrative.

## Revision prompts that target the failure

- **Lost the original style:** "Keep the original flat, angular artwork. Remove the added bevels and photorealistic shading. Preserve the supplied silhouette in the held poses."
- **Abrupt change:** "Keep the endpoints. Revise the middle six poses so [specific piece] progressively becomes [destination piece]. Do not dissolve between two intact logos."
- **Clipped tips:** "Keep the complete shape and all fragments inside every cell, with clear outer gutters. Reduce the subject's size consistently across the entire sheet."
- **Jitter:** "Keep the same center, camera, and baseline in every cell. Animate the intended shape change without translation or zoom."

Fix crop boundaries in assembly when the sheet already contains the missing artwork. Regenerate only when the artwork itself is clipped or wrong.
