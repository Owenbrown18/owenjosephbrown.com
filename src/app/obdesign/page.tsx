import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { clientSites } from "@/lib/sites";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "OBdesign — the studio",
  description:
    "Nine production websites for BC businesses, every one custom-coded and client-editable. The studio side of Owen Brown.",
};

export default function ObdesignPage() {
  return (
    <div className="container-site pb-24 pt-36 sm:pt-40">
      <PageHeader
        eyebrow="The studio · June 2025 – present"
        title={
          <>
            OBdesign<span className="text-accent">.</span>
          </>
        }
        meta={[
          { label: "Role", value: "Founder & web developer" },
          { label: "Sites live", value: "Nine, all in production" },
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
            The numbers I actually track: nine production sites live, roughly
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
          <article key={site.slug} className="reveal-up">
            <a href={site.url} rel="noopener" className="group block">
              <div className="overflow-hidden border border-line bg-surface">
                <Image
                  src={`/images/work/${site.slug}.webp`}
                  alt={`${site.name} website on desktop`}
                  width={840}
                  height={525}
                  priority={i < 2}
                  className="h-auto w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
            </a>
            <div className="mt-4 flex items-baseline justify-between gap-4">
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
  );
}
