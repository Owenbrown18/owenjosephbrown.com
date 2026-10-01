import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { caseStudyUrl, clientSites } from "@/lib/sites";

describe("the client roster", () => {
  it("has unique slugs and clean URLs", () => {
    const slugs = clientSites.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const site of clientSites) {
      // host() in the showcase strips the protocol, www and a trailing
      // slash; anything else here would print a bare path into the
      // laptop's URL bar.
      expect(site.url, site.slug).toMatch(/^https:\/\/[^/]+$/);
      expect(site.blurb.length, site.slug).toBeGreaterThan(40);
    }
  });

  it("sends each site to its own case study", () => {
    const grain = clientSites.find((s) => s.slug === "grain-construction")!;
    expect(caseStudyUrl(grain)).toBe(
      "https://www.obwebdesign.ca/work/grain-construction",
    );
    // On the Roadside's write-up is on this site: the landing page is one
    // deliverable of a project whose case study lives here (obwebdesign.ca's
    // page covers only the landing page).
    const roadside = clientSites.find((s) => s.slug === "on-the-roadside")!;
    expect(caseStudyUrl(roadside)).toBe("/work/on-the-roadside");
  });
});

/**
 * The count is claimed in four places in copy and the roster is the only
 * thing a visitor can actually count. They contradicted each other the
 * moment On the Roadside's landing page joined the list, so the number
 * is asserted against the data rather than proof-read.
 */
describe("the live client site count in copy", () => {
  const files = [
    "src/app/page.tsx",
    "src/app/obdesign/page.tsx",
    "src/lib/resume-data.ts",
  ];

  it.each(files)("%s states the roster's own count", (file) => {
    const text = readFileSync(file, "utf8").replace(/\s+/g, " ");
    const claims = [
      ...text.matchAll(/(\d+)(?: of them)? live client sites/g),
      ...text.matchAll(/"(\d+)", "live client sites"/g),
    ].map((m) => Number(m[1]));
    expect(claims.length, `no count found in ${file}`).toBeGreaterThan(0);
    for (const claim of claims) {
      expect(claim, `count in ${file}`).toBe(clientSites.length);
    }
  });
});
