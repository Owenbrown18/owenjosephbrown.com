import type { ReactNode } from "react";
import Image from "next/image";
import { FrameShot, Shot } from "@/components/project-card";
import { PhoneFrame } from "@/components/phone-frame";
import { LaptopFrame } from "@/components/device-frames";
import { img } from "@/lib/images";
import type { WorkEntry } from "@/lib/content";

/**
 * How each project's imagery is arranged inside its frame. Several shots
 * at different sizes rather than one flat screenshot, because a single
 * capture of a phone app or a Mac app says almost nothing.
 *
 * A slug with no composition here falls back to its hero image, so a new
 * case study still shows up on its own.
 *
 * One home for the art: the home cards and the Explore more tiles at the
 * foot of every case study both draw from here, so the two can't show
 * different pictures of the same project again.
 */
export type Composition = {
  /** Tailwind aspect class for the home card's frame. */
  frame: string;
  /** The same aspect as a number, for frames of a different shape. */
  ratio: number;
  /** Stage colour class (frame-grain, frame-whispr, ...). */
  tone: string;
  art: ReactNode;
};

export const compositions: Record<string, Composition> = {
  grain: {
    frame: "aspect-[16/11]",
    ratio: 16 / 11,
    tone: "frame-grain",
    art: (
      <>
        <div className="absolute bottom-[-8%] left-[7%] w-[24%] -rotate-2">
          <PhoneFrame>
            <Image
              src={img("/images/grain/home_roll.webp")}
              alt=""
              width={260}
              height={563}
              sizes="(min-width: 768px) 260px, 30vw"
              className="h-auto w-full"
            />
          </PhoneFrame>
        </div>
        <div className="absolute bottom-[5%] left-[38%] z-10 w-[26%]">
          <PhoneFrame>
            <Image
              src={img("/images/grain/new_roll_qr.webp")}
              alt=""
              width={260}
              height={563}
              sizes="(min-width: 768px) 280px, 32vw"
              className="h-auto w-full"
            />
          </PhoneFrame>
        </div>
        <div className="absolute bottom-[-6%] right-[8%] w-[22%] rotate-2">
          <PhoneFrame>
            <Image
              src={img("/images/grain/waiting.webp")}
              alt=""
              width={260}
              height={563}
              sizes="(min-width: 768px) 240px, 27vw"
              className="h-auto w-full"
            />
          </PhoneFrame>
        </div>
      </>
    ),
  },
  "on-the-roadside": {
    frame: "aspect-[16/10]",
    ratio: 16 / 10,
    tone: "frame-roadside",
    art: (
      <>
        {/* The landing page behind, the app in front: the two halves of
            what shipped, a website on the web and the app on phones. */}
        <div className="absolute left-[4%] top-[6%] w-[68%]">
          <LaptopFrame url="ontheroadside.ca" size="mini">
            <Image
              src={img("/images/work/on-the-roadside.webp")}
              alt=""
              width={1600}
              height={1000}
              sizes="(min-width: 768px) 560px, 68vw"
            />
          </LaptopFrame>
        </div>
        <div className="absolute bottom-[-10%] right-[21%] z-10 w-[22%] -rotate-2">
          <PhoneFrame>
            <Image
              src={img("/images/on-the-roadside/app-home.webp")}
              alt=""
              width={620}
              height={1347}
              sizes="(min-width: 768px) 240px, 27vw"
              className="h-auto w-full"
            />
          </PhoneFrame>
        </div>
        <div className="absolute bottom-[-4%] right-[4%] z-20 w-[20%] rotate-2">
          <PhoneFrame>
            <Image
              src={img("/images/on-the-roadside/app-detail.webp")}
              alt=""
              width={620}
              height={1347}
              sizes="(min-width: 768px) 220px, 25vw"
              className="h-auto w-full"
            />
          </PhoneFrame>
        </div>
      </>
    ),
  },
  whispr: {
    frame: "aspect-[16/9]",
    ratio: 16 / 9,
    tone: "frame-whispr",
    art: (
      <>
        {/* The app itself, not fragments of it: the real settings window
            (its own macOS chrome) with the two HUD pills in front. The
            pills are re-rendered from Whispr's source styles (Hud.tsx)
            with real alpha, so their corners are actually round. */}
        <Shot
          src={img("/images/whispr/settings-general.webp")}
          alt=""
          className="left-[4%] top-[7%] w-[58%] aspect-[1400/1094] rounded-lg"
          sizes="(min-width: 768px) 480px, 58vw"
        />
        <div className="absolute right-[6%] top-[34%] z-10 w-[32%]">
          <Image
            src={img("/images/whispr/pill-listening-v2.webp")}
            alt=""
            width={254}
            height={64}
            sizes="(min-width: 768px) 265px, 32vw"
            className="h-auto w-full drop-shadow-[0_10px_24px_rgba(15,35,32,0.4)]"
          />
        </div>
        <div className="absolute right-[11%] top-[52%] z-10 w-[29%]">
          <Image
            src={img("/images/whispr/pill-transcribing-v2.webp")}
            alt=""
            width={260}
            height={64}
            sizes="(min-width: 768px) 240px, 29vw"
            className="h-auto w-full drop-shadow-[0_10px_24px_rgba(15,35,32,0.4)]"
          />
        </div>
      </>
    ),
  },
  leadgen: {
    frame: "aspect-[16/10]",
    ratio: 16 / 10,
    tone: "frame-leadgen",
    art: (
      <>
        {/* The dashboard the operation runs from, on the machine it runs
            on: a single local HTML file, so the laptop's URL bar carries
            the file name rather than a domain. */}
        <div className="absolute left-[4%] top-[6%] w-[66%]">
          <LaptopFrame url="leads-dashboard.html" size="mini">
            <Image
              src={img("/images/leadgen/dashboard-top.webp")}
              alt=""
              width={1400}
              height={700}
              sizes="(min-width: 768px) 545px, 66vw"
              // Left-anchored: the centre crop sliced the lead names in
              // half, and the code window covers the right side anyway.
              style={{ objectPosition: "left top" }}
            />
          </LaptopFrame>
        </div>
        {/* The classifier itself, rendered from the real source: the
            system is the product here, so the code is the better photo. */}
        <Shot
          src={img("/images/leadgen/classifier-code.webp")}
          alt=""
          className="bottom-[6%] right-[4%] z-10 w-[50%] aspect-[1564/982]"
          sizes="(min-width: 768px) 415px, 50vw"
        />
      </>
    ),
  },
};


/**
 * A project's art for a frame of any shape. In a frame of its own aspect
 * (the home card) the composition fills it exactly. In a frame of a
 * different aspect (an Explore more tile) it is drawn whole at its own
 * aspect, like object-fit: contain, and clipped at its own edges, so the
 * picture is identical to the home card's. (Cover-fitting was tried
 * first and trimmed a quarter off Whispr's sides.)
 */
export function WorkArt({
  entry,
  fit = "exact",
}: {
  entry: Pick<WorkEntry, "slug" | "title" | "hero" | "heroAlt" | "thumb">;
  fit?: "exact" | "contain";
}) {
  const c = compositions[entry.slug];
  if (!c) {
    const src = entry.thumb ?? entry.hero ?? "/images/work/grain-construction.webp";
    return <FrameShot src={img(src)} alt={entry.heroAlt ?? entry.title} />;
  }
  if (fit === "exact") return <>{c.art}</>;
  return (
    <div
      className="work-art-fit"
      style={{ "--art-ratio": c.ratio } as React.CSSProperties}
    >
      {c.art}
    </div>
  );
}
