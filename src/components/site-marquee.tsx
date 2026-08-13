import Image from "next/image";
import Link from "next/link";
import { clientSites } from "@/lib/sites";

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
        <Link
          key={site.slug}
          href="/obdesign"
          tabIndex={hidden ? -1 : undefined}
          className="marquee-card group"
        >
          <div className="overflow-hidden border border-white/15 bg-forest">
            <Image
              src={`/images/work/${site.slug}.png`}
              alt={hidden ? "" : `${site.name} website`}
              width={420}
              height={263}
              className="h-auto w-[260px] object-cover object-top transition-transform duration-300 group-hover:scale-[1.03] sm:w-[320px]"
            />
          </div>
          <p className="mt-2 text-xs text-white/55 transition-colors group-hover:text-white/85">
            {site.name}
          </p>
        </Link>
      ))}
    </div>
  );
}

export function SiteMarquee() {
  return (
    <div className="marquee" role="group" aria-label="Client websites">
      <div className="marquee-track">
        <Half />
        <Half hidden />
      </div>
    </div>
  );
}
