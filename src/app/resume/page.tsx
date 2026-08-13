import type { Metadata } from "next";
import Link from "next/link";
import {
  education,
  experience,
  identity,
  projects,
  skills,
  type ResumeEntry,
} from "@/lib/resume-data";
import { PrintButton } from "@/components/print-button";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Owen Brown: software engineering student at UVic, founder of OBdesign, seeking a Spring 2027 co-op.",
};

function EntryBlock({ entry }: { entry: ResumeEntry }) {
  return (
    <div className="resume-entry">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="font-body text-base font-semibold text-fg">
          {entry.org}
          <span className="font-normal text-fg-muted"> · {entry.role}</span>
        </h3>
        <p className="text-xs tabular-nums text-fg-faint">{entry.period}</p>
      </div>
      <p className="mt-0.5 text-xs text-fg-faint">{entry.location}</p>
      <ul className="mt-3 space-y-2 text-sm text-fg-muted">
        {entry.bullets.map((b) => (
          <li key={b} className="flex gap-3">
            <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-accent" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      {entry.link && (
        <p className="mt-2 text-xs">
          {entry.link.startsWith("/") ? (
            <Link href={entry.link} className="link-underline text-fg">
              Case study
            </Link>
          ) : (
            <a href={entry.link} rel="noopener" className="link-underline text-fg">
              {entry.link.replace("https://www.", "").replace("https://", "")}
            </a>
          )}
        </p>
      )}
    </div>
  );
}

export default function ResumePage() {
  return (
    <div className="container-site max-w-4xl pt-32 pb-16 sm:pt-36 sm:pb-20 print:py-0">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-[clamp(2.5rem,6vw,3.5rem)]">{identity.name}</h1>
          <p className="mt-2 text-fg-muted">
            {identity.title} · {identity.location}
          </p>
          <p className="mt-1 text-sm text-fg-faint">
            {identity.email} · {identity.site} · github.com/Owenbrown18
          </p>
          <p className="mt-3 text-sm font-medium text-accent-text">
            Seeking: {identity.seeking}
          </p>
        </div>
        <PrintButton />
      </header>

      <section className="mt-12">
        <h2 className="resume-heading">Experience</h2>
        <div className="mt-6 space-y-8">
          {experience.map((e) => (
            <EntryBlock key={e.org} entry={e} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="resume-heading">Projects</h2>
        <div className="mt-6 space-y-8">
          {projects.map((e) => (
            <EntryBlock key={e.org} entry={e} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="resume-heading">Education</h2>
        <div className="mt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="font-body text-base font-semibold text-fg">
              {education.org}
              <span className="font-normal text-fg-muted">
                {" "}
                · {education.credential}
              </span>
            </h3>
            <p className="text-xs tabular-nums text-fg-faint">
              {education.period}
            </p>
          </div>
          <p className="mt-2 text-sm text-fg-muted">{education.detail}</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="resume-heading">Skills</h2>
        <dl className="mt-6 space-y-2 text-sm">
          {skills.map((s) => (
            <div key={s.label} className="flex flex-wrap gap-x-3">
              <dt className="w-28 shrink-0 font-semibold text-fg">{s.label}</dt>
              <dd className="text-fg-muted">{s.items}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
