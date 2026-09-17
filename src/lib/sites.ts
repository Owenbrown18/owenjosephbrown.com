/**
 * Every client site OBdesign has shipped. Screenshots live in
 * public/images/work/<slug>.webp (regenerated from the OBdesign repo by
 * `npm run sync:client-shots`) and render through the content-hashed
 * imports in site-shots.ts. The slug matches the case study's path on
 * obwebdesign.ca. A new site needs a line in both files.
 */
export type ClientSite = {
  slug: string;
  name: string;
  blurb: string;
  url: string;
  /** Beyond Fitness has no write-up on obwebdesign.ca (ongoing care, not a build). */
  noCaseStudy?: true;
  /**
   * A write-up that lives on this site instead of obwebdesign.ca. Only On
   * the Roadside: the landing page is one deliverable of a project whose
   * case study is here, so the row points at that rather than at a
   * obwebdesign.ca page that doesn't exist.
   */
  caseStudyPath?: string;
};

/** Each site's write-up lives on obwebdesign.ca unless it says otherwise. */
export const caseStudyUrl = (site: ClientSite) =>
  site.caseStudyPath ?? `https://www.obwebdesign.ca/work/${site.slug}`;

export const clientSites: ClientSite[] = [
  {
    slug: "grain-construction",
    name: "Grain Construction",
    blurb:
      "First-ever website for a Salt Spring builder. 291 photos curated into thirteen project galleries.",
    url: "https://grainconstruction.ca",
  },
  {
    // Billed as a $0 line inside the $1,900 app project, and it is still a
    // live client site on the client's own domain: the front door the
    // printed cards and bumper stickers point at.
    slug: "on-the-roadside",
    name: "On the Roadside",
    blurb:
      "The launch site for an iOS app that maps Vancouver Island's farm stands and food trucks, built to turn a printed bumper sticker into a vendor signup.",
    url: "https://ontheroadside.ca",
    caseStudyPath: "/work/on-the-roadside",
  },
  {
    slug: "figs-and-honey",
    name: "Figs & Honey",
    blurb:
      "A hacked WordPress site replaced with nine pages of booking, shop, and journal the owner runs herself.",
    url: "https://figsandhoney.com",
  },
  {
    slug: "daves-bakery",
    name: "Daves' Bakery",
    blurb:
      "A 13-year-old WordPress site rebuilt in six days without touching the Square store the bakery runs on.",
    url: "https://davesbakery.ca",
  },
  {
    slug: "charlies-excavating",
    name: "Charlie's Excavating",
    blurb:
      "A four-page site for an excavating contractor, won by referral from a single cold email to a sister business.",
    url: "https://charliesexcavating.ca",
  },
  {
    slug: "soma-active-health",
    name: "Soma Active Health",
    blurb:
      "A multidisciplinary Victoria clinic's outdated site rebuilt into a calm, self-editable home for six therapies.",
    url: "https://www.somavictoria.ca",
  },
  {
    slug: "bayview-cottages",
    name: "Bayview Cottages",
    blurb:
      "A three-room garden B&B built to win direct bookings instead of paying the platforms' cut.",
    url: "https://www.bayviewcottagesaltspring.com",
  },
  {
    slug: "nicol-construction",
    name: "Nicol Construction",
    blurb:
      "Custom homes and renovations across Salt Spring Island, moved off Webflow onto a custom Next.js build.",
    url: "https://nicolconstruction.ca",
  },
  {
    slug: "maid-in-victoria",
    name: "Maid in Victoria",
    blurb:
      "A cleaning company's site redesigned into a modern booking experience built for trust and conversions.",
    url: "https://maidinvictoria.ca",
  },
  {
    slug: "adrienne-hughes",
    name: "Adrienne Hughes",
    blurb:
      "A gallery-quality site for a painter: originals, art prints, and upcoming shows.",
    url: "https://adriennehughes.ca",
  },
  {
    slug: "beyond-fitness",
    name: "Beyond Fitness",
    blurb:
      "Ongoing care of a gym's existing site: 34 stale pages removed behind verified redirects, conflicting SPF records merged, unique metadata for every page.",
    url: "https://www.beyondfitness.biz",
    noCaseStudy: true,
  },
  {
    slug: "suzanne-gay",
    name: "Suzanne Gay Music",
    blurb:
      "An online home for a Salt Spring pianist, vocalist, and composer spanning jazz, soul, blues, and classical.",
    url: "https://suzannegaymusic.ca",
  },
];
