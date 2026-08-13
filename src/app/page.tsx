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
    sub: "Next.js, TypeScript, Astro",
    copy: "Nine production sites built, shipped, and maintained for paying clients: custom code, git-based CMS, DNS, performance budgets, the whole surface.",
  },
  {
    num: "02",
    title: "Mobile",
    sub: "React Native, Expo",
    copy: "Building grain, a full-stack iOS app, solo: camera pipeline, GPU film shader, offline upload queue. Startup frontend experience at Aperture AI.",
  },
  {
    num: "03",
    title: "Systems & data",
    sub: "Python, Postgres, Supabase",
    copy: "A ~3,900-line acquisition pipeline instrumented to revenue, and server-enforced app logic: row-level security, locked transactions, security-definer RPCs.",
  },
];

const experience = [
  {
    role: "Founder & Web Developer",
    org: "OBdesign",
    url: "https://www.obwebdesign.ca",
    urlLabel: "obwebdesign.ca",
    period: "June 2025 – present",
    location: "Salt Spring Island & Victoria, BC",
    copy: "Run a one-person web studio: nine production sites for BC businesses, custom-coded and client-editable, plus the Python pipeline that finds the clients. Roughly 7% of first cold emails become paying projects.",
    chips: ["TypeScript", "Next.js", "Astro", "Tailwind", "Keystatic", "Vercel", "Python"],
  },
  {
    role: "Developer",
    org: "Aperture AI",
    period: "May – December 2025",
    location: "Victoria, BC (5-person startup team)",
    copy: "Cross-platform React Native frontend for an AI photography assistant: authentication flows, asynchronous API requests, caching, onboarding and settings UI.",
    chips: ["React Native", "Expo", "OpenAI API", "Supabase"],
  },
  {
    role: "Business Operator",
    org: "Scholars Edge Painting",
    period: "December 2023 – September 2024",
    location: "Salt Spring Island & Victoria, BC",
    copy: "Built and ran a service business to $80,000+ in revenue at nineteen: client acquisition, scheduling, hiring, and delivery with a team of four across 20+ projects.",
    chips: [],
  },
  {
    role: "BSEng, Software Engineering (co-op)",
    org: "University of Victoria",
    period: "September 2023 – 2029",
    location: "Victoria, BC",
    copy: "Current term: operating systems, software architecture, and security engineering. Four co-op work terms ahead, the first in Spring 2027.",
    chips: [],
  },
];

const testimonials = [
  {
    quote:
      "The entire experience was outstanding from start to finish. The process was seamless, his communication was excellent, and the attention to detail he put into every aspect of the site was exceptional.",
    name: "Dan Smith",
    title: "Grain Construction",
  },
  {
    quote:
      "Owen was brilliant. He held my hand and was incredibly patient and helpful. He built two wonderful websites for me with a shop on and booking system too.",
    name: "Lisa Sliwowska",
    title: "Figs & Honey",
  },
  {
    quote:
      "Looks absolutely AMAZING and we are very happy with it. Thank you once again very much for your kind help and assistance with this exciting project.",
    name: "David & Dave",
    title: "Daves' Bakery",
  },
];

