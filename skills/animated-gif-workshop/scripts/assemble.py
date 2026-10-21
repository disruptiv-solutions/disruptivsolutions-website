#!/usr/bin/env python3
"""Slice inspected sprite sheets and export timed GIF/WebP loops. Python 3.10+, Pillow."""
import argparse
import json
from pathlib import Path

from PIL import Image, ImageColor, ImageDraw, ImageOps


def read_image(path):
    with Image.open(path) as image:
        return image.convert('RGBA')


def contact_sheet(frames, destination):
    indices = sorted({round(i * (len(frames) - 1) / min(35, len(frames) - 1))
                      for i in range(min(36, len(frames)))}) if len(frames) > 1 else [0]
    cols, w, h = min(6, len(indices)), 180, 130
    rows = (len(indices) + cols - 1) // cols
    result = Image.new('RGB', (cols * w, rows * h * 2), '#efe7e0')
    draw = ImageDraw.Draw(result)
    for band, color in enumerate(('#efe7e0', '#16181a')):
        for n, index in enumerate(indices):
            x, y = (n % cols) * w, (n // cols + band * rows) * h
            tile = Image.new('RGBA', (w, h), color)
            art = ImageOps.contain(frames[index], (w - 16, h - 30), Image.Resampling.LANCZOS)
            tile.alpha_composite(art, ((w - art.width) // 2, 8))
            result.paste(tile.convert('RGB'), (x, y))
            draw.text((x + 8, y + h - 18), str(index), fill='#ffffff' if band else '#16181a')
    result.save(destination, quality=92)


def edges(value, count, extent):
    values = [int(x) for x in value.split(',')] if value else [round(i * extent / count) for i in range(count + 1)]
    if len(values) != count + 1 or values[0] < 0 or values[-1] > extent or any(b <= a for a, b in zip(values, values[1:])):
        raise ValueError('Edges must be strictly increasing, in bounds, and have one more entry than the cell count.')
    return values


def fresh_output(path):
    # Never reuse the input or overwrite a prior delivery.
    path.mkdir(parents=True, exist_ok=False)
    return path


def slice_sheet(args):
    sheet = read_image(args.sheet)
    if args.boxes:
        boxes = json.loads(args.boxes.read_text(encoding='utf-8-sig'))
    else:
        xs = edges(args.x_edges, args.cols, sheet.width)
        ys = edges(args.y_edges, args.rows, sheet.height)
        boxes = [(xs[c], ys[r], xs[c + 1], ys[r + 1]) for r in range(args.rows) for c in range(args.cols)]
    if not boxes:
        raise ValueError('No crop boxes.')
    for i, box in enumerate(boxes):
        if len(box) != 4 or any(type(v) is not int for v in box):
            raise ValueError(f'Crop {i} must have four integer coordinates.')
        l, t, r, b = box
        if not (0 <= l < r <= sheet.width and 0 <= t < b <= sheet.height):
            raise ValueError(f'Crop {i} extends outside the sheet.')
    frames = []
    shared_extent = max(max(box[2] - box[0], box[3] - box[1]) for box in boxes)
    for i, box in enumerate(boxes):
        image = sheet.crop(box)
        if args.alpha_cutoff:
            image.putalpha(image.getchannel('A').point(lambda a: 0 if a < args.alpha_cutoff else a))
        bbox = image.getchannel('A').getbbox()
        if bbox is None:
            raise ValueError(f'Crop {i} is empty; inspect the boundaries.')
        if args.fit:
            image = image.crop(bbox)
        area = args.size - 2 * args.padding
        if args.fit:
            image = ImageOps.contain(image, (area, area), Image.Resampling.LANCZOS)
        else:
            scale = area / shared_extent
            image = image.resize((max(1, round(image.width * scale)), max(1, round(image.height * scale))), Image.Resampling.LANCZOS)
        canvas = Image.new('RGBA', (args.size, args.size))
        canvas.alpha_composite(image, ((args.size - image.width) // 2, (args.size - image.height) // 2))
        frames.append(canvas)
    out = fresh_output(args.out)
    entries = []
    for i, image in enumerate(frames):
        name = f'frame-{i:03d}.png'
        image.save(out / name)
        entries.append({'file': name, 'duration_ms': 800 if i in (0, len(frames) - 1) else 80})
    (out / 'manifest.json').write_text(json.dumps({'frames': entries}, indent=2) + '\n', encoding='utf-8')
    contact_sheet(frames, out / 'slice-review.jpg')
    print(json.dumps({'frames': len(frames), 'out': str(out.resolve()), 'next': 'Inspect crops; edit manifest timing and return poses before export.'}))


def box_inside(box, canvas):
    if len(box) != 4 or any(type(v) is not int for v in box):
        raise ValueError('Placement boxes require four integers: left, top, width, height.')
    x, y, w, h = box
    if min(x, y) < 0 or min(w, h) <= 0 or x + w > canvas[0] or y + h > canvas[1]:
        raise ValueError('Placement box extends outside the canvas.')
    return box


def place(canvas, image, box):
    x, y, w, h = box
    image = ImageOps.contain(image, (w, h), Image.Resampling.LANCZOS)
    canvas.alpha_composite(image, (x + (w - image.width) // 2, y + (h - image.height) // 2))


def overlaps(a, b):
    return a[0] < b[0] + b[2] and b[0] < a[0] + a[2] and a[1] < b[1] + b[3] and b[1] < a[1] + a[3]


def inspect_saved(path):
    with Image.open(path) as image:
        duration = 0
        for i in range(image.n_frames):
            image.seek(i)
            image.load()  # WebP frame metadata updates after load.
            duration += image.info.get('duration', 0)
        return {'size': list(image.size), 'frames': image.n_frames, 'duration_ms': duration, 'loop': image.info.get('loop')}


def export(args):
    manifest = json.loads(args.manifest.read_text(encoding='utf-8-sig'))
    root = args.manifest.resolve().parent
    entries = manifest.get('frames', [])
    if not entries:
        raise ValueError('Manifest needs a non-empty frames list.')
    durations = [e['duration_ms'] for e in entries]
    if any(type(v) is not int or v < 10 or v % 10 or v > 655350 for v in durations):
        raise ValueError('Durations must be integer multiples of 10 ms from 10 to 655350.')
    images = [read_image(root / e['file']) for e in entries]
    canvas_size = manifest.get('canvas', list(images[0].size))
    if len(canvas_size) != 2 or any(type(v) is not int or v <= 0 for v in canvas_size):
        raise ValueError('Canvas must contain two positive integer dimensions.')
    if 'canvas' not in manifest and any(im.size != images[0].size for im in images):
        raise ValueError('Frames differ in size. Register them, or specify a canvas and animation_box.')
    animation_box = box_inside(manifest.get('animation_box', [0, 0, *canvas_size]), canvas_size)
    wordmark = manifest.get('wordmark')
    wordmark_box, wordmark_image = None, None
    if wordmark:
        wordmark_box = box_inside(wordmark['box'], canvas_size)
        if overlaps(animation_box, wordmark_box):
            raise ValueError('The wordmark and animation boxes must not overlap. Leave a visible gap.')
        wordmark_image = read_image(root / wordmark['file'])
    frames, edge_contact = [], []
    for i, image in enumerate(images):
        bbox = image.getchannel('A').getbbox()
        if not bbox:
            raise ValueError(f'Frame {i} is empty.')
        if bbox[0] == 0 or bbox[1] == 0 or bbox[2] == image.width or bbox[3] == image.height:
            edge_contact.append(i)
        canvas = Image.new('RGBA', tuple(canvas_size))
        place(canvas, image, animation_box)
        if wordmark_image is not None:
            place(canvas, wordmark_image, wordmark_box)
        if args.background:
            opaque = Image.new('RGBA', canvas.size, ImageColor.getrgb(args.background)[:3] + (255,))
            opaque.alpha_composite(canvas)
            canvas = opaque
        frames.append(canvas)
    stationary = None
    if wordmark_box:
        x, y, w, h = wordmark_box
        region = (x, y, x + w, y + h)
        baseline = frames[0].crop(region).tobytes()
        stationary = all(fr.crop(region).tobytes() == baseline for fr in frames)
    indexed = []
    for image in frames:
        # Hidden RGB under fully transparent pixels must not consume the visible palette.
        matte = Image.new('RGB', image.size, '#ffffff')
        matte.paste(image, mask=image.getchannel('A'))
        palette = matte.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
        palette.putpalette(palette.getpalette()[:765] + [0, 0, 0])
        if not args.background:
            palette.paste(255, mask=image.getchannel('A').point(lambda a: 255 if a < 128 else 0))
        indexed.append(palette)
    out = fresh_output(args.out)
    gif_path, webp_path = out / f'{args.name}.gif', out / f'{args.name}.webp'
    options = {} if args.background else {'transparency': 255}
    indexed[0].save(gif_path, save_all=True, append_images=indexed[1:], duration=durations, loop=0, disposal=2, optimize=False, **options)
    frames[0].save(webp_path, save_all=True, append_images=frames[1:], duration=durations, loop=0, lossless=True, method=0)
    frames[0].save(out / f'{args.name}-still.png')
    contact_sheet(frames, out / f'{args.name}-review.jpg')
    report = {'source_frames': len(frames), 'expected_duration_ms': sum(durations), 'background': args.background or 'transparent',
              'edge_contact_source_frames': edge_contact, 'wordmark_stationary': stationary,
              'gif': inspect_saved(gif_path), 'webp': inspect_saved(webp_path)}
    for fmt in ('gif', 'webp'):
        actual = report[fmt]
        if actual['size'] != canvas_size or actual['duration_ms'] != sum(durations) or actual['loop'] != 0:
            raise ValueError(f'Export verification failed: {fmt}: {actual}')
    (out / f'{args.name}-report.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report))


def positive(value):
    number = int(value)
    if number <= 0:
        raise argparse.ArgumentTypeError('Must be a positive integer.')
    return number


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    s = sub.add_parser('slice', help='Extract ordered poses and a review sheet.')
    s.add_argument('sheet', type=Path)
    s.add_argument('--rows', type=positive, default=4)
    s.add_argument('--cols', type=positive, default=4)
    s.add_argument('--x-edges')
    s.add_argument('--y-edges')
    s.add_argument('--boxes', type=Path)
    s.add_argument('--size', type=positive, default=384)
    s.add_argument('--padding', type=int, default=0)
    s.add_argument('--fit', action='store_true')
    s.add_argument('--alpha-cutoff', type=int, default=0)
    s.add_argument('--out', type=Path, required=True)
    e = sub.add_parser('export', help='Export GIF, WebP, still, review sheet, and inspection report.')
    e.add_argument('manifest', type=Path)
    e.add_argument('--out', type=Path, required=True)
    e.add_argument('--name', default='loop')
    e.add_argument('--background', help='Opaque background, e.g. #efe7e0.')
    args = parser.parse_args()
    try:
        if args.command == 'slice':
            if args.padding < 0 or args.padding * 2 >= args.size or not 0 <= args.alpha_cutoff <= 255:
                raise ValueError('Padding must leave room for artwork; alpha cutoff must be 0..255.')
            slice_sheet(args)
        else:
            if not args.name or args.name in ('.', '..') or any(c not in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_' for c in args.name):
                raise ValueError('Name may contain only letters, numbers, hyphens, and underscores.')
            export(args)
    except (ValueError, KeyError, OSError) as error:
        parser.exit(1, f'Error: {error}\n')


if __name__ == '__main__':
    main()
