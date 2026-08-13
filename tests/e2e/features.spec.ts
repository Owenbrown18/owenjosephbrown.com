import { expect, test } from "@playwright/test";

test("numbered anchor nav scrolls to sections", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: /contact/i })
    .click();
  await expect(page).toHaveURL(/#contact/);
  await expect(
    page.getByRole("heading", { name: /let.s talk/i }),
  ).toBeInViewport();
});

test("resume link in the nav reaches the resume page", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: /resume/i })
    .click();
  await expect(page).toHaveURL(/\/resume/);
});

test("curl user agent gets the ANSI resume at the root", async ({
  request,
}) => {
  const res = await request.get("/", {
    headers: { "user-agent": "curl/8.6.0" },
  });
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("text/plain");
  const body = await res.text();
  expect(body).toContain("Seeking:");
  expect(body).toContain("owenjosephbrown");
});

test("browser user agent gets HTML at the root", async ({ request }) => {
  const res = await request.get("/", {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
  });
  expect(res.headers()["content-type"]).toContain("text/html");
});

test("/ascii?plain has no escape codes", async ({ request }) => {
  const res = await request.get("/ascii?plain");
  const body = await res.text();
  expect(body).not.toContain("\x1b");
});

test("OG images render", async ({ request }) => {
  for (const path of ["/opengraph-image", "/work/grain/opengraph-image"]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
  }
});

test("sitemap lists every case study", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  const xml = await res.text();
  for (const slug of [
    "grain",
    "leadgen",
    "grain-construction",
    "figs-and-honey",
    "daves-bakery",
  ]) {
    expect(xml).toContain(`/work/${slug}`);
  }
});

test("reduced motion still shows all home content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /my expertise/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("group", { name: /client websites/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /where i.ve worked/i }),
  ).toBeVisible();
});

test("resume page carries the real facts", async ({ page }) => {
  await page.goto("/resume");
  await expect(page.getByText("University of Victoria")).toBeVisible();
  await expect(page.getByText(/Spring 2027 co-op/i).first()).toBeVisible();
  await expect(page.getByText("OBdesign").first()).toBeVisible();
});
