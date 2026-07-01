"""Trim grey sheet margins from split Sanrio cards and center on 3:4 canvas."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CARDS = ROOT / "assets" / "img" / "sanrio" / "cards"
TARGET_W = 420
TARGET_H = 560  # 3:4 portrait
EDGE_PAD = 3
BG_RATIO = 0.94


def corner_bg(img: Image.Image) -> tuple[int, int, int]:
    rgb = img.convert("RGB")
    w, h = rgb.size
    px = rgb.load()
    pts = [
        px[2, 2],
        px[w - 3, 2],
        px[2, h - 3],
        px[w - 3, h - 3],
        px[w // 2, 2],
        px[2, h // 2],
    ]
    return tuple(sum(p[i] for p in pts) // len(pts) for i in range(3))


def is_bg(px: tuple[int, int, int], bg: tuple[int, int, int], tol: int = 34) -> bool:
    if sum(abs(px[i] - bg[i]) for i in range(3)) <= tol:
        return True
    r, g, b = px
    lum = (r + g + b) / 3
    bg_lum = sum(bg) / 3
    return abs(lum - bg_lum) < 8 and max(r, g, b) - min(r, g, b) < 18


def is_card_pixel(px: tuple[int, int, int], bg: tuple[int, int, int]) -> bool:
    if not is_bg(px, bg, 30):
        return True
    r, g, b = px
    lum = (r + g + b) / 3
    bg_lum = sum(bg) / 3
    return bg_lum - lum > 5 or lum - bg_lum > 8


def shave_margins(img: Image.Image) -> Image.Image:
    rgb = img.convert("RGB")
    w, h = rgb.size
    px = rgb.load()
    bg = corner_bg(rgb)

    left, top, right, bottom = 0, 0, w, h

    while top < bottom:
        hits = sum(1 for x in range(left, right) if is_card_pixel(px[x, top], bg))
        if hits / max(1, right - left) < (1 - BG_RATIO):
            top += 1
        else:
            break

    while bottom > top:
        hits = sum(1 for x in range(left, right) if is_card_pixel(px[x, bottom - 1], bg))
        if hits / max(1, right - left) < (1 - BG_RATIO):
            bottom -= 1
        else:
            break

    while left < right:
        hits = sum(1 for y in range(top, bottom) if is_card_pixel(px[left, y], bg))
        if hits / max(1, bottom - top) < (1 - BG_RATIO):
            left += 1
        else:
            break

    while right > left:
        hits = sum(1 for y in range(top, bottom) if is_card_pixel(px[right - 1, y], bg))
        if hits / max(1, bottom - top) < (1 - BG_RATIO):
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


def normalize_canvas(card: Image.Image) -> Image.Image:
    card = card.convert("RGBA")
    w, h = card.size
    scale = min(TARGET_W / w, TARGET_H / h)
    nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
    resized = card.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (TARGET_W, TARGET_H), (255, 250, 252, 255))
    canvas.paste(resized, ((TARGET_W - nw) // 2, (TARGET_H - nh) // 2), resized)
    return canvas


def process_all():
    paths = sorted(CARDS.glob("card-*.png"))
    for path in paths:
        img = Image.open(path)
        trimmed = shave_margins(img)
        out = normalize_canvas(trimmed)
        out.save(path, optimize=True)
        print(f"{path.name}: {img.size} -> trim {trimmed.size} -> {out.size}")


if __name__ == "__main__":
    process_all()
