import Link from "next/link";
import { identity } from "@/lib/resume-data";

export function Footer() {
  return (
    <footer className="hairline mt-24">
      <div className="container-site flex flex-col gap-6 py-12 text-sm text-fg-faint sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <p className="font-display text-base font-bold text-fg">
            Owen Brown<span className="text-accent">.</span>
          </p>
          <p>Software engineer, Salt Spring Island & Victoria, BC.</p>
          <p>
            <a
              href={`mailto:${identity.email}`}
              className="link-underline text-fg"
            >
              {identity.email}
            </a>
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center gap-x-5 gap-y-2"
        >
          <a
            href={identity.github}
            className="transition-colors hover:text-fg"
            rel="me noopener"
          >
            GitHub
          </a>
          <a
            href={identity.linkedin}
            className="transition-colors hover:text-fg"
            rel="me noopener"
          >
            LinkedIn
          </a>
          <a
            href="https://www.obwebdesign.ca"
            className="transition-colors hover:text-fg"
            rel="noopener"
          >
            OBdesign
          </a>
          <Link href="/resume" className="transition-colors hover:text-fg">
            Resume
          </Link>
        </nav>
      </div>
      <div className="container-site pb-8">
        <p className="text-xs text-fg-faint">
          Try <code className="font-mono">curl owenjosephbrown.com</code> in a
          terminal. This site is{" "}
          <a
            href="https://github.com/Owenbrown18/owenjosephbrown.com"
            className="underline decoration-accent underline-offset-2 hover:decoration-current"
            rel="noopener"
          >
            open source
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
