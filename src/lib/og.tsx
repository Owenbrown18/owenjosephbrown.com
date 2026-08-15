import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Shared OG card: the forest gradient, the wordmark, a big Fraunces title.
 */
export async function ogCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const [bricolage, inter] = await Promise.all([
    readFile(
      join(
        process.cwd(),
        "src/assets/fonts/bricolage-grotesque-latin-800-normal.woff",
      ),
    ),
    readFile(
      join(process.cwd(), "src/assets/fonts/inter-latin-400-normal.woff"),
    ),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#0b1f1d",
          backgroundImage:
            "radial-gradient(ellipse 70% 55% at 20% 25%, #2e5450 0%, #1e3a37 35%, #0b1f1d 80%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Bricolage",
            fontSize: 34,
            color: "rgba(255,255,255,0.92)",
          }}
        >
          Owen Brown
          <span style={{ color: "#7ba49e" }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: 56,
              height: 4,
              backgroundColor: "#7ba49e",
              marginBottom: 28,
            }}
          />
          <div
            style={{
              fontFamily: "Bricolage",
              fontSize: title.length > 26 ? 64 : 84,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              color: "rgba(255,255,255,0.95)",
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 24,
              fontFamily: "Inter",
              fontSize: 27,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.62)",
              maxWidth: 900,
            }}
          >
            {subtitle}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Inter",
            fontSize: 22,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          <span>owenjosephbrown.com</span>
          <span>Software engineer · Victoria, BC</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Bricolage", data: bricolage, weight: 800 as const },
        { name: "Inter", data: inter, weight: 400 as const },
      ],
    },
  );
}
