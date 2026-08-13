/**
 * Every client site OBdesign has shipped. Screenshots live in
 * public/images/work/<slug>.png (exported from the studio repo).
 */
export type ClientSite = {
  slug: string;
  name: string;
  blurb: string;
  url: string;
  caseStudy?: string;
};

export const clientSites: ClientSite[] = [
  {
    slug: "grain-construction",
    name: "Grain Construction",
    blurb:
      "First-ever website for a Salt Spring builder. 291 photos curated into thirteen project galleries.",
    url: "https://grainconstruction.ca",
    caseStudy: "/work/grain-construction",
  },
  {
    slug: "figs-and-honey",
    name: "Figs & Honey",
    blurb:
      "A hacked WordPress site replaced with nine pages of booking, shop, and journal the owner runs herself.",
    url: "https://figsandhoney.com",
    caseStudy: "/work/figs-and-honey",
  },
  {
    slug: "daves-bakery",
    name: "Daves' Bakery",
    blurb:
      "A 13-year-old WordPress site rebuilt in six days without touching the Square store the bakery runs on.",
    url: "https://davesbakery.ca",
    caseStudy: "/work/daves-bakery",
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
    slug: "suzanne-gay",
    name: "Suzanne Gay Music",
    blurb:
      "An online home for a Salt Spring pianist, vocalist, and composer spanning jazz, soul, blues, and classical.",
    url: "https://suzannegaymusic.ca",
  },
];