export default function HomePage() {
  return (
    <div className="relative">
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
        <div className="container-site flex min-h-[calc(100svh-3.5rem)] flex-col justify-center py-20 text-center">
          <div className="hero-stage">
            <p className="eyebrow !text-sage">
              Salt Spring Island, BC · UVic software engineering
            </p>
            <h1 className="mx-auto mt-8 text-[clamp(3.5rem,12vw,10rem)] font-extrabold uppercase leading-[0.9] text-white/95">
              Owen Brown
            </h1>
            <p className="mt-8 text-[clamp(0.8rem,1.8vw,1.05rem)] font-medium uppercase tracking-[0.3em] text-white/70">
              Software engineer, web & app developer.
            </p>
            <p className="mt-6 text-sm text-sage">
              Open to a Spring 2027 co-op · Victoria or remote
            </p>
          </div>

          <div className="mt-auto pt-16">
            <p className="eyebrow !text-white/40">Real sites for real businesses</p>
            <p className="mx-auto mt-3 max-w-[70ch] text-sm leading-relaxed text-white/45">
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

      {/* 02 · Expertise */}
      <section id="expertise" className="relative border-t border-white/10">
        <div className="container-site py-20 sm:py-28">
          <div className="reveal-up">
            <div className="sage-bar mb-7" />
            <p className="eyebrow !text-sage">02 · Expertise</p>
            <h2 className="mt-4 text-[clamp(2.5rem,6vw,4.5rem)] text-white/95">
              My expertise.
            </h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">
            {expertise.map((item) => (
              <div key={item.num} className="reveal-up bg-forest/90 p-8 sm:p-10">
                <p className="text-xs font-bold text-sage">{item.num}</p>
                <h3 className="mt-4 font-display text-2xl font-bold text-white/95">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-white/50">{item.sub}</p>
                <p className="mt-5 text-sm leading-relaxed text-white/70">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 · Work */}
      <section id="work" className="relative border-t border-white/10">
        <div className="container-site py-20 sm:py-28">
          <div className="reveal-up max-w-[52rem]">
            <div className="sage-bar mb-7" />
            <p className="eyebrow !text-sage">03 · Work</p>
            <h2 className="mt-4 text-[clamp(2.5rem,6vw,4.5rem)] text-white/95">
              My work.
            </h2>
            <p className="mt-6 max-w-[56ch] text-white/70">
              Shipped products for real users: nine client businesses run on
              sites I built, and my own products carry the deeper engineering.
              Every case study covers the problem, the decisions, and what
              happened after launch.
            </p>
          </div>

          {/* Featured: grain */}
          <div className="mt-14 reveal-up overflow-hidden border border-white/10">
            <div className="grid md:grid-cols-[1.1fr_1fr]">
              <div className="p-8 sm:p-12">
                <p className="eyebrow !text-sage">Featured project</p>
                <h3 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] font-bold text-white/95">
                  grain
                </h3>
                <p className="mt-4 max-w-[46ch] text-white/70">
                  A shared film camera for iOS. Friends join a roll, shoot
                  blind, and nobody sees a photo until it gets developed.
                  Server-authoritative Postgres, a GPU film shader at capture,
                  and an upload queue that survives dead signal.
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
              <div className="flex items-end gap-3 px-8 pt-4 sm:px-10">
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
          </div>

          {/* Featured: the studio */}
          <div className="mt-8 reveal-up overflow-hidden border border-white/10">
            <div className="p-8 sm:p-12">
              <p className="eyebrow !text-sage">The studio</p>
              <h3 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] font-bold text-white/95">
                OBdesign<span className="text-sage">.</span>
              </h3>
              <p className="mt-4 max-w-[52ch] text-white/70">
                Every site below is a paying client’s business running on my
                code. Custom builds, client-editable, deployed and maintained.
              </p>
            </div>
            <div className="pb-4">
              <SiteMarquee />
            </div>
            <div className="p-8 pt-2 sm:px-12">
              <Link
                href="/obdesign"
                className="link-underline font-display text-xl font-bold text-white/95"
              >
                View the studio →
              </Link>
            </div>
          </div>

          {/* Leadgen, slim */}
          <div className="mt-8 reveal-up border border-white/10 p-8 sm:p-12">
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
              <div>
                <p className="eyebrow !text-sage">Systems</p>
                <h3 className="mt-3 font-display text-2xl font-bold text-white/95">
                  Lead generation pipeline
                </h3>
                <p className="mt-3 max-w-[52ch] text-sm text-white/70">
                  The ~3,900-line Python system that finds the studio’s
                  clients, instrumented all the way to revenue.
                </p>
              </div>
              <Link
                href="/work/leadgen"
                className="link-underline font-display text-xl font-bold text-white/95"
              >
                View project →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 04 · Experience */}
      <section id="experience" className="relative border-t border-white/10">
        <div className="container-site py-20 sm:py-28">
          <div className="reveal-up">
            <div className="sage-bar mb-7" />
            <p className="eyebrow !text-sage">04 · Experience</p>
            <h2 className="mt-4 text-[clamp(2.5rem,6vw,4.5rem)] text-white/95">
              Where I’ve worked.
            </h2>
          </div>
          <div className="mt-12">
            {experience.map((job) => (
              <div
                key={job.org}
                className="reveal-up border-t border-white/10 py-10 first:border-t-0"
              >
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-baseline">
                  <h3 className="font-display text-2xl font-bold text-white/95">
                    {job.role}{" "}
                    <span className="text-white/50">
                      @{" "}
                      {job.url ? (
                        <a
                          href={job.url}
                          rel="noopener"
                          className="underline decoration-sage decoration-[1.5px] underline-offset-4 hover:text-white"
                        >
                          {job.org}
                        </a>
                      ) : (
                        job.org
                      )}
                    </span>
                  </h3>
                  <p className="text-sm tabular-nums text-white/55">
                    {job.period}
                  </p>
                </div>
                <p className="mt-1 text-sm text-white/45">{job.location}</p>
                <p className="mt-4 max-w-[62ch] text-white/70">{job.copy}</p>
                {job.chips.length > 0 && (
                  <p className="mt-5 flex flex-wrap gap-2">
                    {job.chips.map((chip) => (
                      <span key={chip} className="chip !text-white/60">
                        {chip}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative border-t border-white/10">
        <div className="container-site py-20 sm:py-28">
          <div className="reveal-up">
            <div className="sage-bar mb-7" />
            <p className="eyebrow !text-sage">Kind words</p>
            <h2 className="mt-4 max-w-[20ch] text-[clamp(2rem,4.5vw,3.25rem)] text-white/95">
              From the people paying for it.
            </h2>
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="reveal-up">
                <blockquote className="border-l-2 border-sage pl-5 font-display text-lg leading-snug text-white/85">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-4 pl-5 text-sm text-white/55">
                  {t.name} · {t.title}
                </figcaption>
              </figure>
            ))}
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
              UVic. At nineteen I ran a painting business to $80,000 in
              revenue; now the studio funds my degree and the projects sharpen
              the engineering. I like shipping more than I like starting.
            </p>
            <p className="mt-6">
              <Link
                href="/about"
                className="link-underline font-display text-xl font-bold text-white/95"
              >
                See more about me →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* 05 · Contact */}
      <section id="contact" className="relative overflow-hidden border-t border-white/10">
        <div className="container-site relative py-24 text-center sm:py-32">
          <p className="eyebrow !text-sage">05 · Contact</p>
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
            className="pointer-events-none mx-auto mt-16 select-none font-display text-[clamp(8rem,28vw,22rem)] font-black leading-[0.7] text-white/[0.04]"
          >
            OB<span className="text-sage/10">.</span>
          </p>
        </div>
      </section>
    </div>
  );
}
