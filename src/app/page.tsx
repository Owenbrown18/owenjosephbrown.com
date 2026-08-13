import Image from "next/image";
import Link from "next/link";
import { ForestCanvas } from "@/components/forest-canvas";
import { SiteMarquee } from "@/components/site-marquee";
import { clientSites } from "@/lib/sites";
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

const expertise = [
  {
    num: "01",
    title: "Full-stack web",
    sub: "Next.js · TypeScript · Astro",
    copy: "Nine production sites built, shipped, and maintained for paying clients. Custom code, git-based CMS, DNS, performance budgets: the whole surface.",
  },
  {
    num: "02",
    title: "Mobile",
    sub: "React Native · Expo",
    copy: "Building grain, a full-stack iOS app, solo: camera pipeline, GPU film shader, offline upload queue. Startup frontend experience at Aperture AI.",
  },
  {
    num: "03",
    title: "Systems & data",
    sub: "Python · Postgres · Supabase",
    copy: "A ~3,900-line acquisition pipeline instrumented to revenue, and server-enforced app logic: row-level security and locked transactions.",
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* The forest field runs behind the entire page. */}
      <div className="forest-ground fixed inset-0 -z-10">
        <ForestCanvas />
      </div>

      {/* 01 · Hero */}
      <section id="home" className="relative">
        <div className="container-site flex min-h-[100svh] flex-col justify-center pb-14 pt-28 text-center">
          <div className="hero-stage">
            <p className="eyebrow !text-sage">
              Salt Spring Island, BC · UVic software engineering
            </p>
            <h1 className="mx-auto mt-7 text-[clamp(3.5rem,13vw,11rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.03em] text-white/95">
              Owen Brown
            </h1>
            <p className="mt-7 text-[clamp(0.78rem,1.7vw,1rem)] font-medium uppercase tracking-[0.3em] text-white/70">
              Software engineer, web & app developer.
            </p>
            <p className="mt-5 text-sm text-sage">
              Open to a Spring 2027 co-op · Victoria or remote
            </p>
          </div>

          <div className="mt-auto pt-14">
            <p className="eyebrow !text-white/40">
              Real sites for real businesses
            </p>
            <p className="mx-auto mt-3 max-w-[72ch] text-sm leading-relaxed text-white/45">
              {clientSites.map((s, i) => (
                <span key={s.slug}>
                  <span className="whitespace-nowrap">{s.name}</span>
                  {i < clientSites.length - 1 && (
                    <span className="mx-2 text-white/25">·</span>
                  )}{" "}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* 02 · Expertise: an open list, not cards. */}
      <section id="expertise" className="relative">
        <div className="container-site pb-6 pt-14 sm:pt-20">
          <div className="reveal-up flex items-end justify-between gap-6">
            <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] text-white/95">
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

      {/* 03 · Work */}
      <section id="work" className="relative">
        <div className="container-site pt-24 sm:pt-32">
          <div className="reveal-up flex items-end justify-between gap-6">
            <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] text-white/95">
              My work<span className="text-sage">.</span>
            </h2>
            <p className="eyebrow hidden !text-white/40 sm:block">03</p>
          </div>
          <p className="reveal-up mt-5 max-w-[56ch] text-white/70">
            Real businesses run on this work. Each piece links to a full case
            study: the problem, the decisions, and what happened after launch.
          </p>
        </div>

        {/* The studio, full bleed and photo-first. */}
        <div className="container-site relative z-10 mt-16">
          <p className="eyebrow !text-sage">The studio</p>
          <h3 className="mt-3 font-display text-[clamp(2.75rem,8vw,6rem)] font-extrabold leading-[0.9] text-white/95">
            OBdesign<span className="text-sage">.</span>
          </h3>
          <p className="mt-5 max-w-[52ch] text-white/70">
            My one-person web studio. Nine production sites for BC businesses,
            every one custom-coded and editable by its owner. Roughly 7% of
            the studio’s first cold emails become paying projects, found by a
            pipeline I wrote.
          </p>
        </div>

        {/* Mobile: stacked, full width. */}
        <div className="container-site mt-8 space-y-4 sm:hidden">
          <Image
            src="/images/work/grain-construction.png"
            alt="Grain Construction website"
            width={1200}
            height={750}
            className="h-auto w-full border border-white/15"
          />
          <Image
            src="/images/work/figs-and-honey.png"
            alt="Figs & Honey website"
            width={900}
            height={563}
            className="h-auto w-full border border-white/15"
          />
        </div>

        {/* Desktop: staggered full-bleed collage with opposing parallax. */}
        <div className="fullbleed relative mt-[-1.5rem] hidden h-[clamp(380px,52vw,680px)] sm:mt-[-3rem] sm:block">
          <div className="parallax-a absolute left-[3%] top-[8%] w-[54%] border border-white/15 shadow-2xl">
            <Image
              src="/images/work/grain-construction.png"
              alt="Grain Construction website"
              width={1200}
              height={750}
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="parallax-b absolute right-[4%] top-[24%] z-10 w-[38%] border border-white/15 shadow-2xl">
            <Image
              src="/images/work/figs-and-honey.png"
              alt="Figs & Honey website"
              width={900}
              height={563}
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="parallax-a absolute bottom-0 left-[32%] w-[32%] border border-white/15 shadow-2xl">
            <Image
              src="/images/work/daves-bakery.png"
              alt="Daves' Bakery website"
              width={900}
              height={563}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-10">
          <SiteMarquee />
        </div>

        <div className="container-site mt-8">
          <Link
            href="/obdesign"
            className="link-underline font-display text-xl font-bold text-white/95"
          >
            View the studio →
          </Link>
        </div>

        {/* grain, the featured project. */}
        <div className="container-site mt-28 sm:mt-36">
          <div className="grid items-center gap-12 md:grid-cols-[1.1fr_1fr]">
            <div className="reveal-up">
              <p className="eyebrow !text-sage">Featured project</p>
              <h3 className="mt-3 font-display text-[clamp(2.75rem,8vw,6rem)] font-extrabold leading-[0.9] text-white/95">
                grain
              </h3>
              <p className="mt-5 max-w-[46ch] text-white/70">
                A shared film camera for iOS. Friends join a roll, shoot blind
                with no preview, and nobody sees a photo until the roll gets
                developed. Server-authoritative Postgres, a Kodak-style film
                shader on the GPU at capture, and an upload queue that
                survives dead signal.
              </p>
              <p className="mt-7">
                <Link
                  href="/work/grain"
                  className="link-underline font-display text-xl font-bold text-white/95"
                >
                  View project →
                </Link>
              </p>
            </div>
            <div className="relative grid grid-cols-3 items-end gap-4">
              <div className="parallax-b">
                <Image
                  src="/images/grain/home_roll.png"
                  alt="grain home screen with an active roll"
                  width={260}
                  height={563}
                  className="h-auto w-full border border-white/15 shadow-2xl"
                />
              </div>
              <div className="parallax-a mb-10">
                <Image
                  src="/images/grain/new_roll_qr.png"
                  alt="A roll's QR share code"
                  width={260}
                  height={563}
                  className="h-auto w-full border border-white/15 shadow-2xl"
                />
              </div>
              <div className="parallax-b mb-4">
                <Image
                  src="/images/grain/waiting.png"
                  alt="The waiting room before a roll is developed"
                  width={260}
                  height={563}
                  className="h-auto w-full border border-white/15 shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* The pipeline, one editorial line. */}
        <div className="container-site mt-24">
          <div className="reveal-up flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3 border-t border-white/15 pt-8">
            <div>
              <h3 className="font-display text-2xl font-bold text-white/95">
                Lead generation pipeline
              </h3>
              <p className="mt-2 max-w-[52ch] text-sm text-white/60">
                The ~3,900-line Python system that finds the studio’s clients,
                instrumented all the way to revenue.
              </p>
            </div>
            <Link
              href="/work/leadgen"
              className="link-underline font-display text-lg font-bold text-white/95"
            >
              View project →
            </Link>
          </div>
        </div>
      </section>

      {/* About, conversational. */}
      <section id="about" className="relative">
        <div className="container-site max-w-4xl py-24 sm:py-32">
          <p className="reveal-up eyebrow !text-sage">About</p>
          <p className="reveal-up mt-6 text-[clamp(1.15rem,2.2vw,1.5rem)] leading-relaxed text-white/80">
            I grew up on Salt Spring Island and study software engineering at
            UVic. At nineteen I ran a painting business to $80,000 in revenue.
            Now{" "}
            <a
              href="https://www.obwebdesign.ca"
              rel="noopener"
              className="font-semibold text-white underline decoration-sage decoration-2 underline-offset-4 hover:decoration-white"
            >
              the studio
            </a>{" "}
            funds my degree and{" "}
            <Link
              href="/work/grain"
              className="font-semibold text-white underline decoration-sage decoration-2 underline-offset-4 hover:decoration-white"
            >
              the projects
            </Link>{" "}
            sharpen the engineering. I like shipping more than I like
            starting, and I’d rather show you a live URL than a slide about
            one.
          </p>
          <p className="reveal-up mt-8">
            <Link
              href="/about"
              className="link-underline font-display text-xl font-bold text-white/95"
            >
              See more about me →
            </Link>
          </p>
        </div>
      </section>

      {/* 04 · Contact */}
      <section id="contact" className="relative overflow-hidden">
        <div className="container-site relative pb-10 pt-10 text-center sm:pt-16">
          <p className="eyebrow !text-sage">04 · Contact</p>
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
          <p
            aria-hidden
            className="pointer-events-none mx-auto mt-14 select-none font-display text-[clamp(8rem,28vw,22rem)] font-black leading-[0.72] text-white/[0.04]"
          >
            OB<span className="text-sage/10">.</span>
          </p>
        </div>
      </section>
    </div>
  );
}
