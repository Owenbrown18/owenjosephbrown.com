import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

/** The brand, in the four values the card actually needs. */
const PAPER = "#f4f3ef";
const INK = "#0f2320";
const FOREST = "#2e5450";
/** Sage reads at 2.1:1 on paper, so it accents and never carries text. */
const ACCENT_TEXT = "#3d6b65";

/**
 * The grid, at the page's own measurements: 24px minor, 120px major, drawn
 * in forest. Rebuilt here as elements because Satori has no shader, but the
 * numbers come from forest-canvas.tsx so the card and the page agree.
 */
const CELL = 24;
const MAJOR = CELL * 5;

/**
 * Where the grid blooms, in fractions of the card. The page puts three
 * gaussian masses on the paper and lets the grid show only inside them;
 * Owen rejected the flat full-bleed grid twice. One mass, on the right,
 * is the version of that which leaves the type on clean paper.
 */
const MASS = { x: 0.78, y: 0.44, rx: 0.3, ry: 0.42 };

/** Gaussian falloff, 1 at the centre of the mass and 0 outside it. */
function falloff(distance: number, radius: number) {
  const t = distance / radius;
  return Math.exp(-(t * t) * 2.2);
}

function gridLines() {
  const { width: W, height: H } = OG_SIZE;
  const massX = MASS.x * W;
  const massY = MASS.y * H;
  const lines = [];

  for (let x = CELL; x < W; x += CELL) {
    const major = x % MAJOR === 0;
    const a = falloff(Math.abs(x - massX), MASS.rx * W) * (major ? 0.42 : 0.26);
    if (a < 0.012) continue;
    lines.push(
      <div
        key={`v${x}`}
        style={{
          position: "absolute",
          left: x,
          top: 0,
          width: major ? 1.1 : 0.75,
          height: H,
          opacity: a,
          backgroundImage: `linear-gradient(to bottom, rgba(46,84,80,0) 0%, ${FOREST} ${(
            (massY / H) *
            100
          ).toFixed(1)}%, rgba(46,84,80,0) 100%)`,
        }}
      />,
    );
  }

  for (let y = CELL; y < H; y += CELL) {
    const major = y % MAJOR === 0;
    const a = falloff(Math.abs(y - massY), MASS.ry * H) * (major ? 0.42 : 0.26);
    if (a < 0.012) continue;
    lines.push(
      <div
        key={`h${y}`}
        style={{
          position: "absolute",
          left: 0,
          top: y,
          width: W,
          height: major ? 1.1 : 0.75,
          opacity: a,
          backgroundImage: `linear-gradient(to right, rgba(46,84,80,0) 0%, ${FOREST} ${(
            (massX / W) *
            100
          ).toFixed(1)}%, rgba(46,84,80,0) 100%)`,
        }}
      />,
    );
  }
  return lines;
}

/**
 * Shared OG card, on the same paper the site is printed on: ink type over
 * a forest grid that shows through in one soft mass, the OB. mark, and the
 * sage full stop the headings all end on.
 *
 * The mass is a paper-coloured radial wash laid over a full grid, which is
 * the closest Satori gets to the page's gaussian masses. It also keeps the
 * left half clean, so the title never competes with a line.
 */
export async function ogCard({
  title,
  subtitle,
  eyebrow,
  wordmark = false,
}: {
  title: string;
  subtitle: string;
  eyebrow?: string;
  /**
   * Set the title in Fraunces. Reserved for the OBdesign wordmark, which
   * per the brand spec is never set in another face. Everything else is
   * Bricolage, the site's display face.
   */
  wordmark?: boolean;
}) {
  const [bricolage, inter, interBold, fraunces] = await Promise.all([
    readFile(
      join(
        process.cwd(),
        "src/assets/fonts/bricolage-grotesque-latin-800-normal.woff",
      ),
    ),
    readFile(
      join(process.cwd(), "src/assets/fonts/inter-latin-400-normal.woff"),
    ),
    readFile(
      join(process.cwd(), "src/assets/fonts/inter-latin-700-normal.woff"),
    ),
    readFile(
      join(process.cwd(), "src/assets/fonts/fraunces-latin-700-normal.woff"),
    ),
  ]);

  // Headings on the site end in a sage full stop. Satori has no inline
  // layout: a div with two children must be flex, and flex wraps per item,
  // so the title is laid out word by word. That gives normal-looking line
  // breaks AND lets the last word carry a coloured stop.
  const stop = title.endsWith(".");
  const words = (stop ? title.slice(0, -1) : title).split(" ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: PAPER,
        }}
      >
        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          {gridLines()}
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "58px 72px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            {/* The header's mark, not the full name: the site says OB. */}
            <div
              style={{
                display: "flex",
                fontFamily: "Bricolage",
                fontSize: 36,
                letterSpacing: "-0.02em",
                color: INK,
              }}
            >
              OB
              <span style={{ color: FOREST }}>.</span>
            </div>
            {eyebrow && (
              <div
                style={{
                  display: "flex",
                  fontFamily: "InterBold",
                  fontSize: 18,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: ACCENT_TEXT,
                }}
              >
                {eyebrow}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                width: 56,
                height: 3,
                backgroundColor: FOREST,
                marginBottom: 30,
              }}
            />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "baseline",
                columnGap: "0.26em",
                fontFamily: wordmark ? "Fraunces" : "Bricolage",
                fontSize: title.length > 30 ? 66 : 88,
                lineHeight: 1.02,
                letterSpacing: wordmark ? "-0.02em" : "-0.03em",
                color: INK,
                maxWidth: 980,
              }}
            >
              {words.map((word, i) =>
                stop && i === words.length - 1 ? (
                  <div key={i} style={{ display: "flex" }}>
                    {word}
                    <span style={{ color: FOREST }}>.</span>
                  </div>
                ) : (
                  <span key={i}>{word}</span>
                ),
              )}
            </div>
            <div
              style={{
                marginTop: 26,
                fontFamily: "Inter",
                fontSize: 26,
                lineHeight: 1.4,
                color: "rgba(15, 35, 32, 0.72)",
                maxWidth: 860,
              }}
            >
              {subtitle}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "InterBold",
              fontSize: 17,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(15, 35, 32, 0.55)",
            }}
          >
            <span>owenjosephbrown.com</span>
            <span>Software engineer · Victoria, BC</span>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Bricolage", data: bricolage, weight: 800 as const },
        { name: "Inter", data: inter, weight: 400 as const },
        { name: "InterBold", data: interBold, weight: 700 as const },
        { name: "Fraunces", data: fraunces, weight: 700 as const },
      ],
    },
  );
}
