import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", h1: /owen brown/i },
  { path: "/obdesign", h1: /obdesign/i },
  { path: "/work/grain", h1: /^grain$/i },
  { path: "/work/leadgen", h1: /lead generation pipeline/i },
  { path: "/work/grain-construction", h1: /grain construction/i },
  { path: "/work/figs-and-honey", h1: /figs & honey/i },
  { path: "/work/daves-bakery", h1: /daves' bakery/i },
  { path: "/about", h1: /shipping/i },
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
  await page.getByRole("link", { name: /view the studio/i }).click();
  await expect(page).toHaveURL(/\/obdesign/);
});
