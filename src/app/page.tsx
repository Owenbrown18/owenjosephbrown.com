import Image from "next/image";
import Link from "next/link";
import { SiteMarquee } from "@/components/site-marquee";
import {
  ArrowUpRightIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  ObdesignWordmark,
} from "@/components/icons";
import { SectionRule } from "@/components/section-rule";
import { ProjectCard, FrameShot } from "@/components/project-card";
import { LocalTime } from "@/components/local-time";
import { education, experience, identity } from "@/lib/resume-data";
import { getWorkEntries } from "@/lib/content";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Owen Brown",
  url: "https://owenjosephbrown.com",
  email: `mailto:${identity.email}`,
  jobTitle: "Software engineer",
  sameAs: [identity.github, identity.linkedin, "https://www.obwebdesign.ca"],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Victoria",
  },
  address: {
    "@type": "PostalAddress",
    addressRegion: "BC",
    addressCountry: "CA",
  },
};

/**
 * The hero table. Built from the resume data so it can't drift, and sliced
 * to the three org-type entries: grain and the pipeline are further down
 * the page as projects, so listing them here twice would be noise.
 */
const history = [
  ...experience.slice(0, 3).map((e) => ({
    when: e.period.includes("present")
      ? "Current"
      : (e.period.match(/(\d{4})/g)?.pop() ?? ""),
    org: e.org,
    role: e.role,
  })),
  {
    when: education.period.slice(-16).match(/(\d{4})/)?.[0] ?? "2028",
    org: education.org,
    role: education.credential,
  },
];

/**
 * The index cards after the studio: everything in content/work that isn't
 * a client site. Read from disk, so a new case study appears here the day
 * its file lands. Client sites live on the studio page instead.
 */
const projects = getWorkEntries().filter((e) => e.kind !== "client");

