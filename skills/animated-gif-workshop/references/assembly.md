# Assembly helper

Requires Python 3.10+ and Pillow. Paths in a manifest resolve relative to the manifest, so a source folder can move between computers. Run the script from the downloaded skill's `scripts` folder, or substitute its actual path below.

## 1. Slice a sheet

```sh
python assemble.py slice sheet.png --rows 4 --cols 4 --out frames --size 384
```

This resizes complete cells into square canvases with their coordinates intact. It writes numbered PNGs, `manifest.json`, and a light/dark contact sheet. It refuses to overwrite an existing output folder.

If row gutters are uneven, measure their gap midpoints and provide explicit edges:

```sh
python assemble.py slice sheet.png --rows 4 --cols 4 --y-edges 0,310,642,982,1280 --out frames --size 384
```

Those numbers are examples, not known boundaries for your sheet. `--x-edges` works the same way. For an irregular layout, use `--boxes boxes.json` where the JSON is an ordered list of `[left, top, right, bottom]` crop boxes. Default traversal is row-major. `--fit --padding 48` fits each pose independently and can introduce unwanted changes in scale. Leave it off for shared framing and intentional expansion. `--alpha-cutoff 40` clears only low-alpha pixels; it does not remove black or disconnected shapes.

## 2. Set the timing

Edit the generated manifest. This minimal example assumes frame files are beside it:

```json
{
  "frames": [
    {"file": "frame-000.png", "duration_ms": 800},
    {"file": "frame-001.png", "duration_ms": 80},
    {"file": "frame-002.png", "duration_ms": 80},
    {"file": "frame-003.png", "duration_ms": 800}
  ]
}
```

Every duration must be a positive multiple of 10 ms. Replace the first and destination hold files with registered exact reference images when available. For a return, append the actual reverse-transition poses, or reverse the moving poses without duplicating the held turning frame. Multiple sheets can share one manifest; copy them into separately named subfolders and use relative paths.

## 3. Export and inspect

```sh
python assemble.py export frames/manifest.json --out exports --name my-loop
python assemble.py export frames/manifest.json --out cream-exports --name my-loop --background "#efe7e0"
```

The output folder must not already exist. Outputs: `.gif`, `.webp`, `-still.png`, `-review.jpg`, and `-report.json`. Transparent GIF edges are binary at alpha 128. The WebP retains the original alpha. Opaque exports composite all frames first, which avoids a dark fringe from transparent edges on the intended background.

The report reads the saved animation back and verifies dimensions, infinite loop metadata, and total duration. Consecutive identical frames may be merged by the encoder. Edge-contact frame indices are informational; inspect those source images for clipping. Contact sheets are at most 36 evenly distributed poses; inspect every frame when needed.

## Optional horizontal lockup

Add these fields to the manifest. Boxes use `[left, top, width, height]` here, whereas slice crop boxes use `[left, top, right, bottom]`.

```json
{
  "canvas": [960, 384],
  "animation_box": [0, 0, 384, 384],
  "wordmark": {"file": "wordmark.png", "box": [408, 64, 520, 256]},
  "frames": [
    {"file": "frame-000.png", "duration_ms": 800},
    {"file": "frame-001.png", "duration_ms": 80}
  ]
}
```

Artwork is contained within each box without changing aspect ratio. The wordmark box must not intersect the animation box. The source wordmark is loaded once and composited unchanged on every frame. The report checks that its region stays identical. Keep extra visible clearance inside the boxes if the shapes come close to their edges.

## Troubleshooting

- **A strip of the next pose appears:** measure the real gutters and correct the crop edges.
- **A logo pulses larger and smaller:** turn off per-pose fitting or register manually to a common anchor.
- **Black interior disappears:** preserve it; outside transparency is not the same as removing a color.
- **Every moving pose looks like two overlapping logos:** revise the generation prompt to request transitional geometry.
- **Export passes but the loop stutters:** review the closing transition and duplicate endpoint holds. Duration checks cannot judge motion.
- **GIF edges look rough:** use the opaque version for its page color, or use animated WebP where supported.

Save the input sheets, extracted PNGs, manifest, and helper with the deliverable for later revisions. None of these commands calls an external service.
