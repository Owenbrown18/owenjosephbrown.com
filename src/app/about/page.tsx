import type { Metadata } from "next";
import Link from "next/link";
import { identity } from "@/lib/resume-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Software engineering student at UVic, founder of OBdesign, based between Salt Spring Island and Victoria, BC.",
};

export default function AboutPage() {
  return (
    <div className="container-site max-w-4xl pt-32 pb-16 sm:pt-36 sm:pb-24">
      <div className="sage-bar mb-7" />
      <p className="eyebrow">About</p>
      <h1 className="mt-4 text-[clamp(2.5rem,6vw,4.25rem)]">
        I like shipping more than I like starting.
      </h1>

      <div className="mt-10 max-w-[62ch] space-y-6 text-lg text-fg-muted">
        <p>
          I grew up on Salt Spring Island and study software engineering at the
          University of Victoria (BSEng co-op, finishing 2029 with four work
          terms). The pattern in everything below is the same: I find out what
          something costs to run in the real world, not just what it looks
          like in a repo.
        </p>
        <p>
          At nineteen I ran a painting business for a season. It did $80,000
          in revenue with a team of four, and it taught me scheduling, hiring,
          and what happens when you underquote a pressure wash. In June 2025 I
          started{" "}
          <a
            href="https://www.obwebdesign.ca"
            rel="noopener"
            className="link-underline text-fg"
          >
            OBdesign
          </a>
          , a one-person web studio. Nine production sites are live for BC
          businesses, each one custom-coded and each one editable by its
          owner. The client acquisition runs on{" "}
          <Link href="/work/leadgen" className="link-underline text-fg">
            a Python pipeline I wrote
          </Link>{" "}
          and instrumented down to revenue.
        </p>
        <p>
          Nights and weekends go to{" "}
          <Link href="/work/grain" className="link-underline text-fg">
            grain
          </Link>
          , a shared film camera for iOS where the whole product is one
          protected moment: nobody sees a photo until the roll gets developed.
          Building it solo means I own everything from the Postgres row-level
          security to the film-grain shader.
        </p>
        <p>
          Away from a keyboard: morning runs, and the kind of island errands
          that involve a ferry schedule.
        </p>
      </div>

      <div className="mt-14 border border-line p-6 sm:p-8">
        <p className="eyebrow">What I’m looking for</p>
        <p className="mt-3 max-w-[52ch] text-fg-muted">
          A <span className="text-fg">Spring 2027 co-op work term</span>{" "}
          (January to April), in Victoria or remote. I bring shipped products,
          real users, and the habit of owning a thing end to end.
        </p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a
            href={`mailto:${identity.email}`}
            className="link-underline text-fg"
          >
            {identity.email}
          </a>
          <Link href="/resume" className="link-underline text-fg">
            Resume
          </Link>
          <a
            href={identity.linkedin}
            rel="me noopener"
            className="link-underline text-fg"
          >
            LinkedIn
          </a>
        </div>
      </div>

      <div className="mt-10">
        <p className="eyebrow">Now</p>
        <p className="mt-3 max-w-[52ch] text-sm text-fg-muted">
          Fall 2026 term: operating systems, software architecture, security
          engineering. Shipping grain to TestFlight. Running the studio in the
          mornings.
        </p>
      </div>
    </div>
  );
}
