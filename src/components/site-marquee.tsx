import Image from "next/image";
import { clientSites } from "@/lib/sites";
import { LaptopFrame } from "@/components/device-frames";
import { PixelCells } from "@/components/pixel-cells";

/**
 * Looping strip of client-site screenshots. Two identical halves and a
 * -50% translate make the loop seamless; the halves are separated with
 * margins, not flex gap, so the wrap point is invisible. Stops under
 * prefers-reduced-motion (scrollable instead).
 */
function Half({ hidden = false }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden} className="marquee-half">
      {clientSites.map((site) => (
        <a
          key={site.slug}
          href={site.url}
          rel="noopener"
          tabIndex={hidden ? -1 : undefined}
          className="marquee-card stage group"
        >
          <div className="marquee-laptop">
            <LaptopFrame
              size="mini"
              url={site.url.replace(/^https?:\/\//, "")}
            >
              <Image
                src={`/images/work/${site.slug}.webp`}
                alt={hidden ? "" : `${site.name} website`}
                width={420}
                height={263}
                sizes="320px"
              />
              {/* The stage hover, inside the laptop screen: cells fill the
                  viewport and the site's name lands over it. Same motion as
                  every other tile on the site, no scale pop. */}
              <PixelCells seed={site.name} variant="hover" cols={8} rows={5} spread={220} />
              <span aria-hidden className="frame-veil frame-veil--sm">
                View {site.name}
                <span className="frame-veil__arrow">↗</span>
              </span>
            </LaptopFrame>
          </div>
          <p className="mt-2 text-xs text-white/75 transition-colors group-hover:text-white">
            {site.name}
          </p>
        </a>
      ))}
    </div>
  );
}

export function SiteMarquee() {
  return (
    <div
      className="marquee"
      role="group"
      aria-label="Client websites"
      data-pause-offscreen
    >
      <div className="marquee-track">
        <Half />
        <Half hidden />
      </div>
    </div>
  );
}
