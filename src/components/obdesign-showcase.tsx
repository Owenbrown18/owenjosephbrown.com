"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { caseStudyUrl, clientSites } from "@/lib/sites";
import { siteShots } from "@/lib/site-shots";
import { LaptopFrame } from "@/components/device-frames";
import { ArrowUpRightIcon } from "@/components/icons";
import { PixelCells } from "@/components/pixel-cells";

const host = (url: string) =>
  url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

/**
 * The client roster as an index beside one big laptop: rows of names on
 * hairlines (the same index language as the work grid and the footer),
 * and picking a row swaps the site in the frame, the URL in its bar, and
 * the two links under it. One laptop at ~40rem instead of nine at card
 * size, because at card size every screenshot turned to mush.
 *
 * All shots stay mounted and cross-fade, so switching is instant after
 * first view. Side by side only from xl: at lg the list column is too
 * narrow for a magnified name to clear its domain (measured: 1.09x room
 * at 1024px against a 1.4x magnifier). Below xl the laptop sits above
 * the list; picking a row far down nudges the frame back into view.
 */
export function ObdesignShowcase() {
  // Two levels of intent: hovering a row previews its site in the
  // laptop, clicking pins it. When the pointer leaves the list the
  // frame falls back to the pinned row, so browsing costs nothing.
  const [pinned, setPinned] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const index = hovered ?? pinned;
  const active = clientSites[index];

  const pick = (i: number) => {
    setPinned(i);
    // Only below xl, where the laptop is above the list and a tap on a
    // low row can leave it off-screen. "nearest" makes it a no-op when
    // the frame is already visible.
    if (window.matchMedia("(max-width: 1279px)").matches) {
      stageRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <div className="mt-12 grid gap-10 xl:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] xl:gap-16">
      <div className="order-2 xl:order-1">
        <div
          role="tablist"
          aria-label="Client sites"
          onMouseLeave={() => setHovered(null)}
        >
          {clientSites.map((site, i) => (
            <button
              key={site.slug}
              type="button"
              role="tab"
              aria-selected={i === pinned}
              className={`obindex-row${i === pinned ? " is-active" : ""}`}
              onClick={() => pick(i)}
              onMouseEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
            >
              <span aria-hidden className="obindex-mark" />
              <span className="obindex-name font-display">{site.name}</span>
              <span className="obindex-domain label-mono">
                {host(site.url)}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <Link href="/obdesign" className="btn">
            <PixelCells seed="The full story" variant="hover" cols={9} rows={3} spread={240} />
            <span className="btn__label inline-flex items-center gap-2">
              The full story
              <ArrowUpRightIcon />
            </span>
          </Link>
          <a href="https://www.obwebdesign.ca" rel="noopener" className="btn">
            <PixelCells seed="obwebdesign.ca" variant="hover" cols={9} rows={3} spread={240} />
            <span className="btn__label inline-flex items-center gap-2">
              obwebdesign.ca
              <ArrowUpRightIcon />
            </span>
          </a>
        </div>
      </div>

      <div
        ref={stageRef}
        className="order-1 mx-auto w-full max-w-[46rem] scroll-mt-24 xl:order-2 xl:max-w-none xl:self-start"
      >
        <LaptopFrame url={host(active.url)}>
          <div className="obshow-shots">
            {clientSites.map((site, i) => (
              <Image
                key={site.slug}
                src={siteShots[site.slug]}
                alt={i === index ? `${site.name} website on desktop` : ""}
                fill
                sizes="(min-width: 1280px) 40rem, (min-width: 768px) 46rem, 92vw"
                priority={i === 0}
                aria-hidden={i !== index}
                className={`obshow-shot${i === index ? " is-active" : ""}`}
              />
            ))}
            {/* Keyed on the shown site: every swap remounts the grid and
                the cells blink once over the incoming shot. */}
            <PixelCells
              key={active.slug}
              seed={active.slug}
              variant="flash"
              cols={12}
              rows={7}
            />
          </div>
        </LaptopFrame>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="label-mono text-white/50" aria-hidden>
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(clientSites.length).padStart(2, "0")}
          </span>
          <a
            href={active.url}
            rel="noopener"
            className="link-draw inline-flex items-center gap-1.5 text-sm text-white/75"
          >
            Visit {host(active.url)}
            <ArrowUpRightIcon />
          </a>
          {!active.noCaseStudy && (
            <a
              href={caseStudyUrl(active)}
              rel="noopener"
              className="link-draw inline-flex items-center gap-1.5 text-sm text-white/75"
            >
              Case study
              <ArrowUpRightIcon />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