const expertise = [
  {
    num: "01",
    title: "Full-stack web",
    sub: "Next.js · TypeScript · Astro",
    copy: "I've built and shipped 10+ sites for paying clients, about $20,000 of work so far. I do all of it myself. That's the code, but it's also the CMS, the domain setup, the hosting, and keeping the thing fast once it's live.",
  },
  {
    num: "02",
    title: "Mobile",
    sub: "React Native · Expo",
    copy: "I'm building grain, a film camera app for iOS, on my own. The camera, the film look that runs on the GPU, the upload queue that still works with no signal. Before that I did frontend at a startup called Aperture AI.",
  },
  {
    num: "03",
    title: "Systems & data",
    sub: "Python · Postgres · Supabase",
    copy: "I wrote the ~3,900-line Python pipeline that finds my clients and tracks every email through to whether it actually made money. In my apps I let the database enforce the rules instead of trusting the client, with row-level security and locked transactions.",
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <div aria-hidden className="page-grade" />

      {/* 01 · Hero. Left-aligned and editorial: the name, what I do, the
          ways to reach me, then the history as a table rather than a
          paragraph, so a recruiter has it all in the first screen. */}
      <section id="home" className="relative">
        <div className="container-site relative flex min-h-[100svh] flex-col justify-center pb-28 pt-32 sm:pt-36">
          <div className="hero-stage hero-parallax">
            <div className="hero-name relative">
              {/* The echo: the name once more as a sage outline, offset like
                  a print misregistration. inset-0 so it wraps exactly as the
                  real heading does at every width. */}
              <p
                aria-hidden
                className="hero-echo pointer-events-none absolute inset-0 translate-x-[7px] translate-y-[8px] select-none font-display text-[clamp(3.2rem,11vw,9rem)] font-extrabold leading-[0.86] tracking-[-0.035em]"
              >
                Owen
                <br />
                Brown
              </p>
              <h1 className="relative font-display text-[clamp(3.2rem,11vw,9rem)] font-extrabold leading-[0.86] tracking-[-0.035em] text-white/95">
                {/* Split so the two words arrive on a stagger. The full name
                    stays intact for screen readers and copy-paste. */}
                {/* The outer span forces the line break: .hero-word is
                    unlayered inline-block in globals.css and would beat a
                    Tailwind `block` utility. */}
                <span className="block">
                  <span className="hero-word">Owen</span>
                </span>{" "}
                <span className="block text-sage">
                  <span className="hero-word">Brown</span>
                </span>
              </h1>
            </div>

            <p className="mt-9 max-w-[46ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-relaxed text-white/70">
              I’m a <strong className="font-semibold text-white">software engineer</strong>{" "}
              in Victoria, studying at UVic and running a small web studio. I
              build things people actually use, and most of them are live
              somewhere you can go click on.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              {[
                { label: "Email", href: `mailto:${identity.email}` },
                { label: "GitHub", href: identity.github },
                { label: "LinkedIn", href: identity.linkedin },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  rel="me noopener"
                  className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-sm text-white/75 transition-colors hover:border-white/40 hover:text-white"
                >
                  {l.label}
                </a>
              ))}
              <Link
                href="/resume"
                className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-sm text-white/75 transition-colors hover:border-white/40 hover:text-white"
              >
                Résumé
              </Link>
            </div>
          </div>

          {/* Place and time, the way a studio site stamps a page. */}
          <p className="mt-14 text-right font-mono text-xs uppercase tracking-[0.14em] text-white/35">
            ©2026&nbsp;&nbsp;·&nbsp;&nbsp;Victoria, BC&nbsp;&nbsp;<LocalTime />
          </p>

          {/* The history, as a table. */}
          <dl className="mt-5 border-t border-white/15">
            {history.map((row) => (
              <div
                key={row.org}
                className="reveal-up grid grid-cols-[4.5rem_1fr] items-baseline gap-x-5 border-b border-white/15 py-4 sm:grid-cols-[9rem_1fr] sm:py-5"
              >
                <dt className="font-mono text-xs uppercase tracking-[0.12em] text-white/40">
                  {row.when}
                </dt>
                <dd>
                  <span className="block font-display text-base font-bold text-white/95 sm:text-lg">
                    {row.org}
                  </span>
                  <span className="mt-0.5 block text-sm text-white/50">
                    {row.role}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 02 · Expertise: the page's one open, lighter clearing. */}
      <SectionRule num="02" />
      <section id="expertise" className="section-pad relative">
        <p
          aria-hidden
          className="parallax-b pointer-events-none absolute right-[2%] top-4 select-none font-display text-[clamp(8rem,20vw,14rem)] font-black leading-none text-white/[0.035]"
        >
          {/* Smaller than its siblings on purpose: this section is the
              shortest, and at full size the numeral ran into the third
              column's border. Clearance beats equal font size. */}
          02
        </p>
        <div className="container-site">
          <div className="reveal-up lift flex items-end justify-between gap-6">
            <h2 className="anim-heading text-[clamp(2.5rem,6vw,4.5rem)] text-white/95">
              My expertise<span className="text-sage">.</span>
            </h2>
            <p className="eyebrow hidden !text-white/40 sm:block">02</p>
          </div>
          <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-3">
            {expertise.map((item) => (
              <div
                key={item.num}
                className="reveal-up border-t border-white/15 pt-6"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl font-bold text-white/95">
                    {item.title}
                  </h3>
                  <span className="text-xs font-bold text-sage">
                    {item.num}
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/50">{item.sub}</p>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 · Work. An index, not a series of features: every project in
          an identical frame so the whole body of work is scannable, and so
          adding one is a data change rather than a new bespoke block. */}
      <SectionRule num="03" />
      <section id="work" className="section-pad relative">
        <p
          aria-hidden
          className="parallax-b pointer-events-none absolute right-[2%] top-4 select-none font-display text-[clamp(8rem,20vw,14rem)] font-black leading-none text-white/[0.035]"
        >
          03
        </p>
        <div className="container-site">
          <div className="reveal-up lift flex items-end justify-between gap-6">
            <h2 className="anim-heading text-[clamp(2.5rem,6vw,4.5rem)] text-white/95">
              Selected work<span className="text-sage">.</span>
            </h2>
            <p className="eyebrow hidden !text-white/40 sm:block">03</p>
          </div>
          <p className="reveal-up mt-5 max-w-[52ch] text-white/70">
            These are real projects with real users. Each one links to a
            write-up of what the problem actually was and what I did about
            it. I’ve left in the parts that didn’t go well.
          </p>

          <div className="mt-14 grid gap-x-10 gap-y-16 sm:mt-16 md:grid-cols-2">
            {/* The studio, composed: the one card that isn't a single
                screenshot, because ten sites is the point of it. */}
            <ProjectCard
              num="001"
              title="OBdesign"
              href="/obdesign"
              year="2025 – present"
              tags={["Next.js", "Astro", "Keystatic", "Vercel"]}
              blurb="My one-person web studio. Ten live sites for businesses around BC, all custom-coded, each one editable by the owner without calling me."
              linkLabel="View the studio"
            >
              <div aria-hidden className="studio-stack absolute inset-0">
                {[
                  ["grain-construction", "Grain Construction"],
                  ["figs-and-honey", "Figs & Honey"],
                  ["daves-bakery", "Daves’ Bakery"],
                  ["soma-active-health", "Soma Active Health"],
                ].map(([slug, name], i) => (
                  <div key={slug}>
                    <Image
                      src={`/images/work/${slug}.webp`}
                      alt={name}
                      fill
                      sizes="(min-width: 768px) 28vw, 55vw"
                      className="object-cover object-top"
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>
            </ProjectCard>

            {projects.map((entry, i) => (
              <ProjectCard
                key={entry.slug}
                num={String(i + 2).padStart(3, "0")}
                title={entry.title}
                href={`/work/${entry.slug}`}
                year={entry.year}
                tags={entry.stack.slice(0, 4)}
                blurb={entry.summary}
              >
                {entry.heroVideo ? (
                  <video
                    src={entry.heroVideo}
                    poster={entry.hero}
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-hidden
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                ) : (
                  <FrameShot
                    src={entry.hero ?? "/images/work/grain-construction.webp"}
                    alt={entry.heroAlt ?? entry.title}
                  />
                )}
              </ProjectCard>
            ))}
          </div>
        </div>

        {/* Every client site, not just the four in the studio card. The
            index shows depth; this shows breadth. */}
        <div className="mt-20 sm:mt-24">
          <p className="container-site eyebrow !text-white/40">
            Ten live sites, and counting
          </p>
          <div className="mt-6">
            <SiteMarquee />
          </div>
        </div>
      </section>

      {/* 04 · About: comes back up out of the tunnel. */}
      <SectionRule num="04" />
      <section id="about" className="section-pad relative">
        <p
          aria-hidden
          className="parallax-b pointer-events-none absolute right-[2%] top-4 select-none font-display text-[clamp(10rem,26vw,20rem)] font-black leading-none text-white/[0.035]"
        >
          04
        </p>
        <div className="container-site">
          <div className="reveal-up lift flex items-end justify-between gap-6">
            <h2 className="anim-heading text-[clamp(2.5rem,6vw,4.5rem)] text-white/95">
              About me<span className="text-sage">.</span>
            </h2>
            <p className="eyebrow hidden !text-white/40 sm:block">04</p>
          </div>

          <div className="mt-14 grid items-center gap-14 md:grid-cols-[minmax(260px,380px)_1fr] md:gap-20">
            <div className="reveal-up relative max-w-[380px]">
              <Image
                src="/images/about/owen-brown.jpg"
                sizes="(min-width: 768px) 380px, 100vw"
                alt="Owen Brown"
                width={760}
                height={950}
                className="anim-image aspect-[4/5] w-full border border-white/15 object-cover shadow-2xl"
              />
            </div>
            <div className="reveal-up">
              <p className="max-w-[52ch] text-[clamp(1.05rem,1.8vw,1.3rem)] leading-relaxed text-white/75">
                I grew up on Salt Spring Island and I’m studying software
                engineering at UVic. When I was nineteen I ran a painting
                business and did $80,000 in revenue. Now{" "}
                <a
                  href="https://www.obwebdesign.ca"
                  rel="noopener"
                  className="font-semibold text-white underline decoration-sage decoration-2 underline-offset-4 hover:decoration-white"
                >
                  the studio
                </a>{" "}
                pays for my degree, and{" "}
                <Link
                  href="/work/grain"
                  className="font-semibold text-white underline decoration-sage decoration-2 underline-offset-4 hover:decoration-white"
                >
                  the projects
                </Link>{" "}
                are where I actually learn the engineering. I’m better at finishing
                things than starting them, which took me a while to work out.
                Almost everything on here is live somewhere, so you can go look
                at it instead of taking my word for it.
              </p>
              <p className="mt-6 max-w-[52ch] text-white/60">
                Looking for a Spring 2027 co-op in Victoria or remote. The
                full picture is on the{" "}
                <Link href="/resume" className="link-underline text-white/90">
                  resume
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 05 · Contact */}
      <SectionRule num="05" />
      <section id="contact" className="section-pad relative overflow-hidden">
        <p
          aria-hidden
          className="parallax-b pointer-events-none absolute right-[2%] top-4 select-none font-display text-[clamp(10rem,26vw,20rem)] font-black leading-none text-white/[0.035]"
        >
          05
        </p>
        <div className="container-site relative text-center">
          <p className="eyebrow !text-sage">05 · Contact</p>
          <h2 className="mx-auto mt-5 max-w-[16ch] text-[clamp(2.75rem,7vw,5rem)] font-extrabold text-white/95">
            Let’s talk.
          </h2>
          <p className="mx-auto mt-5 max-w-[44ch] text-white/70">
            If you’re hiring for a co-op, or you just want to know how something
            on here works, send me an email. I’ll get back to you.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <a
              href={`mailto:${identity.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.06em] text-forest transition-transform duration-200 hover:-translate-y-0.5"
            >
              <MailIcon className="h-3.5 w-3.5" />
              Email me
            </a>
            <a
              href={identity.github}
              rel="me noopener"
              className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
            >
              <GitHubIcon />
              GitHub
            </a>
            <a
              href={identity.linkedin}
              rel="me noopener"
              className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
            >
              <LinkedInIcon />
              LinkedIn
            </a>
            <a
              href="https://www.obwebdesign.ca"
              rel="noopener"
              className="inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
            >
              <ObdesignWordmark className="text-base" />
              <ArrowUpRightIcon />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
