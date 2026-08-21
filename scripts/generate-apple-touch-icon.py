#!/usr/bin/env python3
"""
Rasterizes public/apple-touch-icon.png from the same crescent-and-star geometry
as public/favicon.svg.

iOS ignores SVG favicons and falls back to a screenshot of the page when no
apple-touch-icon is present, so the 180x180 PNG that layout.tsx references has
to actually ship. There is no rasterizer available in this project's toolchain,
so this script draws the shapes directly with the standard library (zlib for
the PNG stream, struct for chunk headers) and 4x supersampling for smooth
edges.

Usage: python3 scripts/generate-apple-touch-icon.py
"""

import os
import struct
import zlib

SIZE = 180          # apple-touch-icon edge length in pixels
SUPERSAMPLE = 4     # samples per pixel along each axis
VIEWBOX = 64.0      # favicon.svg viewBox is "0 0 64 64"
CORNER_RADIUS = 14.0

BACKGROUND = (0x1B, 0x5E, 0x20)  # #1B5E20
FOREGROUND = (0xD4, 0xA8, 0x43)  # #D4A843

# Geometry below is in favicon.svg user units, with the <g transform="translate(32,32)"
# already folded into the coordinates.
CRESCENT_OUTER = (32 - 2, 32 - 4, 14.0)   # <circle cx="-2" cy="-4" r="14"/>
CRESCENT_INNER = (32 + 4, 32 - 6, 11.0)   # <circle cx="4"  cy="-6" r="11"/>
STAR = [
    (32 + 10.0, 32 - 2.0),
    (32 + 11.5, 32 + 2.5),
    (32 + 16.0, 32 + 2.5),
    (32 + 12.5, 32 + 5.5),
    (32 + 13.5, 32 + 10.0),
    (32 + 10.0, 32 + 7.0),
    (32 + 6.5, 32 + 10.0),
    (32 + 7.5, 32 + 5.5),
    (32 + 4.0, 32 + 2.5),
    (32 + 8.5, 32 + 2.5),
]


def in_circle(x, y, circle):
    cx, cy, r = circle
    dx = x - cx
    dy = y - cy
    return dx * dx + dy * dy <= r * r


def in_rounded_rect(x, y, size, radius):
    """Point-in-rounded-rect for a rect anchored at the origin."""
    if x < 0.0 or y < 0.0 or x > size or y > size:
        return False
    cx = min(max(x, radius), size - radius)
    cy = min(max(y, radius), size - radius)
    dx = x - cx
    dy = y - cy
    return dx * dx + dy * dy <= radius * radius


def in_polygon(x, y, points):
    """Ray-casting point-in-polygon test."""
    inside = False
    n = len(points)
    for i in range(n):
        x0, y0 = points[i]
        x1, y1 = points[(i + 1) % n]
        if (y0 > y) != (y1 > y):
            t = (y - y0) / (y1 - y0)
            if x < x0 + t * (x1 - x0):
                inside = not inside
    return inside


def sample(x, y):
    """Returns the straight RGBA colour of the artwork at SVG-space point (x, y)."""
    if not in_rounded_rect(x, y, VIEWBOX, CORNER_RADIUS):
        return (0, 0, 0, 0)
    colour = BACKGROUND
    if in_circle(x, y, CRESCENT_OUTER) and not in_circle(x, y, CRESCENT_INNER):
        colour = FOREGROUND
    if in_polygon(x, y, STAR):
        colour = FOREGROUND
    return (colour[0], colour[1], colour[2], 255)


def render():
    """Renders the icon and returns raw RGBA rows, one bytearray per pixel row."""
    # Samples per SVG user unit, at supersampled resolution.
    samples_per_unit = SIZE * SUPERSAMPLE / VIEWBOX
    sub = SUPERSAMPLE * SUPERSAMPLE
    rows = []
    for py in range(SIZE):
        row = bytearray()
        for px in range(SIZE):
            # Accumulate premultiplied colour so transparent samples along the
            # rounded corners don't drag the edge pixels toward black.
            acc_r = acc_g = acc_b = acc_a = 0
            for sy in range(SUPERSAMPLE):
                y = (py * SUPERSAMPLE + sy + 0.5) / samples_per_unit
                for sx in range(SUPERSAMPLE):
                    x = (px * SUPERSAMPLE + sx + 0.5) / samples_per_unit
                    r, g, b, a = sample(x, y)
                    if a:
                        acc_r += r * a
                        acc_g += g * a
                        acc_b += b * a
                        acc_a += a
            if acc_a == 0:
                row += b"\x00\x00\x00\x00"
                continue
            alpha = acc_a // sub
            row += bytes(
                (
                    acc_r // acc_a,
                    acc_g // acc_a,
                    acc_b // acc_a,
                    alpha,
                )
            )
        rows.append(row)
    return rows


def chunk(tag, payload):
    body = tag + payload
    return struct.pack(">I", len(payload)) + body + struct.pack(">I", zlib.crc32(body))


def encode_png(rows, width, height):
    raw = bytearray()
    for row in rows:
        raw.append(0)  # filter type 0 (None)
        raw += row
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)  # 8-bit RGBA
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + chunk(b"IEND", b"")
    )


def main():
    out_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "public",
        "apple-touch-icon.png",
    )
    png = encode_png(render(), SIZE, SIZE)
    with open(out_path, "wb") as handle:
        handle.write(png)
    print(f"wrote {out_path} ({len(png)} bytes, {SIZE}x{SIZE})")


if __name__ == "__main__":
    main()
