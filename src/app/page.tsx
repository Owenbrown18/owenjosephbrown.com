import Image from "next/image";
import Link from "next/link";
import { ObdesignShowcase } from "@/components/obdesign-showcase";
import {
  ArrowUpRightIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  ObdesignWordmark,
} from "@/components/icons";
import { SectionRule } from "@/components/section-rule";
import { ProjectCard } from "@/components/project-card";
import { WorkArt, compositions } from "@/components/work-art";
import { PhoneFrame } from "@/components/phone-frame";
import { LaptopFrame } from "@/components/device-frames";
import { LocalTime } from "@/components/local-time";
import { ContactForm } from "@/components/contact-form";
import { PixelCells } from "@/components/pixel-cells";
import { Words } from "@/components/words";
import { identity } from "@/lib/resume-data";
import { getWorkEntries } from "@/lib/content";
import { siteShots } from "@/lib/site-shots";
import { img } from "@/lib/images";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Owen Brown",
  url: "https://owenjosephbrown.com",
  email: `mailto:${identity.email}`,
  jobTitle: "Software engineering student",
  sameAs: [identity.github, identity.linkedin, "https://www.obwebdesign.ca"],
  // affiliation, not alumniOf: alumniOf asserts he has already
  // graduated. He is in his fourth year.
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "University of Victoria",
  },
  address: {
    "@type": "PostalAddress",
    addressRegion: "BC",
    addressCountry: "CA",
  },
};

const projects = getWorkEntries();


export default function HomePage() {
  return (
    <div className="relative overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* 01 · Hero. Editorial: the name, what I do, the ways to reach me,
          and the work itself as physical objects on the right, so a
          recruiter has the whole pitch in the first screen. */}
      <section id="home" className="relative">
        <div className="container-site relative flex min-h-[100svh] flex-col justify-center pb-24 pt-32 sm:pt-36">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.92fr] lg:gap-10">
          <div className="hero-stage hero-parallax">
            <div className="hero-name relative">
              {/* The echo: the name once more as a sage outline, offset like
                  a print misregistration. inset-0 so it wraps exactly as the
                  real heading does at every width. */}
              <p
                aria-hidden
                className="hero-echo pointer-events-none absolute inset-0 select-none font-display text-[clamp(3.2rem,11vw,9rem)] font-extrabold leading-[0.86] tracking-[-0.035em]"
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

            <p className="words-enter mt-9 max-w-[46ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-relaxed text-white/75" style={{ "--enter-at": "0.2s" } as React.CSSProperties}>
              <Words>
