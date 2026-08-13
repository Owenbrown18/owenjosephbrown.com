import Link from "next/link";
import {
  ArrowUpRightIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  ObdesignWordmark,
} from "@/components/icons";
import { identity } from "@/lib/resume-data";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10">
      <div className="container-site flex flex-col gap-6 py-10 text-sm text-fg-faint sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-base font-bold text-fg">
          Owen Brown<span className="text-accent">.</span>
        </p>
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          <a
            href={`mailto:${identity.email}`}
            className="inline-flex items-center gap-2 transition-colors hover:text-fg"
          >
            <MailIcon />
            {identity.email}
          </a>
          <a
            href={identity.github}
            rel="me noopener"
            className="inline-flex items-center gap-2 transition-colors hover:text-fg"
          >
            <GitHubIcon />
            GitHub
          </a>
          <a
            href={identity.linkedin}
            rel="me noopener"
            className="inline-flex items-center gap-2 transition-colors hover:text-fg"
          >
            <LinkedInIcon />
            LinkedIn
          </a>
          <a
            href="https://www.obwebdesign.ca"
            rel="noopener"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-fg"
          >
            <ObdesignWordmark />
            <ArrowUpRightIcon />
          </a>
          <Link href="/resume" className="transition-colors hover:text-fg">
            Resume
          </Link>
        </nav>
      </div>
    </footer>
  );
}
