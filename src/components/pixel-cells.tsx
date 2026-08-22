import type { CSSProperties } from "react";

/**
 * The site's one hover-and-reveal motion, as a reusable grid of cells.
 *
 * reveal: paper cells over a card's art that dissolve off on scroll-in.
 * hover:  accent cells that fill in over the thing you're hovering — a
 *         card's frame, a button — and dissolve back when you leave.
 *
 * Delays are seeded from `seed`, so server and client render identical
 * numbers (no hydration mismatch) and every element has its own order.
 */
function seeded(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function PixelCells({
  seed,
  variant,
  cols = 10,
  rows = 6,
  /** Longest delay, ms. Cards breathe; buttons need to feel instant. */
  spread = variant === "reveal" ? 520 : 300,
}: {
  seed: string;
  variant: "reveal" | "hover";
  cols?: number;
  rows?: number;
  spread?: number;
}) {
  const rand = seeded(`${seed}:${variant}`);
  const cells = Array.from({ length: cols * rows }, (_, i) => (
    <span
      key={i}
      className="pixel-cell"
      style={{ "--d": `${Math.round(rand() * spread)}ms` } as CSSProperties}
    />
  ));
  return (
    <span
      aria-hidden
      className={`pixel-grid pixel-grid--${variant}`}
      style={{ "--cols": cols, "--rows": rows } as CSSProperties}
    >
      {cells}
    </span>
  );
}
