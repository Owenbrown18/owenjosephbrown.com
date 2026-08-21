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

test("studio page links through to a case study", async ({ page }) => {
  await page.goto("/obdesign");
  await page.getByRole("link", { name: "Grain Construction →" }).click();
  await expect(page).toHaveURL(/\/work\/grain-construction/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /grain construction/i,
  );
});

test("landing page reaches the studio page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /OBdesign/i }).first().click();
  await expect(page).toHaveURL(/\/obdesign/);
});
