import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWorkEntries, getWorkEntry } from "@/lib/content";
import { CaseStudy } from "@/components/case-study";

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
  return <CaseStudy entry={entry} />;
}
