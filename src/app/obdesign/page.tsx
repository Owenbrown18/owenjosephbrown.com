import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { clientSites } from "@/lib/sites";
import { PixelCells } from "@/components/pixel-cells";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "OBdesign",
  description:
    "10+ production websites for BC businesses, every one custom-coded and client-editable. The studio side of Owen Brown.",
};

export default function ObdesignPage() {
  return (
    <div className="container-site pb-24 pt-32 sm:pt-36">
      <div className="sheet sheet-wide">
      <PageHeader
        eyebrow="The studio · June 2025 – present"
        title={
          <>
            OBdesign<span className="text-accent">.</span>
          </>
        }
        meta={[
          { label: "Role", value: "Founder & web developer" },
          { label: "Sites shipped", value: "10+, generating $20,000+" },
          {
            label: "Stack",
            value: "Next.js · Astro · TypeScript · Keystatic",
            wide: true,
          },
          {
            label: "Studio",
            value: (
              <a
                href="https://www.obwebdesign.ca"
                rel="noopener"
                className="link-underline font-medium text-fg"
              >
                obwebdesign.ca ↗
              </a>
            ),
          },
        ]}
      >
        <div className="mt-6 max-w-[58ch] space-y-5 text-fg-muted">
          <p>
            OBdesign is my one-person web studio. Every site below is a real
            business paying real money for work they rely on: custom-coded
            Next.js or Astro builds with a git-based CMS, so every client
            edits their own content without touching code.
          </p>
          <p>
            The numbers I actually track: 10+ sites shipped and $20,000+ in revenue, roughly
            7% of first cold emails converting to paying projects (found by{" "}
            <Link href="/work/leadgen" className="link-underline text-fg">
              a pipeline I wrote
            </Link>
            ), and a fastest brief-to-live rebuild of six days. Beyond the
            code, I handle domains, DNS cutovers with zero email downtime,
            performance budgets, SEO, and the phone call when something
            breaks.
          </p>
        </div>
      </PageHeader>

      <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2">
        {clientSites.map((site, i) => (
          <article key={site.slug}>
            {/* Same stage as the work cards: the site dissolves in behind
                a pixel grid and fills with the accent on hover, no jump. */}
            <a href={site.url} rel="noopener" className="stage reveal-up block">
              <span className="stage-frame">
                <Image
                  src={`/images/work/${site.slug}.webp`}
                  alt={`${site.name} website on desktop`}
                  width={840}
                  height={525}
                  priority={i < 2}
                  className="h-auto w-full object-cover object-top"
                />
                <PixelCells seed={site.name} variant="reveal" />
                <PixelCells seed={site.name} variant="hover" cols={10} rows={6} spread={260} />
                <span aria-hidden className="frame-veil">
                  View {site.name}
                  <span className="frame-veil__arrow">↗</span>
                </span>
              </span>
            </a>
            <div className="reveal-up mt-4 flex items-baseline justify-between gap-4">
              <h2 className="font-display text-xl font-bold text-fg">
                {site.name}
              </h2>
              <a
                href={site.url}
                rel="noopener"
                className="shrink-0 text-xs text-fg-faint transition-colors hover:text-fg"
              >
                {site.url.replace("https://", "").replace("www.", "")} ↗
              </a>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              {site.blurb}
            </p>
            {site.caseStudy && (
              <p className="mt-3 text-sm">
                <Link href={site.caseStudy} className="link-underline text-fg">
                  Read the case study
                </Link>
              </p>
            )}
          </article>
        ))}
      </div>

      <div className="mt-20 border-t border-line pt-10">
        <p className="max-w-[52ch] text-fg-muted">
          Three of these builds have full engineering write-ups: the problem,
          the decisions, and what happened after launch.
        </p>
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
          {clientSites
            .filter((s) => s.caseStudy)
            .map((s) => (
              <Link
                key={s.slug}
                href={s.caseStudy!}
                className="link-underline font-display text-lg font-bold text-fg"
              >
                {s.name} →
              </Link>
            ))}
        </div>
      </div>
      </div>
    </div>
  );
}
