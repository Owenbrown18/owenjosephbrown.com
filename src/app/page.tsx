import Image from "next/image";
import Link from "next/link";
import { SiteMarquee } from "@/components/site-marquee";
import { PhoneFrame } from "@/components/phone-frame";
import {
  ArrowUpRightIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  ObdesignWordmark,
} from "@/components/icons";
import { SectionRule } from "@/components/section-rule";
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
    copy: "10+ production sites built, shipped, and maintained for paying clients, generating $20,000+ in revenue. Custom code, git-based CMS, DNS, performance budgets: the whole surface.",
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

      <div aria-hidden className="page-grade" />

      {/* 01 · Hero */}
      <section id="home" className="relative">
        <div className="container-site relative flex min-h-[100svh] flex-col items-center justify-center pb-40 pt-24 text-center">
          <div className="hero-stage hero-parallax">
            <p className="eyebrow !text-sage">
              Salt Spring Island, BC · UVic software engineering
            </p>
            <h1 className="hero-name mx-auto mt-7 text-[clamp(3.5rem,13vw,11rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.03em] text-white/95">
              {/* Split so the two words arrive on a stagger. The full name
                  stays intact for screen readers and copy-paste. */}
              <span className="hero-word">Owen</span>{" "}
              <span className="hero-word">Brown</span>
            </h1>
            <p className="mt-7 text-[clamp(0.78rem,1.7vw,1rem)] font-medium uppercase tracking-[0.3em] text-white/70">
              Software engineer, web & app developer.
            </p>
            <p className="mt-5 text-sm text-sage">
              Open to a Spring 2027 co-op · Victoria or remote
            </p>
          </div>

          <div className="hero-parallax absolute inset-x-0 bottom-10">
            {/* Desktop only: on a phone the hero is tall enough that this
                collided with the subtitle, and a touch device does not need
                telling that a page scrolls. */}
            <a
              href="#expertise"
              className="scroll-cue group mx-auto mb-9 hidden w-fit flex-col items-center gap-2 sm:flex"
              aria-label="Scroll to my expertise"
            >
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/35 transition-colors group-hover:text-white/70">
                Scroll
              </span>
              <span aria-hidden className="scroll-cue-track">
                <span className="scroll-cue-dot" />
              </span>
            </a>
            <p className="eyebrow !text-white/40">
              Real sites for real businesses
            </p>
            <p className="mx-auto mt-3 max-w-[72ch] px-6 text-sm leading-relaxed text-white/45">
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

      {/* 02 · Expertise: the page's one open, lighter clearing. */}
      <SectionRule num="02" />
      <section id="expertise" className="section-pad relative">
        <p
          aria-hidden
          className="parallax-b pointer-events-none absolute -top-16 right-[2%] select-none font-display text-[clamp(10rem,26vw,20rem)] font-black leading-none text-white/[0.035]"
        >
          02
        </p>
        <div className="container-site">
          <div className="reveal-up lift flex items-end justify-between gap-6">
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

      {/* 03 · Work — the deep point of the page's one continuous grade. */}
      <SectionRule num="03" />
      <section id="work" className="section-pad relative">
        <p
          aria-hidden
          className="parallax-b pointer-events-none absolute right-[2%] top-4 select-none font-display text-[clamp(10rem,26vw,20rem)] font-black leading-none text-white/[0.035]"
        >
          03
        </p>
        <div className="container-site">
          <div className="reveal-up lift flex items-end justify-between gap-6">
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
          <h3 className="mt-3 text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] text-white/95">
            <ObdesignWordmark />
          </h3>
          <p className="mt-5 max-w-[52ch] text-white/70">
            My one-person web studio. Over ten production sites for BC businesses,
            every one custom-coded and editable by its owner. Roughly 7% of
            the studio’s first cold emails become paying projects, found by a
            pipeline I wrote.
          </p>
        </div>

        {/* Mobile: stacked, full width. */}
        <div className="container-site mt-8 space-y-4 sm:hidden">
          <Image
            src="/images/work/grain-construction.webp"
            alt="Grain Construction website"
            width={1200}
            height={750}
            className="h-auto w-full border border-white/15"
          />
          <Image
            src="/images/work/figs-and-honey.webp"
            alt="Figs & Honey website"
            width={900}
            height={563}
            className="h-auto w-full border border-white/15"
          />
        </div>

        {/* Desktop: staggered full-bleed collage with opposing parallax. */}
        <div className="fullbleed relative mt-[-1.5rem] hidden h-[clamp(380px,52vw,680px)] sm:mt-[-3rem] sm:block">
          <div
            aria-hidden
            className="absolute left-[8%] top-[5%] h-[90%] w-[65%] bg-[radial-gradient(closest-side,rgba(123,164,158,0.13),transparent)]"
          />
          <div className="parallax-a absolute left-[3%] top-[8%] w-[54%] border border-white/15 shadow-2xl">
            <Image
              src="/images/work/grain-construction.webp"
              alt="Grain Construction website"
              width={1200}
              height={750}
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="parallax-b absolute right-[4%] top-[24%] z-10 w-[38%] border border-white/15 shadow-2xl">
            <Image
              src="/images/work/figs-and-honey.webp"
              alt="Figs & Honey website"
              width={900}
              height={563}
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="parallax-a absolute bottom-0 left-[32%] w-[32%] border border-white/15 shadow-2xl">
            <Image
              src="/images/work/daves-bakery.webp"
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
        <div className="container-site mt-24 sm:mt-28">
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
              <div
                aria-hidden
                className="absolute -inset-12 bg-[radial-gradient(closest-side,rgba(214,164,80,0.12),transparent)]"
              />
              <div className="parallax-b">
                <PhoneFrame>
                  <Image
                    src="/images/grain/home_roll.webp"
                    alt="grain home screen with an active roll"
                    width={260}
                    height={563}
                    className="h-auto w-full"
                  />
                </PhoneFrame>
              </div>
              <div className="parallax-a mb-10">
                <PhoneFrame>
                  <Image
                    src="/images/grain/new_roll_qr.webp"
                    alt="A roll's QR share code"
                    width={260}
                    height={563}
                    className="h-auto w-full"
                  />
                </PhoneFrame>
              </div>
              <div className="parallax-b mb-4">
                <PhoneFrame>
                  <Image
                    src="/images/grain/waiting.webp"
                    alt="The waiting room before a roll is developed"
                    width={260}
                    height={563}
                    className="h-auto w-full"
                  />
                </PhoneFrame>
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
            <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] text-white/95">
              About me<span className="text-sage">.</span>
            </h2>
            <p className="eyebrow hidden !text-white/40 sm:block">04</p>
          </div>

          <div className="mt-14 grid items-center gap-14 md:grid-cols-[minmax(260px,380px)_1fr] md:gap-20">
            <div className="reveal-up relative max-w-[380px]">
              <Image
                src="/images/about/owen-brown.jpg"
                alt="Owen Brown"
                width={760}
                height={950}
                className="aspect-[4/5] w-full border border-white/15 object-cover shadow-2xl"
              />
            </div>
            <div className="reveal-up">
              <p className="max-w-[52ch] text-[clamp(1.05rem,1.8vw,1.3rem)] leading-relaxed text-white/75">
                I grew up on Salt Spring Island and study software engineering
                at UVic. At nineteen I ran a painting business to $80,000 in
                revenue. Now{" "}
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
                starting, and I’d rather show you a live URL than a slide
                about one.
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
        <div className="container-site relative text-center">
          <p className="eyebrow !text-sage">05 · Contact</p>
          <h2 className="mx-auto mt-5 max-w-[16ch] text-[clamp(2.75rem,7vw,5rem)] font-extrabold text-white/95">
            Let’s talk.
          </h2>
          <p className="mx-auto mt-5 max-w-[44ch] text-white/70">
            Hiring for a co-op or internship, or just curious how something
            here was built? My inbox is open.
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
