/**
 * Single source of truth for resume facts.
 * Rendered by /resume (HTML + print) and /ascii (curl).
 * Every line here is traceable to a real artifact; keep it that way.
 */

export const identity = {
  name: "Owen Brown",
  title: "Software engineering student",
  location: "Victoria & Salt Spring Island, BC",
  email: "owenjosephbrown@gmail.com",
  site: "owenjosephbrown.com",
  github: "https://github.com/Owenbrown18",
  linkedin: "https://www.linkedin.com/in/owenbrown18",
  seeking:
    "Spring 2027 co-op (Jan–Apr), Victoria BC or remote",
} as const;

export type ResumeEntry = {
  org: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  link?: string;
};

export const experience: ResumeEntry[] = [
  {
    org: "OBdesign",
    role: "Founder & web developer",
    period: "June 2025 – present",
    location: "Salt Spring Island & Victoria, BC",
    link: "https://www.obwebdesign.ca",
    bullets: [
      "Designed, built and deployed more than 25 websites on Vercel, 12 of them live client sites for BC businesses (construction, bakery, spa, health clinics, accommodation), owning everything from client discovery to post-launch support",
      "Builds are custom-coded Next.js and Astro apps in TypeScript with Tailwind, wired to a git-based CMS (Keystatic) so every client edits their own content; deployed on Vercel with CI from GitHub",
      "Handle the whole operations surface: domains and DNS cutovers with zero email downtime, performance budgets (Core Web Vitals verified before handoff), SEO with structured data, analytics, and maintenance",
      "Wrote the Python pipeline that finds the clients: scraping, site analysis, email discovery, and drafting, with roughly 7% of cold emails converting to paying projects",
    ],
  },
  {
    org: "Aperture AI",
    role: "Developer (5-person startup team)",
    period: "May 2025 – December 2025",
    location: "Victoria, BC",
    bullets: [
      "Built cross-platform React Native (Expo) frontend features for an AI photography assistant on an OpenAI + Supabase backend",
      "Implemented authentication flows, asynchronous API requests, caching behaviour, and onboarding/settings UI",
    ],
  },
  {
    org: "Scholars Edge Painting",
    role: "Business operator",
    period: "December 2023 – September 2024",
    location: "Salt Spring Island & Victoria, BC",
    bullets: [
      "Built and ran a service business that generated $80,000+ in revenue: client acquisition, scheduling, hiring, and delivery",
      "Recruited, trained, and supervised a team of four across 20+ residential and commercial projects",
    ],
  },
];

export const projects: ResumeEntry[] = [
  {
    org: "On the Roadside",
    role: "Developer, client project",
    period: "August 2026 – present",
    location: "iOS + web · Capacitor + Next.js",
    link: "/work/on-the-roadside",
    bullets: [
      "Took over an AI-generated web prototype as its only engineer and made it production-ready in 76 commits, fixing a bug that signed users out on every launch and silent geocoding failures",
      "Turned it into a native iOS app with Capacitor, code signing and GitHub Actions builds, then traced three App Store rejections to their root causes and resubmitted behind automated build checks",
      "Built its production Next.js landing page (ontheroadside.ca) and shipped listing claims by emailed code and a postal-code fallback for address search",
    ],
  },
  {
    org: "Tideline",
    role: "Sole developer",
    period: "September 2026 – present",
    location: "Python · AWS Lambda + Terraform",
    link: "/work/tideline",
    bullets: [
      "Python monitoring service (FastAPI, SQLite) on AWS Lambda that checks the 11 client sites I built, twice a month, for lapsing domains and certificates, dead contact forms, broken links, DNS changes and email spoofing gaps; its first run found 8 of 11 domains missing SPF or DMARC",
      "Rebuilt it from an always-on EC2 server (Postgres, Docker) onto Lambda, EventBridge Scheduler and CloudFront to fit a USD 3 monthly budget, all in Terraform, migrating the data with every row counted; a full 86-check run takes 21 seconds",
      "376 tests with strict mypy; separate security and correctness reviews found nothing critical or high, and every medium finding was fixed with a test the same day",
    ],
  },
  {
    org: "grain",
    role: "Founder & sole developer",
    period: "January 2026 – present",
    location: "iOS · React Native + Supabase",
    link: "/work/grain",
    bullets: [
      "A shared film camera for iOS: friends join a roll, shoot blind with no preview, and nobody sees a photo until the roll is developed",
      "Postgres with deny-by-default row-level security; every game-critical write goes through security-definer RPCs (race-free joins, atomic shot-taking, creator-only develop)",
      "Custom film simulation as a multi-pass SkSL shader pipeline (grain, halation, tone curve, Kodak-style split toning) applied at capture on the GPU",
      "Persisted background upload queue decouples the shutter from the network, so shooting offline never loses a frame",
    ],
  },
  {
    org: "Lead generation pipeline",
    role: "Sole developer",
    period: "2026 – present",
    location: "Python",
    link: "/work/leadgen",
    bullets: [
      "~3,900-line Python system that runs OBdesign's client acquisition: scrapes Google Maps, analyzes prospect websites, discovers owner emails, validates leads, and drafts personalized cold emails into Gmail",
      "Instrumented end to end: suppression lists, outcome tracking, and funnel math on every send",
    ],
  },
];

export const education = {
  org: "University of Victoria",
  credential: "BSEng, Software Engineering (co-op)",
  period: "September 2023 – April 2028 (expected)",
  location: "Victoria, BC",
  detail:
    "Current term: operating systems (CSC 360), software architecture (SENG 350), security engineering (SENG 360)",
  // From the transcript, software- and systems-relevant only. Course
  // names and codes; no grades, ever — a résumé lists what was studied.
  coursework: {
    completed: [
      "CSC 110/115 · Fundamentals of Programming I & II",
      "CSC 225/226 · Algorithms & Data Structures I & II",
      "CSC 230 · Computer Architecture",
      "CSC 320 · Foundations of Computer Science",
      "CSC 370 · Database Systems",
      "SENG 265 · Software Development Methods",
      "SENG 275 · Software Testing",
      "SENG 310 · Human–Computer Interaction",
      "SENG 321 · Requirements Engineering",
      "SENG 371 · Software Evolution",
      "ECE 363 · Communication Networks",
      "STAT 260 · Probability & Statistics",
      "ENGR 112/121 · Engineering Design I & II",
      "ENGR 240 · Technical Writing",
    ],
    inProgress: [
      "CSC 360 · Operating Systems",
      "SENG 350 · Software Architecture & Design",
      "SENG 360 · Security Engineering",
      "ECE 265 · Signals & Systems",
    ],
  },
} as const;

export const skills = [
  { label: "Languages", items: "TypeScript, JavaScript, Python, Java, SQL" },
  {
    label: "Frameworks",
    items: "React, React Native (Expo), Next.js, Astro, Tailwind CSS, Node.js, FastAPI",
  },
  {
    label: "Systems",
    items:
      "AWS (Lambda, S3, CloudFront, EventBridge, IAM, SES, CloudWatch), Terraform, Docker, Supabase (Postgres, RLS, RPCs), REST APIs, Git & GitHub, Vercel, CI/CD, DNS",
  },
] as const;
