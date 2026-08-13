import { getWorkEntries, getWorkEntry, kindLabel } from "@/lib/content";
import { ogCard, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Case study";

export function generateStaticParams() {
  return getWorkEntries().map(({ slug }) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getWorkEntry(slug);
  return ogCard({
    title: entry?.title ?? "Work",
    subtitle: entry
      ? `${kindLabel[entry.kind]} · ${entry.stack.join(" · ")}`
      : "Case study",
  });
}
