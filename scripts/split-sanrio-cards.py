"""Split 5 Sanrio sheet images (2x5 grid each) into 50 individual card PNGs."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SHEETS = ROOT / "assets" / "img" / "sanrio" / "sheets"
OUT = ROOT / "assets" / "img" / "sanrio" / "cards"

SOURCE_FILES = [
    "sheet-01.png",
    "sheet-02.png",
    "sheet-03.png",
    "sheet-04.png",
    "sheet-05.png",
]

COL_GUTTER_SEARCH_LEFT = 22
COL_GUTTER_SEARCH_RIGHT = 8
ROW_FILL_RATIO = 0.55
EDGE_PAD = 2


def sheet_bg(img: Image.Image) -> tuple[int, int, int]:
    rgb = img.convert("RGB")
    w, h = rgb.size
    px = rgb.load()
    samples = [px[2, 2], px[w - 3, 2], px[2, h - 3], px[w - 3, h - 3]]
    return tuple(sum(c[i] for c in samples) // 4 for i in range(3))


def is_card_pixel(px: tuple[int, int, int], bg: tuple[int, int, int]) -> bool:
    if sum(abs(px[i] - bg[i]) for i in range(3)) > 28:
        return True
    r, g, b = px
    lum = (r + g + b) / 3
    bg_lum = sum(bg) / 3
    return bg_lum - lum > 6 or lum - bg_lum > 10


def column_hits(px, bg, x: int, y0: int, y1: int) -> int:
    return sum(1 for y in range(y0, y1) if is_card_pixel(px[x, y], bg))


def row_hits(px, bg, y: int, x0: int, x1: int) -> int:
    return sum(1 for x in range(x0, x1) if is_card_pixel(px[x, y], bg))


def find_column_bounds(px, bg, w: int, h: int, row: int) -> list[int]:
    cols = 5
    cell_h = h / 2
    y0 = int(row * cell_h)
    y1 = int((row + 1) * cell_h)
    cell_w = w / cols
    gutters: list[int] = []
    for col in range(1, cols):
        center = int(col * cell_w)
        best_hits = 10**9
        best_x = center
        for x in range(center - COL_GUTTER_SEARCH_LEFT, center + COL_GUTTER_SEARCH_RIGHT):
            if x <= 0 or x >= w:
                continue
            hits = column_hits(px, bg, x, y0, y1)
            if hits < best_hits:
                best_hits = hits
                best_x = x
        gutters.append(best_x + 1)
    return [0, *gutters, w]


def find_vertical_bounds(
    px,
    bg,
    left: int,
    right: int,
    row: int,
    h: int,
) -> tuple[int, int]:
    cell_h = h / 2
    y0 = int(row * cell_h)
    y1 = int((row + 1) * cell_h)
    width = max(1, right - left)
    threshold = max(30, int(width * ROW_FILL_RATIO))

    top = y0
    for y in range(y0, y1):
        if row_hits(px, bg, y, left, right) >= threshold:
            top = y
            break

    bottom = y1
    for y in range(y1 - 1, top, -1):
        if row_hits(px, bg, y, left, right) >= threshold:
            bottom = y + 1
            break

    return top, bottom


def detect_card_bbox(img: Image.Image, row: int, col: int) -> tuple[int, int, int, int]:
    w, h = img.size
    rgb = img.convert("RGB")
    px = rgb.load()
    bg = sheet_bg(img)
    col_bounds = find_column_bounds(px, bg, w, h, row)
    left = col_bounds[col]
    right = col_bounds[col + 1]
    top, bottom = find_vertical_bounds(px, bg, left, right, row, h)
    return (
        max(0, left - EDGE_PAD),
        max(0, top - EDGE_PAD),
        min(w, right + EDGE_PAD),
        min(h, bottom + EDGE_PAD),
    )


def split_sheet(path: Path, start_index: int) -> int:
    img = Image.open(path).convert("RGBA")
    rows = 2
    cols = 5
    idx = start_index
    for row in range(rows):
        for col in range(cols):
            bbox = detect_card_bbox(img, row, col)
            card = img.crop(bbox)
            OUT.mkdir(parents=True, exist_ok=True)
            out_path = OUT / f"card-{idx:03d}.png"
            card.save(out_path, optimize=True)
            print(f"saved {out_path.name} ({card.size[0]}x{card.size[1]})")
            idx += 1
    return idx


def main():
    next_idx = 1
    for name in SOURCE_FILES:
        path = SHEETS / name
        if not path.exists():
            raise FileNotFoundError(path)
        next_idx = split_sheet(path, next_idx)
    print(f"done: {next_idx - 1} cards")


if __name__ == "__main__":
    main()
