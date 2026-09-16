import { ImageResponse } from "next/og";
import { join } from "node:path";
import sharp from "sharp";
import {
  FOREST,
  INK,
  OG_SIZE,
  PAPER,
  gridLines,
  ogFonts,
} from "@/lib/og";

/**
 * The landing page's share card: the name on the left, the work on the
 * right, cropped off the edge the way the hero cluster spills out of its
 * column.
 *
 * Three pieces, not the whole cluster. A share preview is shown at a
 * third of this size or less, and at that scale five devices plus a code
 * panel stop reading as anything. A construction site, a spa site and an
 * iOS app, large, say the range in one glance.
 *
 * The frames are the hero's own (device-frames.tsx, phone-frame.tsx),
 * redrawn for Satori at the same proportions, and the screens are the same
 * screenshot files the hero loads. Replace a screenshot in public/ and the
 * card follows on the next build.
 */

/** Satori reads PNG and JPEG, not the WebP the site ships. */
async function screen(file: string, width: number, height: number) {
  const buf = await sharp(join(process.cwd(), "public", file))
    // Laptop screens crop from the top like the hero (object-position
    // top); the phone's capture already matches its frame's ratio.
    .resize(Math.round(width * 1.5), Math.round(height * 1.5), {
      fit: "cover",
      position: "top",
    })
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

/**
 * Laptop metrics from globals.css, which are written in rem for a frame
 * about 400px wide. Everything scales from that, so a larger frame here
 * keeps the bezel, bar and base in the same proportion.
 */
function laptop({
  x,
  y,
  width,
  url,
  src,
}: {
  x: number;
  y: number;
  width: number;
  url: string;
  src: string;
}) {
  const rem = (16 * width) / 400;
  const pad = 0.5 * rem;
  const viewW = width - pad * 2;
  const viewH = (viewW * 10) / 16;

  return (
    <div
      key={url}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width,
          padding: `${pad}px ${pad}px 0`,
          backgroundColor: "#1a1a1c",
          borderRadius: `${0.7 * rem}px ${0.7 * rem}px ${0.2 * rem}px ${0.2 * rem}px`,
          boxShadow: `0 2px 6px rgba(0,0,0,0.3), 0 ${2 * rem}px ${3.6 * rem}px -${1.4 * rem}px rgba(0,0,0,0.55)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: `${0.5 * rem}px ${0.7 * rem}px`,
            backgroundColor: "#f1efea",
            borderRadius: `${0.35 * rem}px ${0.35 * rem}px 0 0`,
          }}
        >
          <div style={{ display: "flex", marginRight: 0.6 * rem }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 0.5 * rem,
                  height: 0.5 * rem,
                  marginRight: i < 2 ? 0.3 * rem : 0,
                  borderRadius: 999,
                  backgroundColor: "rgba(11,31,29,0.16)",
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              backgroundColor: "#ffffff",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: 999,
              padding: `${0.22 * rem}px ${0.8 * rem}px`,
              fontFamily: "Inter",
              fontSize: 0.68 * rem,
              color: "#6e6e66",
            }}
          >
            <svg
              width={0.6 * rem}
              height={0.6 * rem}
              viewBox="0 0 24 24"
              style={{ marginRight: 0.35 * rem }}
            >
              <rect x="5" y="11" width="14" height="9" rx="2" fill="#7ba49e" />
              <path
                d="M8 11V8a4 4 0 0 1 8 0v3"
                stroke="#7ba49e"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            {url}
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          width={viewW}
          height={viewH}
          style={{
            width: viewW,
            height: viewH,
            borderRadius: `0 0 ${0.18 * rem}px ${0.18 * rem}px`,
          }}
          alt=""
        />
      </div>
      {/* The closed deck, 12% wider than the screen, with its notch. */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: width * 1.12,
          height: 0.85 * rem,
          backgroundImage: "linear-gradient(#cfcfd2, #a9a9ae 55%, #87878d)",
          borderRadius: `0 0 ${0.6 * rem}px ${0.6 * rem}px`,
          boxShadow: `0 ${0.9 * rem}px ${1.4 * rem}px -${0.6 * rem}px rgba(0,0,0,0.5)`,
        }}
      >
        <div
          style={{
            width: width * 1.12 * 0.18,
            height: 0.32 * rem,
            backgroundColor: "#8b8b91",
            borderRadius: `0 0 ${0.4 * rem}px ${0.4 * rem}px`,
          }}
        />
      </div>
    </div>
  );
}

/** Phone metrics, same scaling rule, from a frame about 160px wide. */
function phone({
  x,
  y,
  width,
  src,
}: {
  x: number;
  y: number;
  width: number;
  src: string;
}) {
  const rem = (16 * width) / 160;
  const pad = 0.32 * rem;
  const height = (width * 2556) / 1179;
  const viewW = width - pad * 2;
  const viewH = height - pad * 2;

  return (
    <div
      key="phone"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        display: "flex",
        padding: pad,
        backgroundColor: "#1a1a1c",
        borderRadius: 1.4 * rem,
        boxShadow: `0 2px 6px rgba(0,0,0,0.3), 0 ${1.6 * rem}px ${2.8 * rem}px -${1 * rem}px rgba(0,0,0,0.55)`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        width={viewW}
        height={viewH}
        style={{ width: viewW, height: viewH, borderRadius: 1.1 * rem }}
        alt=""
      />
      <div
        style={{
          position: "absolute",
          top: 0.55 * rem,
          left: (width - width * 0.26) / 2,
          width: width * 0.26,
          height: 0.18 * rem,
          borderRadius: 999,
          backgroundColor: "rgba(255,255,255,0.18)",
        }}
      />
    </div>
  );
}

/**
 * Placement, in card pixels. Satori stacks in source order, so the render
 * order below is the depth order: grain at the back, the phone in front.
 */
const LAYOUT = {
  grain: { x: 600, y: 58, width: 548 },
  figs: { x: 858, y: 250, width: 420 },
  phone: { x: 606, y: 292, width: 146 },
};

export async function ogHomeCard() {
  const grainView = LAYOUT.grain.width - (0.5 * 16 * LAYOUT.grain.width) / 400 * 2;
  const figsView = LAYOUT.figs.width - (0.5 * 16 * LAYOUT.figs.width) / 400 * 2;
  const phoneRem = (16 * LAYOUT.phone.width) / 160;
  const phoneH = (LAYOUT.phone.width * 2556) / 1179;

  const [fonts, grain, figs, roll] = await Promise.all([
    ogFonts(),
    screen("images/work/grain-construction.webp", grainView, (grainView * 10) / 16),
    screen("images/work/figs-and-honey.webp", figsView, (figsView * 10) / 16),
    screen(
      "images/grain/home_roll.webp",
      LAYOUT.phone.width - 0.64 * phoneRem,
      phoneH - 0.64 * phoneRem,
    ),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          backgroundColor: PAPER,
        }}
      >
        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          {gridLines()}
        </div>

        {laptop({ ...LAYOUT.grain, url: "grainconstruction.ca", src: grain })}
        {laptop({ ...LAYOUT.figs, url: "figsandhoney.com", src: figs })}
        {phone({ ...LAYOUT.phone, src: roll })}

        <div
          style={{
            position: "relative",
            width: 560,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "58px 0 58px 72px",
          }}
        >
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

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                width: 56,
                height: 3,
                backgroundColor: FOREST,
                marginBottom: 28,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontFamily: "Bricolage",
                fontSize: 104,
                lineHeight: 0.94,
                letterSpacing: "-0.035em",
                color: INK,
              }}
            >
              <span>Owen</span>
              <div style={{ display: "flex" }}>
                Brown<span style={{ color: FOREST }}>.</span>
              </div>
            </div>
            {/* Two set lines rather than a wrapped sentence, so the break
                falls between the two claims instead of inside "10+ live". */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 28,
                fontFamily: "Inter",
                fontSize: 25,
                lineHeight: 1.4,
                color: "rgba(15, 35, 32, 0.74)",
              }}
            >
              <span>Software engineering student.</span>
              <span>10+ live client sites and an iOS app.</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontFamily: "InterBold",
              fontSize: 17,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(15, 35, 32, 0.55)",
            }}
          >
            owenjosephbrown.com
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
