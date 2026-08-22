import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import { education, experience, identity, projects, skills } from "@/lib/resume-data";
import { PageHeader } from "@/components/page-header";
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

/** One résumé entry: period and place on the left, the substance on the right. */
function Entry({
  period,
  location,
  title,
  subtitle,
  link,
  bullets,
  detail,
}: {
  period: string;
  location: string;
  title: string;
  subtitle: string;
  link?: string;
  bullets?: readonly string[];
  detail?: string;
}) {
  return (
    <article className="reveal-up grid gap-2 border-t border-line py-7 md:grid-cols-[11rem_1fr] md:gap-10">
      <div>
        <p className="label-mono text-fg-faint">{period}</p>
        <p className="mt-1 text-sm text-fg-faint">{location}</p>
      </div>
      <div>
        <h3 className="font-display text-xl font-bold text-fg">
          {link ? (
            <a
              href={link}
              rel="noopener"
              className="link-draw inline-flex items-center gap-1.5"
            >
              {title}
              <ArrowUpRightIcon />
            </a>
          ) : (
            title
          )}
        </h3>
        <p className="mt-0.5 text-sm text-fg-muted">{subtitle}</p>
        {detail && <p className="mt-3 text-sm text-fg-muted">{detail}</p>}
        {bullets && (
          <ul className="mt-3 space-y-1.5">
            {bullets.map((b) => (
              <li key={b} className="flex gap-3 text-sm leading-relaxed text-fg-muted">
                <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-sage" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="anim-heading text-[clamp(1.75rem,3.5vw,2.5rem)] text-fg">
      {children}
      <span className="text-sage">.</span>
    </h2>
  );
}

export default function ResumePage() {
  // Checked at build time: the PDF is optional, and the page is the
  // résumé either way — it's real HTML now, not an embed.
  const hasPdf = existsSync(join(process.cwd(), "public", PDF.slice(1)));
  const work = experience;

  return (
    <div className="container-site pb-24 pt-32 sm:pt-36">
      <div className="sheet resume-sheet">
        <PageHeader
          eyebrow="Résumé"
          title={identity.name}
          summary={`${identity.title} · ${identity.location}. Seeking ${identity.seeking}.`}
          meta={[
            {
              label: "Email",
              wide: true,
              value: (
                <a
                  href={`mailto:${identity.email}`}
                  className="link-underline inline-flex items-center gap-2 text-fg"
                >
                  <MailIcon className="h-3.5 w-3.5" />
                  {identity.email}
                </a>
              ),
            },
            {
              label: "GitHub",
              value: (
                <a
                  href={identity.github}
                  rel="me noopener"
                  className="link-underline inline-flex items-center gap-2 text-fg"
                >
                  <GitHubIcon className="h-3.5 w-3.5" />
                  Owenbrown18
                </a>
              ),
            },
            {
              label: "LinkedIn",
              value: (
                <a
                  href={identity.linkedin}
                  rel="me noopener"
                  className="link-underline inline-flex items-center gap-2 text-fg"
                >
                  <LinkedInIcon className="h-3.5 w-3.5" />
                  owenbrown18
                </a>
              ),
            },
          ]}
        />

        {hasPdf && (
          <p className="mt-8 print:hidden">
            <a
              href={PDF}
              target="_blank"
              rel="noopener"
              className="btn"
            >
              <PixelCells seed="resume-pdf" variant="hover" cols={10} rows={3} spread={240} />
              <span className="btn__label inline-flex items-center gap-2">
                Open the PDF
                <ArrowUpRightIcon />
              </span>
            </a>
          </p>
        )}

        <section aria-labelledby="resume-experience" className="mt-16">
          <SectionHeading>
            <span id="resume-experience">Experience</span>
          </SectionHeading>
          <div className="mt-6">
            {work.map((e) => (
              <Entry
                key={e.org}
                period={e.period}
                location={e.location}
                title={e.org}
                subtitle={e.role}
                link={e.link}
                bullets={e.bullets}
              />
            ))}
          </div>
        </section>

        {projects.length > 0 && (
          <section aria-labelledby="resume-projects" className="mt-16">
            <SectionHeading>
              <span id="resume-projects">Projects</span>
            </SectionHeading>
            <div className="mt-6">
              {projects.map((e) => (
                <Entry
                  key={e.org}
                  period={e.period}
                  location={e.location}
                  title={e.org}
                  subtitle={e.role}
                  link={e.link}
                  bullets={e.bullets}
                />
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="resume-education" className="mt-16">
          <SectionHeading>
            <span id="resume-education">Education</span>
          </SectionHeading>
          <div className="mt-6">
            <Entry
              period={education.period}
              location={education.location}
              title={education.org}
              subtitle={education.credential}
              detail={education.detail}
            />
          </div>
        </section>

        <section aria-labelledby="resume-skills" className="mt-16">
          <SectionHeading>
            <span id="resume-skills">Skills</span>
          </SectionHeading>
          <dl className="mt-6 border-t border-line">
            {skills.map((group) => (
              <div
                key={group.label}
                className="reveal-up grid gap-2 border-b border-line py-5 md:grid-cols-[11rem_1fr] md:gap-10"
              >
                <dt className="label-mono text-fg-faint">{group.label}</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {group.items.split(", ").map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-16 text-sm text-fg-faint">
          The work itself is on{" "}
          <Link href="/#work" className="link-underline text-fg">
            the work section
          </Link>
          , and every line here is traceable to something you can go look at.
        </p>
      </div>
    </div>
  );
}
