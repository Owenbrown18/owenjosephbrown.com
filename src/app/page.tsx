import type { ReactNode } from "react";
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
import { ProjectCard, FrameShot, Shot } from "@/components/project-card";
import { PhoneFrame } from "@/components/phone-frame";
import { LocalTime } from "@/components/local-time";
import { identity } from "@/lib/resume-data";
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
 * How each project's imagery is arranged inside its frame. Several shots
 * at different sizes rather than one flat screenshot, because a single
 * capture of a phone app or a Mac app says almost nothing.
 *
 * A slug with no composition here falls back to its hero image, so a new
 * case study still shows up on its own.
 */
const compositions: Record<
  string,
  { frame: string; tone: string; art: ReactNode }
> = {
  grain: {
    frame: "aspect-[5/4]",
    tone: "frame-grain",
    art: (
      <>
        <div data-float={1} className="absolute bottom-[-8%] left-[6%] w-[27%] -rotate-2">
          <PhoneFrame>
            <Image
              src="/images/grain/home_roll.webp"
              alt=""
              width={260}
              height={563}
              sizes="(min-width: 768px) 260px, 30vw"
              className="h-auto w-full"
            />
          </PhoneFrame>
        </div>
        <div data-float={2} className="absolute bottom-[6%] left-[37%] z-10 w-[29%]">
          <PhoneFrame>
            <Image
              src="/images/grain/new_roll_qr.webp"
              alt=""
              width={260}
              height={563}
              sizes="(min-width: 768px) 280px, 32vw"
              className="h-auto w-full"
            />
          </PhoneFrame>
        </div>
        <div data-float={3} className="absolute bottom-[-6%] right-[7%] w-[25%] rotate-2">
          <PhoneFrame>
            <Image
              src="/images/grain/waiting.webp"
              alt=""
              width={260}
              height={563}
              sizes="(min-width: 768px) 240px, 27vw"
              className="h-auto w-full"
            />
          </PhoneFrame>
        </div>
      </>
    ),
  },
  whispr: {
    frame: "aspect-[16/11]",
    tone: "frame-whispr",
    art: (
      <>
        {/* Tight crops of the app's own cards, not whole windows: at card
            size a full window is furniture and the text is the product. */}
        <Shot
          src="/images/whispr/card-result.webp"
          alt=""
          className="left-[5%] top-[9%] w-[74%] aspect-[944/188]"
          sizes="(min-width: 768px) 620px, 74vw"
          dataFloat={1}
        />
        <Shot
          src="/images/whispr/card-hotkey.webp"
          alt=""
          className="right-[4%] top-[36%] z-10 w-[64%] aspect-[944/226]"
          sizes="(min-width: 768px) 540px, 64vw"
          dataFloat={2}
        />
        {/* The pill itself — alpha-masked capsule, so nothing but the HUD
            floats over the stage, the way it floats over a desktop. */}
        <div
          data-float={3}
          className="absolute bottom-[11%] left-[24%] z-20 w-[26%]"
        >
          <Image
            src="/images/whispr/hud-pill-2.webp"
            alt=""
            width={260}
            height={68}
            sizes="(min-width: 768px) 220px, 26vw"
            className="h-auto w-full drop-shadow-[0_10px_24px_rgba(0,0,0,0.5)]"
          />
        </div>
      </>
    ),
  },
  leadgen: {
    frame: "aspect-[4/3]",
    tone: "frame-leadgen",
    art: (
      <>
        <Shot
          src="/images/leadgen/dashboard-top.webp"
          alt=""
          chrome
          className="left-[4%] top-[6%] w-[70%]"
          sizes="(min-width: 768px) 580px, 70vw"
          dataFloat={1}
        />
        {/* The classifier itself, rendered from the real source: the
            system is the product here, so the code is the better photo. */}
        <Shot
          src="/images/leadgen/classifier-code.webp"
          alt=""
          className="bottom-[6%] right-[4%] z-10 w-[54%] aspect-[1564/982]"
          sizes="(min-width: 768px) 450px, 54vw"
          dataFloat={2}
        />
      </>
    ),
  },
};

