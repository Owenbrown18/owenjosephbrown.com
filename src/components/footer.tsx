import Link from "next/link";
import {
  ArrowUpRightIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  ObdesignWordmark,
} from "@/components/icons";
import { LocalTime } from "@/components/local-time";
import { getWorkEntries } from "@/lib/content";
import { identity } from "@/lib/resume-data";

const colHead =
  "font-mono text-[0.68rem] uppercase tracking-[0.14em] text-fg-faint";
const colLink = "text-sm text-fg-muted transition-colors hover:text-fg";

/**
 * The footer as a site index: three columns — pages, elsewhere, the work
 * itself — over a hairline, with the identity line at the bottom. The
 * work column reads content/work off disk, so it can't go stale the way
 * a hand-written list did on the landing page.
 */
export function Footer() {
  const projects = getWorkEntries().filter((e) => e.kind !== "client");

  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-site grid gap-10 py-14 sm:grid-cols-3">
        <nav aria-label="Pages" className="space-y-3">
          <p className={colHead}>Pages</p>
          {[
            ["Home", "/#home"],
            ["Work", "/#work"],
            ["About", "/#about"],
            ["Contact", "/#contact"],
            ["Résumé", "/resume"],
          ].map(([label, href]) => (
            <Link key={href} href={href} className={`block ${colLink}`}>
              {label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Elsewhere" className="space-y-3">
          <p className={colHead}>Elsewhere</p>
          <a
            href={`mailto:${identity.email}`}
            className={`flex items-center gap-2 ${colLink}`}
          >
            <MailIcon className="h-3.5 w-3.5" />
            {identity.email}
          </a>
          <a
            href={identity.github}
            rel="me noopener"
            className={`flex items-center gap-2 ${colLink}`}
          >
            <GitHubIcon className="h-3.5 w-3.5" />
            GitHub
          </a>
          <a
            href={identity.linkedin}
            rel="me noopener"
            className={`flex items-center gap-2 ${colLink}`}
          >
            <LinkedInIcon className="h-3.5 w-3.5" />
            LinkedIn
          </a>
          <a
            href="https://www.obwebdesign.ca"
            rel="noopener"
            className={`flex items-center gap-1.5 ${colLink}`}
          >
            <ObdesignWordmark />
            <ArrowUpRightIcon />
          </a>
        </nav>

        <nav aria-label="Work" className="space-y-3">
          <p className={colHead}>Work</p>
          <Link href="/obdesign" className={`block ${colLink}`}>
            OBdesign, the studio
          </Link>
          {projects.map((e) => (
            <Link
              key={e.slug}
              href={`/work/${e.slug}`}
              className={`block ${colLink}`}
            >
              {e.title}
            </Link>
          ))}
        </nav>
      </div>

      <div className="container-site flex flex-col gap-2 border-t border-line py-6 text-sm text-fg-faint sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-display font-bold text-fg">
            Owen Brown<span className="text-accent">.</span>
          </span>{" "}
          ©2026
        </p>
        <p className="font-mono text-xs uppercase tracking-[0.14em]">
          Victoria, BC&nbsp;&nbsp;<LocalTime />
        </p>
      </div>
    </footer>
  );
}
