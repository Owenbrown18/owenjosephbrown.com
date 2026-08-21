import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Mdx } from "@/components/mdx";
import { getWorkEntries, getWorkEntry, kindLabel } from "@/lib/content";
import { PageHeader } from "@/components/page-header";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getWorkEntries().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getWorkEntry(slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.summary,
    openGraph: { title: entry.title, description: entry.summary },
  };
}

export default async function WorkEntryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const entry = getWorkEntry(slug);
  if (!entry) notFound();

  const entries = getWorkEntries();
  const index = entries.findIndex((e) => e.slug === entry.slug);
  const next = entries[(index + 1) % entries.length];

  return (
    <article className="container-site pb-24 pt-36 sm:pt-40">
      <PageHeader
        eyebrow={`${kindLabel[entry.kind]} · ${entry.year}`}
        title={entry.title}
        summary={entry.summary}
        meta={[
          { label: "Role", value: entry.role },
          { label: "Timeline", value: entry.timeline },
          { label: "Stack", value: entry.stack.join(" · "), wide: true },
          ...(entry.liveUrl
            ? [
                {
                  label: "Live",
                  wide: true,
                  value: (
                    <a
                      href={entry.liveUrl}
                      rel="noopener"
                      className="link-underline font-medium text-fg"
                    >
                      {entry.liveUrl.replace("https://", "")} ↗
                    </a>
                  ),
                },
              ]
            : []),
          ...(entry.repoUrl
            ? [
                {
                  label: "Source",
                  value: (
                    <a
                      href={entry.repoUrl}
                      rel="noopener"
                      className="link-underline font-medium text-fg"
                    >
                      {entry.repoUrl.replace("https://github.com/", "")} ↗
                    </a>
                  ),
                },
              ]
            : []),
          ...(entry.downloadUrl
            ? [
                {
                  label: "Download",
                  value: (
                    <a
                      href={entry.downloadUrl}
                      rel="noopener"
                      className="link-underline font-medium text-fg"
                    >
                      {entry.downloadLabel ?? "Latest release"} ↗
                    </a>
                  ),
                },
              ]
            : []),
        ]}
      />

      {entry.heroVideo ? (
        <div className="anim-image relative mt-12 max-w-[52rem] overflow-hidden border border-line">
          {/* muted + playsInline are what let this start on its own; a
              still frame cannot show a five-second interaction. */}
          <video
            src={entry.heroVideo}
            poster={entry.hero}
            autoPlay
            loop
            muted
            playsInline
            aria-label={entry.heroAlt ?? entry.title}
            className="block h-auto w-full"
          />
        </div>
      ) : (
        entry.hero && (
          <div className="relative mt-12 aspect-[16/9] max-w-[52rem] overflow-hidden border border-line">
            <Image
              src={entry.hero}
              alt={entry.heroAlt ?? entry.title}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 832px"
              className="anim-image object-cover object-top"
            />
          </div>
        )
      )}

      <div className="prose-ob mt-12">
        <Mdx source={entry.body} />
      </div>

      <nav
        aria-label="More work"
        className="mt-20 flex items-center justify-between border-t border-line pt-8"
      >
        <Link
          href={entry.kind === "client" ? "/obdesign" : "/#work"}
          className="text-sm text-fg-faint hover:text-fg"
        >
          {entry.kind === "client" ? "← The studio" : "← My work"}
        </Link>
        <Link
          href={`/work/${next.slug}`}
          className="group text-right"
        >
          <span className="block text-xs text-fg-faint">Next</span>
          <span className="link-underline font-display text-xl font-bold text-fg">
            {next.title}
          </span>
        </Link>
      </nav>
    </article>
  );
}