const projects = getWorkEntries().filter((e) => e.kind !== "client");


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
                  className="border border-white/20 bg-white/[0.03] px-4 py-2 text-sm text-white/75 transition-colors hover:border-sage hover:text-white"
                >
                  {l.label}
                </a>
              ))}
              <Link
                href="/resume"
                className="border border-white/20 bg-white/[0.03] px-4 py-2 text-sm text-white/75 transition-colors hover:border-sage hover:text-white"
              >
                Résumé
              </Link>
            </div>
          </div>

          {/* Place and time, the way a studio site stamps a page. */}
          <p className="mt-14 text-right font-mono text-xs uppercase tracking-[0.14em] text-white/35">
            ©2026&nbsp;&nbsp;·&nbsp;&nbsp;Victoria, BC&nbsp;&nbsp;<LocalTime />
          </p>

        </div>
      </section>

      {/* 02 · Work. An index, not a series of features: every project in
          an identical frame so the whole body of work is scannable, and so
          adding one is a data change rather than a new bespoke block. */}
      <SectionRule num="02" />
      <section id="work" className="section-pad relative">
        <div className="container-site">
          <div className="reveal-up lift flex items-end justify-between gap-6">
            <h2 className="anim-heading text-[clamp(2.5rem,6vw,4.5rem)] text-white/95">
              Selected work<span className="text-sage">.</span>
            </h2>
            <p className="eyebrow hidden sm:block">02</p>
          </div>
          <p className="reveal-up mt-5 max-w-[52ch] text-white/70">
            These are real projects with real users. Each one links to a
            write-up of what the problem actually was and what I did about
            it. I’ve left in the parts that didn’t go well.
          </p>

          <div className="project-index mt-14 grid gap-x-10 gap-y-20 sm:mt-16 md:grid-cols-2">
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
              tone="frame-studio"
            >
              <div aria-hidden className="studio-stack absolute inset-0">
                {[
                  ["grain-construction", "Grain Construction", "560px"],
                  ["figs-and-honey", "Figs & Honey", "380px"],
                  ["daves-bakery", "Daves’ Bakery", "340px"],
                  ["soma-active-health", "Soma Active Health", "300px"],
                ].map(([slug, name, w], i) => (
                  <div key={slug} data-float={i + 1}>
                    <Image
                      src={`/images/work/${slug}.webp`}
                      alt={name}
                      fill
                      sizes={`(min-width: 768px) ${w}, 45vw`}
                      className="object-cover object-top"
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
                frameClass={compositions[entry.slug]?.frame}
                tone={compositions[entry.slug]?.tone}
              >
                {compositions[entry.slug]?.art ?? (
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
          <p className="container-site eyebrow">
            Ten live sites, and counting
          </p>
          <div className="mt-6">
            <SiteMarquee />
          </div>
        </div>
      </section>

      {/* 03 · About: comes back up out of the tunnel. */}
      <SectionRule num="03" />
      <section id="about" className="section-pad relative">
        <div className="container-site">
          <div className="reveal-up lift flex items-end justify-between gap-6">
            <h2 className="anim-heading text-[clamp(2.5rem,6vw,4.5rem)] text-white/95">
              About me<span className="text-sage">.</span>
            </h2>
            <p className="eyebrow hidden sm:block">03</p>
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
              <p className="mt-6 max-w-[52ch] text-white/75">
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

      {/* 04 · Contact */}
      <SectionRule num="04" />
      <section id="contact" className="section-pad relative overflow-hidden">
        <div className="container-site relative text-center">
          <p className="eyebrow !text-sage">04 · Contact</p>
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
              className="inline-flex items-center gap-2 bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.06em] text-[var(--bg)] transition-transform duration-200 hover:-translate-y-0.5"
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
