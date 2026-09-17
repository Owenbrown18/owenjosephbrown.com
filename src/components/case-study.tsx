import Image from "next/image";
import { Mdx } from "@/components/mdx";
import { PageHeader } from "@/components/page-header";
import { ExploreMore } from "@/components/explore-more";
import { kindLabel, type WorkEntry } from "@/lib/content";
import { img } from "@/lib/images";

/**
 * Every case study, one component: the animated masthead (PageHeader),
 * the hero media, the prose, and Explore more. The page under
 * /work/[slug] only resolves the entry; everything a reader sees and
 * every animation they see comes from here, so no two case studies can
 * drift. The masthead carries the entrance (sheet-still), the hero pops
 * in after it, the body reveals on scroll.
 */
function ext(href: string, label: string) {
  return (
    <a href={href} rel="noopener" className="link-underline font-medium text-fg">
      {label} ↗
    </a>
  );
}

export function CaseStudy({ entry }: { entry: WorkEntry }) {
  return (
    <article className="container-site pb-24 pt-32 sm:pt-36">
      <div className="sheet sheet-still">
        <PageHeader
          eyebrow={`${kindLabel[entry.kind]} · ${entry.year}`}
          title={entry.title}
          summary={entry.summary}
          meta={[
            { label: "Role", value: entry.role },
            { label: "Timeline", value: entry.timeline },
            { label: "Stack", value: entry.stack.join(" · "), wide: true },
            ...(entry.liveUrl
              ? [{ label: "Live", wide: true, value: ext(entry.liveUrl, entry.liveUrl.replace("https://", "")) }]
              : []),
            ...(entry.repoUrl
              ? [{ label: "Source", value: ext(entry.repoUrl, entry.repoUrl.replace("https://github.com/", "")) }]
              : []),
            ...(entry.downloadUrl
              ? [{ label: "Download", value: ext(entry.downloadUrl, entry.downloadLabel ?? "Latest release") }]
              : []),
          ]}
        />

        {/* Hero media pops in after the masthead. A video where the whole
            point is an interaction a still can't show; otherwise the hero. */}
        {entry.heroVideo ? (
          <div
            className="enter-pop relative mt-12 max-w-[52rem] overflow-hidden border border-line"
            style={{ "--i": 4 } as React.CSSProperties}
          >
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
            <div
              className="enter-pop relative mt-12 aspect-[16/9] max-w-[52rem] overflow-hidden border border-line"
              style={{ "--i": 4 } as React.CSSProperties}
            >
              <Image
                src={img(entry.hero)}
                alt={entry.heroAlt ?? entry.title}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 832px"
                className="object-cover object-top"
              />
            </div>
          )
        )}

        <div className="prose-ob mt-12">
          <Mdx source={entry.body} />
        </div>
      </div>
      <ExploreMore currentSlug={entry.slug} />
    </article>
  );
}
