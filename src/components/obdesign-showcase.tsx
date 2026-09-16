"use client";

import Image from "next/image";
import { useState } from "react";
import { caseStudyUrl, clientSites } from "@/lib/sites";
import { LaptopFrame } from "@/components/device-frames";
import { ArrowUpRightIcon } from "@/components/icons";

const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/**
 * The client roster as one big laptop: pick a name, the site appears in
 * the frame with its real URL in the bar, and the two links follow the
 * selection. The pattern is obwebdesign.ca's own client showcase, which
 * is where a visitor coming from there has already seen it.
 *
 * One laptop at ~40rem instead of nine at card size: at card size every
 * screenshot turned to mush, which was the whole complaint. All shots
 * stay mounted and cross-fade, so switching is instant after first view.
 */
export function ObdesignShowcase() {
  const [index, setIndex] = useState(0);
  const active = clientSites[index];

  return (
    <div className="obshow-stage">
      <LaptopFrame url={host(active.url)}>
        <div className="obshow-shots">
          {clientSites.map((site, i) => (
            <Image
              key={site.slug}
              src={`/images/work/${site.slug}.webp`}
              alt={i === index ? `${site.name} website on desktop` : ""}
              fill
              sizes="(min-width: 1024px) 40rem, 92vw"
              priority={i === 0}
              aria-hidden={i !== index}
              className={`obshow-shot${i === index ? " is-active" : ""}`}
            />
          ))}
        </div>
      </LaptopFrame>

      <div className="obshow-pills" role="tablist" aria-label="Client sites">
        {clientSites.map((site, i) => (
          <button
            key={site.slug}
            type="button"
            role="tab"
            aria-selected={i === index}
            className={`obshow-pill${i === index ? " is-active" : ""}`}
            onClick={() => setIndex(i)}
          >
            {site.name}
          </button>
        ))}
      </div>

      <div className="obshow-actions">
        <span className="label-mono obshow-counter" aria-hidden>
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(clientSites.length).padStart(2, "0")}
        </span>
        <a href={active.url} rel="noopener" className="btn">
          <span className="btn__label inline-flex items-center gap-1.5">
            Visit {host(active.url).replace(/^www\./, "")}
            <ArrowUpRightIcon />
          </span>
        </a>
        {!active.noCaseStudy && (
          <a href={caseStudyUrl(active)} rel="noopener" className="btn">
            <span className="btn__label inline-flex items-center gap-1.5">
              Case study
              <ArrowUpRightIcon />
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
