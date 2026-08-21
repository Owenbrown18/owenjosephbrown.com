import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CursorLabel } from "@/components/cursor-label";

/**
 * One project, contained in a single box: its imagery composed inside a
 * fixed frame, then the index number, the name, the stack, and one line
 * saying what it is.
 *
 * The point of the frame is that every project reads at the same size and
 * the section scans like an index. The previous work section gave each
 * project a bespoke full-bleed block, which looked good and meant a new
 * project had to be hand-placed (and one silently wasn't).
 */
export type ProjectCardProps = {
  num: string;
  title: string;
  href: string;
  year: string;
  tags: string[];
  blurb: string;
  /** The composed contents of the image frame. */
  children: ReactNode;
  linkLabel?: string;
  /** Frames deliberately differ in shape so the row doesn't line up. */
  frameClass?: string;
  /** The project's own stage colour (frame-grain, frame-studio, ...). */
  tone?: string;
};

export function ProjectCard({
  num,
  title,
  href,
  year,
  tags,
  blurb,
  children,
  linkLabel = "Case study",
  frameClass = "aspect-[4/3]",
  tone = "",
}: ProjectCardProps) {
  return (
    <Link
      href={href}
      aria-label={`${title}: ${blurb}`}
      className="project-card reveal-up group relative block"
    >
      <CursorLabel />
      <div className={`project-frame ${frameClass} ${tone}`}>{children}</div>

      <div className="mt-6 flex items-end justify-between gap-4">
        <span className="font-display text-[clamp(2rem,4vw,2.75rem)] font-extrabold leading-none tracking-[-0.03em] text-white/90">
          {num}
        </span>
        <span
          aria-hidden
          className="mb-1 text-lg text-white/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sage"
        >
          ↗
        </span>
      </div>

      {/* A heading, not a paragraph: this is the index of the work, and
          heading navigation is how a screen reader reads an index. */}
      <h3 className="mt-3 border-t border-white/15 pt-3 font-display text-lg font-bold text-white/95">
        {title}
      </h3>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className="border border-white/12 bg-white/[0.04] px-2 py-0.5 text-[0.7rem] font-medium text-white/72"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-baseline justify-between border-t border-white/15 pt-3 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-white/40">
        <span>{year}</span>
        <span className="transition-colors group-hover:text-sage">
          {linkLabel}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-white/72">{blurb}</p>
    </Link>
  );
}

/**
 * One capture placed inside a composition. Position and width come from
 * the caller as percentages, so an arrangement holds at any frame size.
 */
export function Shot({
  src,
  alt,
  className,
  sizes,
  dataFloat,
  chrome = false,
  priority = false,
}: {
  src: string;
  alt: string;
  className: string;
  /** Must match the shot's real rendered width, not the frame's. */
  sizes: string;
  /** Order in the stage's entrance stagger; also the hover-depth group. */
  dataFloat?: number;
  /** Adds a slim title bar with traffic dots, for captures of bare UI. */
  chrome?: boolean;
  priority?: boolean;
}) {
  return (
    <div
      data-float={dataFloat}
      className={`absolute overflow-hidden border border-white/14 shadow-[0_2px_6px_-2px_rgba(15,35,32,0.12),0_22px_45px_-16px_rgba(15,35,32,0.35)] ${chrome ? "shot-chrome" : ""} ${className}`}
    >
      {chrome ? (
        <Image
          src={src}
          alt={alt}
          width={1400}
          height={1094}
          priority={priority}
          sizes={sizes}
          className="block h-auto w-full"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover object-top"
        />
      )}
    </div>
  );
}

/** A single screenshot filling the frame. */
export function FrameShot({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="(min-width: 768px) 46vw, 92vw"
      className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
    />
  );
}
