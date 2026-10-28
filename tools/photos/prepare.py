"""Prepare a journey photo for src/assets/trips/: AI-upscale, soften halos, resize to 8K, strip metadata.

Usage:
  python3 tools/photos/prepare.py <original> <output.jpg> [--ai <upscaled.png>] [--weight 0.75]

Steps (see docs/HANDOFF.md, "사진 처리"):
  1. Upscale the original 4x with realesrgan-ncnn-vulkan and the upscayl-lite-4x model, e.g.
       realesrgan-ncnn-vulkan -i in.png -o ai.png -n upscayl-lite-4x -s 4
  2. Run this script with --ai ai.png. It blends the AI result with a plain Lanczos enlargement
     (weight = share of the AI image; 0.75 for photos, 0.6 for night skies so faint stars survive),
     resizes the long edge to 7680px and saves a JPEG without EXIF/XMP.
     Without --ai it only enlarges with Lanczos.
"""
import argparse
from PIL import Image

LONG_EDGE = 7680

def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('original')
    ap.add_argument('output')
    ap.add_argument('--ai', help='4x upscaled PNG of the original')
    ap.add_argument('--weight', type=float, default=0.75, help='share of the AI image in the blend')
    args = ap.parse_args()

    src = Image.open(args.original).convert('RGB')
    scale = LONG_EDGE / max(src.size)
    size = (round(src.width * scale), round(src.height * scale))
    out = src.resize(size, Image.LANCZOS)
    if args.ai:
        ai = Image.open(args.ai).convert('RGB').resize(size, Image.LANCZOS)
        out = Image.blend(out, ai, args.weight)
    # A fresh image carries no EXIF/XMP, which tools/checks/publication.mjs requires.
    out.save(args.output, quality=90, optimize=True, progressive=True)
    print(f'{args.output}: {size[0]}x{size[1]}')

if __name__ == '__main__':
    main()
