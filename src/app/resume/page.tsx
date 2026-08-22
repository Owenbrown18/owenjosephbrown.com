import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import Link from "next/link";
import {
  education,
  experience,
  identity,
  projects,
  skills,
} from "@/lib/resume-data";
import { PixelCells } from "@/components/pixel-cells";
import {
  ArrowUpRightIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Résumé",
  description:
    "Owen Brown: software engineering student at UVic, founder of OBdesign, seeking a Spring 2027 co-op.",
};

const PDF = "/owen-brown-resume.pdf";

/**
 * One résumé entry, role first: the role in bold, org · place under it,
 * the period right-aligned in mono, then the bullets. Each bullet carries
 * its index so the reveal can cascade them one after another.
 */
function Entry({
  role,
  org,
  location,
  period,
  link,
  bullets,
  detail,
}: {
  role: string;
  org: string;
  location: string;
  period: string;
  link?: string;
  bullets?: readonly string[];
  detail?: string;
}) {
  return (
    <article className="resume-entry reveal-up border-t border-line py-7">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <div>
          <h3 className="font-display text-xl font-bold text-fg">{role}</h3>
          <p className="mt-0.5 text-sm text-fg-muted">
            {link ? (
              <a href={link} rel="noopener" className="link-draw inline-flex items-center gap-1">
                {org}
                <ArrowUpRightIcon />
              </a>
            ) : (
              org
            )}
            <span className="text-fg-faint"> · {location}</span>
          </p>
        </div>
        <p className="label-mono text-fg-faint">{period}</p>
      </div>
      {detail && <p className="mt-3 max-w-[60ch] text-sm text-fg-muted">{detail}</p>}
      {bullets && (
        <ul className="mt-4 space-y-1.5">
          {bullets.map((b, i) => (
            <li
              key={b}
              style={{ "--li": i } as React.CSSProperties}
              className="flex gap-3 text-sm leading-relaxed text-fg-muted"
            >
              <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-sage" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function RailHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="anim-heading text-[clamp(1.5rem,2.6vw,1.9rem)] text-fg">
      {children}
      <span className="text-sage">.</span>
    </h2>
  );
}

function ChipRow({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div className="reveal-up mt-5">
      <p className="label-mono text-fg-faint">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item} className="chip">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Square icon button: same .btn, icon only, name for assistive tech. */
function IconButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} rel="me noopener" aria-label={label} className="btn !px-2.5">
      <PixelCells seed={label} variant="hover" cols={4} rows={3} spread={180} />
      <span className="btn__label inline-flex">{children}</span>
    </a>
  );
}

export default function ResumePage() {
  // Checked at build time: the PDF is optional, the page is the résumé.
  const hasPdf = existsSync(join(process.cwd(), "public", PDF.slice(1)));
  const [first, ...rest] = identity.name.split(" ");

  return (
    <div className="container-site pb-24 pt-32 sm:pt-36">
      <div className="sheet sheet-wide">
        {/* Masthead: photo, name, the pitch, the actions. */}
        <header className="grid items-center gap-8 sm:grid-cols-[9rem_1fr] sm:gap-12">
          <Image
            src="/images/about/owen-brown.jpg"
            alt="Owen Brown"
            width={288}
            height={288}
            priority
            sizes="144px"
            className="aspect-square w-36 rounded-full border border-line object-cover object-top print:w-28"
          />
          <div>
            <p className="eyebrow">Résumé</p>
            <h1 className="anim-heading mt-3 text-[clamp(2.75rem,6vw,4.5rem)] text-fg">
              {first} <span className="text-sage">{rest.join(" ")}</span>
            </h1>
            <p className="mt-4 max-w-[60ch] text-[1.05rem] leading-relaxed text-fg-muted">
              {identity.title} · {identity.location}. Seeking {identity.seeking}.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2 print:hidden">
              {hasPdf && (
                <a href={PDF} target="_blank" rel="noopener" className="btn">
                  <PixelCells seed="resume-pdf" variant="hover" cols={10} rows={3} spread={240} />
                  <span className="btn__label inline-flex items-center gap-2">
                    Open the PDF
                    <ArrowUpRightIcon />
                  </span>
                </a>
              )}
              <IconButton href={`mailto:${identity.email}`} label="Email Owen">
                <MailIcon className="h-4 w-4" />
              </IconButton>
              <IconButton href={identity.github} label="GitHub">
                <GitHubIcon className="h-4 w-4" />
              </IconButton>
              <IconButton href={identity.linkedin} label="LinkedIn">
                <LinkedInIcon className="h-4 w-4" />
              </IconButton>
            </div>
            {/* Print gets the plain contact line the buttons stand in for. */}
            <p className="mt-3 hidden text-sm text-fg-muted print:block">
              {identity.email} · {identity.github.replace("https://", "")} ·{" "}
              {identity.linkedin.replace("https://www.", "")}
            </p>
          </div>
        </header>

        {/* Body: a rail for education and skills, the record on the right. */}
        <div className="resume-body mt-16 grid gap-14 lg:grid-cols-[19rem_1fr] lg:gap-14">
          <aside className="resume-rail lg:pr-10">
            <section aria-labelledby="resume-education">
              <RailHeading>
                <span id="resume-education">Education</span>
              </RailHeading>
              <div className="reveal-up mt-5 border-t border-line pt-5">
                <h3 className="font-display text-lg font-bold text-fg">
                  {education.credential}
                </h3>
                <p className="mt-0.5 text-sm text-fg-muted">{education.org}</p>
                <p className="label-mono mt-1.5 text-fg-faint">{education.period}</p>
              </div>
              <ChipRow
                label="Relevant coursework"
                items={education.coursework.completed}
              />
              <ChipRow
                label="In progress · Sep–Dec 2026"
                items={education.coursework.inProgress}
              />
            </section>

            <section aria-labelledby="resume-skills" className="mt-14">
              <RailHeading>
                <span id="resume-skills">Skills</span>
              </RailHeading>
              <div className="mt-1 border-t border-line">
                {skills.map((group) => (
                  <ChipRow
                    key={group.label}
                    label={group.label}
                    items={group.items.split(", ")}
                  />
                ))}
              </div>
            </section>
          </aside>

          <div className="min-w-0">
            <section aria-labelledby="resume-experience">
              <RailHeading>
                <span id="resume-experience">Experience</span>
              </RailHeading>
              <div className="mt-5">
                {experience.map((e) => (
                  <Entry
                    key={e.org + e.period}
                    role={e.role}
                    org={e.org}
                    location={e.location}
                    period={e.period}
                    link={e.link}
                    bullets={e.bullets}
                  />
                ))}
              </div>
            </section>

            {projects.length > 0 && (
              <section aria-labelledby="resume-projects" className="mt-14">
                <RailHeading>
                  <span id="resume-projects">Projects</span>
                </RailHeading>
                <div className="mt-5">
                  {projects.map((e) => (
                    <Entry
                      key={e.org}
                      role={e.role}
                      org={e.org}
                      location={e.location}
                      period={e.period}
                      link={e.link}
                      bullets={e.bullets}
                    />
                  ))}
                </div>
              </section>
            )}

            <p className="mt-14 text-sm text-fg-faint">
              The work itself is on{" "}
              <Link href="/#work" className="link-underline text-fg">
                the work section
              </Link>
              , and every line here is traceable to something you can go look at.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
