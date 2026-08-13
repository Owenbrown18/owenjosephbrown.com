import Image from "next/image";
import Link from "next/link";
import { ForestCanvas } from "@/components/forest-canvas";
import { SiteMarquee } from "@/components/site-marquee";
import { identity } from "@/lib/resume-data";

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

export default function HomePage() {
  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* The forest field runs behind the entire landing page. */}
      <div className="forest-ground fixed inset-0 -z-10">
        <ForestCanvas />
      </div>

      {/* Hero */}
      <section className="relative">
        <div className="container-site py-28 sm:py-40">
          <div className="hero-stage max-w-[52rem]">
            <p className="eyebrow !text-sage">
              Software engineer · Salt Spring Island, BC
            </p>
            <h1 className="mt-6 text-[clamp(3.25rem,9vw,7rem)] font-extrabold text-white/95">
              I build software people actually&nbsp;use.
            </h1>
            <p className="mt-7 max-w-[46ch] text-lg leading-relaxed text-white/70">
              Fourth-year software engineering student at UVic. Founder of
              OBdesign, a one-person studio with nine production sites live for
              BC businesses. Currently building{" "}
              <Link
                href="/work/grain"
                className="text-white/95 underline decoration-sage decoration-2 underline-offset-4 hover:decoration-white"
              >
                grain
              </Link>
              , a shared film camera for iOS.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a
                href="#experience"
                className="rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.06em] text-forest transition-transform duration-200 hover:-translate-y-0.5"
              >
                See the work
              </a>
              <a
                href={identity.github}
                rel="me noopener"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                GitHub
              </a>
              <Link
                href="/resume"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                Resume
              </Link>
              <span className="text-sm text-sage">
                Open to a Spring 2027 co-op
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="relative border-t border-white/10">
        <div className="container-site py-20 sm:py-28">
          <div className="reveal-up">
            <div className="sage-bar mb-7" />
            <p className="eyebrow !text-sage">Experience</p>
            <h2 className="mt-4 max-w-[22ch] text-[clamp(2.5rem,5.5vw,4rem)] text-white/95">
              Real work, for real people.
            </h2>
          </div>

          {/* OBdesign */}
          <div className="mt-14 reveal-up">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h3 className="font-display text-[clamp(2rem,4.5vw,3rem)] font-bold text-white/95">
                OBdesign<span className="text-sage">.</span>
              </h3>
              <p className="text-sm text-white/55">
                Founder & web developer · June 2025 – present
              </p>
            </div>
            <p className="mt-5 max-w-[58ch] text-white/70">
              My one-person web studio. Nine production sites live for BC
              businesses, every one custom-coded in Next.js or Astro and
              editable by its owner. I run the whole thing: design, code,
              integrations, DNS, performance, and the client relationship.
              Even the client acquisition is software, a Python pipeline where
              roughly 7% of first cold emails become paying projects.
            </p>
          </div>
        </div>

        <div className="reveal-up pb-6">
          <SiteMarquee />
        </div>

        <div className="container-site pb-16 sm:pb-20">
          <Link
            href="/obdesign"
            className="link-underline font-display text-xl font-bold text-white/95"
          >
            Step inside the studio →
          </Link>

          {/* Aperture AI */}
          <div className="mt-14 border-t border-white/10 pt-10 reveal-up">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h3 className="font-display text-2xl font-bold text-white/95">
                Aperture AI
              </h3>
              <p className="text-sm text-white/55">
                Developer, 5-person startup team · May – December 2025
              </p>
            </div>
            <p className="mt-4 max-w-[58ch] text-white/70">
              React Native (Expo) frontend features for an AI photography
              assistant on an OpenAI and Supabase backend: authentication
              flows, asynchronous API requests, caching, onboarding and
              settings UI.
            </p>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="relative border-t border-white/10">
        <div className="container-site py-20 sm:py-28">
          <div className="reveal-up">
            <div className="sage-bar mb-7" />
            <p className="eyebrow !text-sage">Projects</p>
            <h2 className="mt-4 max-w-[22ch] text-[clamp(2.5rem,5.5vw,4rem)] text-white/95">
              Built from zero, shipped for real.
            </h2>
          </div>

          {/* grain */}
          <div className="mt-14 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div className="reveal-up">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h3 className="font-display text-[clamp(2rem,4.5vw,3rem)] font-bold text-white/95">
                  grain
                </h3>
                <p className="text-sm text-white/55">
                  Founder & sole developer · 2026
                </p>
              </div>
              <p className="mt-5 max-w-[52ch] text-white/70">
                A shared film camera for iOS. Friends join a roll, shoot blind
                with no preview, and nobody sees a photo until the roll gets
                developed. React Native and Supabase, with the game rules
                enforced in Postgres (row-level security and locked
                transactions), and a Kodak-style film shader applied on the GPU
                at capture.
              </p>
              <p className="mt-6">
                <Link
                  href="/work/grain"
                  className="link-underline font-display text-xl font-bold text-white/95"
                >
                  Read the build →
                </Link>
              </p>
            </div>
            <div className="reveal-up grid grid-cols-3 gap-3">
              {["home_roll", "new_roll_qr", "waiting"].map((shot) => (
                <Image
                  key={shot}
                  src={`/images/grain/${shot}.png`}
                  alt=""
                  width={260}
                  height={563}
                  className="h-auto w-full border border-white/15"
                />
              ))}
            </div>
          </div>

          {/* leadgen */}
          <div className="mt-16 border-t border-white/10 pt-10 reveal-up">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h3 className="font-display text-2xl font-bold text-white/95">
                Lead generation pipeline
              </h3>
              <p className="text-sm text-white/55">Python · 2026</p>
            </div>
            <p className="mt-4 max-w-[58ch] text-white/70">
              The ~3,900-line system that finds OBdesign’s clients: scraping,
              site analysis, email discovery, validation, and drafting,
              instrumented all the way to revenue.
            </p>
            <p className="mt-5">
              <Link
                href="/work/leadgen"
                className="link-underline font-display text-xl font-bold text-white/95"
              >
                Read the build →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Brief about */}
      <section id="about" className="relative border-t border-white/10">
        <div className="container-site grid gap-10 py-20 sm:py-28 md:grid-cols-[auto_1fr] md:gap-14">
          <div className="reveal-up">
            <Image
              src="/images/about/owen-brown.jpg"
              alt="Owen Brown"
              width={220}
              height={275}
              className="h-auto w-[180px] border border-white/15 object-cover md:w-[220px]"
            />
          </div>
          <div className="reveal-up max-w-[58ch]">
            <div className="sage-bar mb-7" />
            <p className="eyebrow !text-sage">About</p>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3rem)] text-white/95">
              A ferry ride from everything.
            </h2>
            <p className="mt-5 text-white/70">
              I grew up on Salt Spring Island and study software engineering at
              UVic (BSEng co-op, finishing 2029). At nineteen I ran a painting
              business to $80,000 in revenue; now the studio funds my degree
              and the projects sharpen the engineering. I like shipping more
              than I like starting.
            </p>
            <p className="mt-5 text-sm">
              <Link href="/about" className="link-underline text-white/95">
                More about me
              </Link>
              <span className="mx-3 text-white/40">·</span>
              <Link href="/resume" className="link-underline text-white/95">
                Resume
              </Link>
              <span className="mx-3 text-white/40">·</span>
              <a
                href={`mailto:${identity.email}`}
                className="link-underline text-white/95"
              >
                {identity.email}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="relative border-t border-white/10">
        <div className="container-site py-24 text-center sm:py-32">
          <p className="eyebrow !text-sage">Get in touch</p>
          <h2 className="mx-auto mt-5 max-w-[16ch] text-[clamp(2.75rem,7vw,5rem)] font-extrabold text-white/95">
            Let’s talk.
          </h2>
          <p className="mx-auto mt-5 max-w-[44ch] text-white/70">
            Hiring for a co-op or internship, or just curious how something
            here was built? My inbox is open.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
            <a
              href={`mailto:${identity.email}`}
              className="rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.06em] text-forest transition-transform duration-200 hover:-translate-y-0.5"
            >
              Email me
            </a>
            <a
              href={identity.linkedin}
              rel="me noopener"
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              LinkedIn
            </a>
            <a
              href={identity.github}
              rel="me noopener"
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
