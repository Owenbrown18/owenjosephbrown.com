import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

// Case studies are read off disk rather than listed by hand. The hand-written
// version silently skipped Whispr the day it was added, which is exactly the
// page a smoke test exists to catch.
const workDir = join(process.cwd(), "content/work");
const caseStudies = readdirSync(workDir)
  .filter((f) => f.endsWith(".mdx"))
  .map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const title = /^title:\s*"(.+)"$/m.exec(readFileSync(join(workDir, file), "utf8"))?.[1];
    if (!title) throw new Error(`${file} has no title in its frontmatter`);
    // Escape it: real titles contain regex metacharacters like & and '.
    return { path: `/work/${slug}`, h1: new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") };
  });

const pages = [
  { path: "/", h1: /owen brown/i },
  { path: "/obdesign", h1: /obdesign/i },
  ...caseStudies,
  { path: "/resume", h1: /owen brown/i },
];

for (const { path, h1 } of pages) {
  test(`${path} renders with no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(h1);
    expect(errors, `console errors on ${path}: ${errors.join("; ")}`).toEqual(
      [],
    );
  });
}

test("404 page renders for unknown routes", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /nothing at this address/i,
  );
});

test("OBdesign page links through to a case study", async ({ page }) => {
  await page.goto("/obdesign");
  // The OBdesign page hands off through its Explore more tiles, the same
  // block every case study ends on.
  await page
    .locator('[aria-labelledby="explore-heading"]')
    .getByRole("link", { name: /grain/i })
    .first()
    .click();
  // Navigation under a full three-browser run (and on a 2-core CI runner)
  // can outlast the 5s default; the assertion is about arriving, not speed.
  await expect(page).toHaveURL(/\/work\/grain$/, { timeout: 15000 });
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/grain/i);
});

test("every client site links to its own case study", async ({ page }) => {
  const { caseStudyUrl, clientSites } = await import("../../src/lib/sites");
  await page.goto("/obdesign");
  // The roster only: Explore more at the foot of the page links to the
  // same case studies.
  const roster = page.locator("#client-sites");
  const withStudy = clientSites.filter((s) => !s.noCaseStudy);
  const links = roster.getByRole("link", { name: /read the case study/i });
  await expect(links).toHaveCount(withStudy.length);
  for (const site of withStudy) {
    await expect(
      roster.locator(`a[href="${caseStudyUrl(site)}"]`),
      `case study link for ${site.slug}`,
    ).toHaveCount(1);
  }
  // Ten of the eleven leave for obwebdesign.ca; On the Roadside's write-up
  // is here, and pointing it at a obwebdesign.ca page that doesn't exist
  // is the mistake this half guards.
  await expect(
    roster.locator('a[href="/work/on-the-roadside"]'),
    "On the Roadside's case study link stays on this site",
  ).toHaveCount(1);
  await expect(
    roster.locator('a[href="https://www.obwebdesign.ca/work/on-the-roadside"]'),
  ).toHaveCount(0);
});

test("retired client case studies redirect to obwebdesign.ca", async ({
  request,
}) => {
  for (const slug of ["grain-construction", "figs-and-honey", "daves-bakery"]) {
    const res = await request.get(`/work/${slug}`, { maxRedirects: 0 });
    expect(res.status(), slug).toBe(308);
    expect(res.headers().location).toBe(
      `https://www.obwebdesign.ca/work/${slug}`,
    );
  }
});

test("landing page reaches the OBdesign page", async ({ page }) => {
  await page.goto("/");
  // The band's own CTA, not the nav anchor: the nav "obdesign" link stays
  // on the landing page, this one leaves it.
  await page.getByRole("link", { name: /the full story/i }).click();
  await expect(page).toHaveURL(/\/obdesign/, { timeout: 15000 });
});
