import Image from "next/image";
import Link from "next/link";
import { getWorkEntries, kindLabel } from "@/lib/content";
import { PixelCells } from "@/components/pixel-cells";

/**
 * The foot of every case study: four other projects as small tiles, so a
 * reader who finished one has the next ones in front of them instead of
 * a single "next" link. Each tile is the project's hero on its own stage
 * tone, with the same pixel-fill hover the work cards use.
 */
const tone: Record<string, string> = {
  grain: "frame-grain",
  whispr: "frame-whispr",
  leadgen: "frame-leadgen",
};

export function ExploreMore({ currentSlug }: { currentSlug: string }) {
  const others = getWorkEntries()
    .filter((e) => e.slug !== currentSlug)
    .slice(0, 4);
  if (!others.length) return null;

  return (
    <section
      aria-labelledby="explore-heading"
      className="mx-auto mt-24 w-full max-w-[80rem] border-t border-line pt-12"
    >
      <div className="flex items-end justify-between gap-6">
        <h2
          id="explore-heading"
          className="anim-heading text-[clamp(2rem,4.5vw,3rem)] text-fg"
        >
          Explore more<span className="text-sage">.</span>
        </h2>
        <Link href="/#work" className="link-draw text-sm text-fg-faint">
          All work
        </Link>
      </div>
      <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {others.map((e) => (
          <li key={e.slug}>
            <Link href={`/work/${e.slug}`} className="explore-tile stage reveal-up block">
              <span
                className={`explore-tile__frame ${tone[e.slug] ?? "frame-studio"}`}
              >
                {(e.thumb ?? e.hero) && (
                  <Image
                    src={e.thumb ?? e.hero!}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 20rem, (min-width: 640px) 45vw, 100vw"
                    className="object-cover object-top"
                  />
                )}
                <PixelCells seed={e.title} variant="reveal" />
                <PixelCells seed={e.title} variant="hover" cols={10} rows={6} spread={260} />
                <span aria-hidden className="frame-veil">
                  View {e.title}
                  <span className="frame-veil__arrow">↗</span>
                </span>
              </span>
              <span className="mt-4 block font-display text-xl font-bold text-fg">
                {e.title}
              </span>
              <span className="mt-1 block text-sm text-fg-faint">
                {kindLabel[e.kind]} · {e.year}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
