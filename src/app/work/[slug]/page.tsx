import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Mdx } from "@/components/mdx";
import { getWorkEntries, getWorkEntry, kindLabel } from "@/lib/content";

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
    <article className="container-site py-16 sm:py-24">
      <header className="max-w-[52rem]">
        <p className="eyebrow">
          {kindLabel[entry.kind]} · {entry.year}
        </p>
        <h1 className="mt-4 text-[clamp(2.75rem,7vw,5rem)]">{entry.title}</h1>
        <p className="mt-5 max-w-[52ch] text-lg text-fg-muted">
          {entry.summary}
        </p>
      </header>

      <dl className="mt-10 grid max-w-[52rem] grid-cols-2 gap-x-8 gap-y-5 border-y border-line py-6 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs text-fg-faint">Role</dt>
          <dd className="mt-1 text-fg">{entry.role}</dd>
        </div>
        <div>
          <dt className="text-xs text-fg-faint">Timeline</dt>
          <dd className="mt-1 text-fg">{entry.timeline}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs text-fg-faint">Stack</dt>
          <dd className="mt-1 text-fg">{entry.stack.join(" · ")}</dd>
        </div>
        {entry.liveUrl && (
          <div className="col-span-2 sm:col-span-4">
            <dt className="sr-only">Live site</dt>
            <dd>
              <a
                href={entry.liveUrl}
                rel="noopener"
                className="link-underline font-medium text-fg"
              >
                {entry.liveUrl.replace("https://", "")} ↗
              </a>
            </dd>
          </div>
        )}
      </dl>

      {entry.hero && (
        <div className="relative mt-12 aspect-[16/9] max-w-[52rem] overflow-hidden border border-line">
          <Image
            src={entry.hero}
            alt={entry.heroAlt ?? entry.title}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 832px"
            className="object-cover object-top"
          />
        </div>
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