I’m a{" "}
              <strong className="font-semibold text-white">
                fourth-year software engineering student
              </strong>{" "}
              at UVic in Victoria, and I run my own web development
              business. I build things people actually use, and most of them
              are live somewhere you can go click on.
              </Words>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              {[
                {
                  label: "Email",
                  href: `mailto:${identity.email}`,
                  icon: <MailIcon className="h-3.5 w-3.5" />,
                },
                {
                  label: "GitHub",
                  href: identity.github,
                  icon: <GitHubIcon className="h-3.5 w-3.5" />,
                },
                {
                  label: "LinkedIn",
                  href: identity.linkedin,
                  icon: <LinkedInIcon className="h-3.5 w-3.5" />,
                },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  rel="me noopener"
                  className="btn"
                >
                  <PixelCells seed={l.label} variant="hover" cols={9} rows={3} spread={240} />
                  <span className="btn__label inline-flex items-center gap-2">
                    {l.icon}
                    {l.label}
                  </span>
                </a>
              ))}
              <Link
                href="/resume"
                className="btn"
              >
                <PixelCells seed="Résumé" variant="hover" cols={9} rows={3} spread={240} />
                <span className="btn__label inline-flex items-center gap-2">
                  Résumé
                  <ArrowUpRightIcon />
                </span>
              </Link>
            </div>
          </div>

          {/* The work, physically: client sites in the OBdesign laptop
              frame, grain on a phone, Whispr's pill listening in over it.
              Loosely circular, allowed to overlap, floating idle. */}
          <div
            aria-hidden
            className="hero-cluster hero-drift relative mx-auto w-full max-w-[420px] lg:max-w-none"
            data-pause-offscreen
          >
            <span className="hero-cluster__glow" />
            <div className="cluster-piece absolute left-0 top-[4%] w-[62%]" style={{ "--i": 1 } as React.CSSProperties}>
              <LaptopFrame url="grainconstruction.ca">
                <Image
                  src={siteShots["grain-construction"]}
                  alt=""
                  width={1200}
                  height={750}
                  sizes="(min-width: 1024px) 400px, 60vw"
                  priority
                />
              </LaptopFrame>
            </div>
            <div className="cluster-piece absolute right-0 top-0 w-[46%]" style={{ "--i": 2 } as React.CSSProperties}>
              <LaptopFrame url="figsandhoney.com">
                <Image
                  src={siteShots["figs-and-honey"]}
                  alt=""
                  width={900}
                  height={563}
                  sizes="(min-width: 1024px) 300px, 45vw"
                  priority
                />
              </LaptopFrame>
            </div>
            <div className="cluster-piece absolute bottom-[6%] left-[4%] z-[1] w-[46%]" style={{ "--i": 3 } as React.CSSProperties}>
              <LaptopFrame url="somavictoria.ca">
                <Image
                  src={siteShots["soma-active-health"]}
                  alt=""
                  width={900}
                  height={563}
                  sizes="(min-width: 1024px) 300px, 45vw"
                />
              </LaptopFrame>
            </div>
            <div className="cluster-piece cluster-piece--code absolute bottom-[16%] right-[16%] z-[2] w-[44%]" style={{ "--i": 4 } as React.CSSProperties}>
              <Image
                src={img("/images/leadgen/classifier-code.webp")}
                alt=""
                width={782}
                height={491}
                sizes="(min-width: 1024px) 300px, 40vw"
                className="h-auto w-full"
              />
            </div>
            <div className="cluster-piece cluster-piece--phone absolute bottom-[-2%] right-[2%] z-[3] w-[24%]" style={{ "--i": 5 } as React.CSSProperties}>
              <PhoneFrame>
                <Image
                  src={img("/images/grain/home_roll.webp")}
                  alt=""
                  width={260}
                  height={563}
                  sizes="(min-width: 1024px) 160px, 24vw"
                />
              </PhoneFrame>
            </div>
            <div className="cluster-piece absolute left-[30%] top-[42%] z-[4] w-[32%]" style={{ "--i": 6 } as React.CSSProperties}>
              <Image
                src={img("/images/whispr/pill-listening-v2.webp")}
                alt=""
                width={254}
                height={64}
                sizes="(min-width: 1024px) 210px, 32vw"
                className="h-auto w-full drop-shadow-[0_14px_28px_rgba(15,35,32,0.35)]"
              />
            </div>
          </div>
          </div>

          {/* Place and time, the way a design site stamps a page. */}
          <p className="hero-stamp mt-14 text-right label-mono text-white/75">
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
          <p className="reveal-up words mt-5 max-w-[52ch] text-white/75">
            <Words>
            These are real projects with real users. Each one links to a
            write-up of what the problem actually was and what I did about
            it. I’ve left in the parts that didn’t go well.
            </Words>
          </p>

          <div className="project-index mt-14 grid gap-x-10 gap-y-20 sm:mt-16 md:grid-cols-2">
            {projects.map((entry, i) => (
              <ProjectCard
                key={entry.slug}
                num={String(i + 1).padStart(3, "0")}
                title={entry.title}
                href={`/work/${entry.slug}`}
                year={entry.year}
                tags={entry.stack.slice(0, 4)}
                blurb={entry.summary}
                frameClass={compositions[entry.slug]?.frame}
                tone={compositions[entry.slug]?.tone}
              >
                <WorkArt entry={entry} />
              </ProjectCard>
            ))}
          </div>
        </div>

      </section>

      {/* 03 · OBdesign. The business as an index, straight on the page
          like every other section: the wordmark and the honest numbers up
          top, then the roster rows beside one laptop big enough that the
          sites actually read. */}
      <SectionRule num="03" />
      <section id="obdesign" className="section-pad relative">
        <div className="container-site">
          <div className="reveal-up lift flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
            <h2 className="anim-heading">
              <ObdesignWordmark className="text-[clamp(2.4rem,5.5vw,4rem)]" />
            </h2>
            <dl className="flex flex-wrap items-end gap-x-10 gap-y-4">
              {[
                ["25+", "sites deployed"],
                ["11", "live client sites"],
                ["$10k+", "collected"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dd className="font-display text-3xl font-bold text-white/90">
                    {value}
                  </dd>
                  <dt className="label-mono mt-1 text-white/70">{label}</dt>
                </div>
              ))}
            </dl>
          </div>
          <p className="reveal-up words mt-5 max-w-[52ch] text-white/75">
            <Words>
            My one-person web development business: custom-coded sites for
            owner-operated BC businesses, every one editable by its owner
            without calling me. It pays for my degree, and every client so
            far has left a five-star review.
            </Words>
          </p>
          <ObdesignShowcase />
        </div>
      </section>

      {/* 04 · About: comes back up out of the tunnel. */}
      <SectionRule num="04" />
      <section id="about" className="section-pad relative">
        <div className="container-site">
          {/* Same 64rem measure as the photo-and-text grid below, so the
              heading's left edge lines up with the photo and the 03 sits on
              the grid's right edge rather than out at the page edge. */}
          <div className="reveal-up lift mx-auto flex max-w-[64rem] items-end justify-between gap-6">
            <h2 className="anim-heading text-[clamp(2.5rem,6vw,4.5rem)] text-white/95">
              About me<span className="text-sage">.</span>
            </h2>
            <p className="eyebrow hidden sm:block">04</p>
          </div>

          {/* Centred measure: on a near-full-bleed container the photo sat
              at the far left with the text starting a column later and
              nothing on the right. The pair now reads as one composition. */}
          <div className="mx-auto mt-14 grid max-w-[64rem] items-center gap-14 md:grid-cols-[minmax(260px,360px)_1fr] md:gap-16">
            {/* The photo pops on its own (anim-image); no second reveal on
                the wrapper, which stacked a rise on top of the pop. */}
            <div className="relative max-w-[380px]">
              <Image
                src={img("/images/about/owen-brown-portrait-2.jpg")}
                sizes="(min-width: 768px) 380px, 100vw"
                alt="Owen Brown"
                width={760}
                height={950}
                className="anim-image aspect-[4/5] w-full border border-white/15 object-cover shadow-2xl"
              />
            </div>
            <div>
              <p className="reveal-up words max-w-[52ch] text-[clamp(1.05rem,1.8vw,1.3rem)] leading-relaxed text-white/75">
                <Words>
                I grew up on Salt Spring Island and I’m in my fourth year of
                software engineering at UVic. At nineteen I ran a painting
                business and did $80,000 in revenue. Now{" "}
                <Link
                  href="/obdesign"
                  className="link-underline font-semibold text-white"
                >
                  OBdesign
                </Link>{" "}
                pays for my degree, and{" "}
                <Link
                  href="/#work"
                  className="link-underline font-semibold text-white"
                >
                  the projects
                </Link>{" "}
                are where I actually learn the engineering.
                </Words>
              </p>
              <p className="reveal-up words mt-6 max-w-[52ch] text-white/75">
                <Words>
                  Looking for a Spring 2027 co-op in Victoria or remote. The
                  full picture is on the{" "}
                  <Link href="/resume" className="link-underline text-white/90">
                    resume
                  </Link>
                  .
                </Words>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 05 · Contact */}
      <SectionRule num="05" />
      <section id="contact" className="section-pad relative overflow-hidden">
        <div className="container-site relative grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div>
            <p className="eyebrow reveal-up !text-sage">05 · Contact</p>
            {/* Same row as every other section heading: the reveal-up lift
                wrapper drifts with scroll, the heading rises inside it. */}
            <div className="reveal-up lift mt-5">
              <h2 className="anim-heading max-w-[16ch] text-[clamp(2.5rem,6vw,4.5rem)] text-white/95">
                Let’s talk.
              </h2>
            </div>
            <p className="reveal-up words mt-5 max-w-[44ch] text-white/75">
              <Words>
              If you’re hiring for a co-op, or you just want to know how
              something on here works, write me. I’ll get back to you.
              </Words>
            </p>

            <p className="reveal-up mt-10 label-mono text-white/75">
              Or find me here
            </p>
            <div className="reveal-up mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href={`mailto:${identity.email}`}
              className="link-draw inline-flex items-center gap-2 text-sm text-white/75"
            >
              <MailIcon />
              Email
            </a>
            <a
              href={identity.github}
              rel="me noopener"
              className="link-draw inline-flex items-center gap-2 text-sm text-white/75"
            >
              <GitHubIcon />
              GitHub
            </a>
            <a
              href={identity.linkedin}
              rel="me noopener"
              className="link-draw inline-flex items-center gap-2 text-sm text-white/75"
            >
              <LinkedInIcon />
              LinkedIn
            </a>
            <a
              href="https://www.obwebdesign.ca"
              rel="noopener"
              className="link-draw inline-flex items-center gap-1.5 text-sm text-white/75"
            >
              <ObdesignWordmark className="text-base" />
              <ArrowUpRightIcon />
            </a>
            </div>
          </div>

          <div className="reveal-up relative w-full lg:ml-auto lg:max-w-[36rem]">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
