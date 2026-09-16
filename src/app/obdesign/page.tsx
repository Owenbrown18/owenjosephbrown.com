import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { caseStudyUrl, clientSites } from "@/lib/sites";
import { PixelCells } from "@/components/pixel-cells";
import { ExploreMore } from "@/components/explore-more";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "OBdesign",
  description:
    "More than 25 websites deployed, 11 of them live client sites for BC businesses, every one custom-coded and client-editable. Owen Brown's web development business.",
};

export default function ObdesignPage() {
  return (
    <div className="container-site pb-24 pt-32 sm:pt-36">
      <div className="sheet sheet-wide sheet-still">
      <PageHeader
        eyebrow="Web development · June 2025 – present"
        title={
          <>
            OBdesign<span className="text-accent">.</span>
          </>
        }
        meta={[
          { label: "Role", value: "Founder & web developer" },
          { label: "Sites shipped", value: "25+ deployed · 11 live client sites" },
          {
            label: "Stack",
            value: "Next.js · Astro · TypeScript · Keystatic",
            wide: true,
          },
          {
            label: "Site",
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
            OBdesign is my one-person web development business. Every site below is a real
            business paying real money for work they rely on: custom-coded
            Next.js or Astro builds with a git-based CMS, so every client
            edits their own content without touching code.
          </p>
          <p>
            The numbers I actually track: more than 25 sites deployed, 11 of
            them live client sites, $10,000+ collected, roughly
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
            {!site.noCaseStudy && (
              <p className="mt-3 text-sm">
                <a
                  href={caseStudyUrl(site)}
                  rel="noopener"
                  className="link-underline text-fg"
                >
                  Read the case study on obwebdesign.ca ↗
                </a>
              </p>
            )}
          </article>
        ))}
      </div>

      </div>
      <ExploreMore />
    </div>
  );
}
