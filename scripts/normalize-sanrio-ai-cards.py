"""Trim margins and fill Sanrio AI cards to 3:4 portrait (no letterboxing)."""
from pathlib import Path
from PIL import Image

CARDS = Path(__file__).resolve().parents[1] / "assets" / "img" / "sanrio" / "cards"
TARGET_W = 420
TARGET_H = 560
MARGIN_TOL = 14
EDGE_PAD = 2


def is_margin(px: tuple[int, int, int], tol: int = MARGIN_TOL) -> bool:
    r, g, b = px
    return r >= 255 - tol and g >= 250 - tol and b >= 250 - tol


def trim_margins(img: Image.Image) -> Image.Image:
    rgb = img.convert("RGB")
    w, h = rgb.size
    px = rgb.load()
    left, top, right, bottom = 0, 0, w, h

    while top < bottom:
        if all(is_margin(px[x, top]) for x in range(left, right)):
            top += 1
        else:
            break

    while bottom > top:
        if all(is_margin(px[x, bottom - 1]) for x in range(left, right)):
            bottom -= 1
        else:
            break

    while left < right:
        if all(is_margin(px[left, y]) for y in range(top, bottom)):
            left += 1
        else:
            break

    while right > left:
        if all(is_margin(px[right - 1, y]) for y in range(top, bottom)):
            right -= 1
        else:
            break

    if right <= left or bottom <= top:
        return img

    return img.crop((
        max(0, left - EDGE_PAD),
        max(0, top - EDGE_PAD),
        min(w, right + EDGE_PAD),
        min(h, bottom + EDGE_PAD),
    ))


def cover_fill(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    w, h = img.size
    scale = max(TARGET_W / w, TARGET_H / h)
    nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - TARGET_W) // 2
    top = (nh - TARGET_H) // 2
    return resized.crop((left, top, left + TARGET_W, top + TARGET_H))


def normalize(path: Path) -> None:
    img = Image.open(path)
    trimmed = trim_margins(img)
    filled = cover_fill(trimmed)
    filled.save(path, optimize=True)


def main():
    for path in sorted(CARDS.glob("card-*.png")):
        before = Image.open(path).size
        normalize(path)
        print(f"{path.name}: {before} -> {TARGET_W}x{TARGET_H} cover")


if __name__ == "__main__":
    main()
