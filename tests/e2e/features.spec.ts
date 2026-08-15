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
  await expect(page.getByRole("heading", { name: /^grain$/i })).toBeVisible();
});

test("resume page carries identity and a route to the document", async ({
  page,
}) => {
  await page.goto("/resume");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /owen brown/i,
  );
  // The co-op ask has to survive on the page itself, not only inside the
  // PDF, since nothing in the embed is crawlable or readable by a screen
  // reader.
  await expect(page.getByText(/Spring 2027 co-op/i).first()).toBeVisible();
  // The PDF itself is invisible to crawlers and screen readers, so the
  // page has to carry a real route to the document in HTML.
  await expect(page.getByRole("link", { name: /download/i })).toBeVisible();
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("hamburger exposes every section, and closes properly", async ({
    page,
  }) => {
    await page.goto("/");
    const sheet = page.locator("#mobile-nav");
    await expect(sheet).toBeHidden();

    await page.getByRole("button", { name: /open menu/i }).click();
    await expect(sheet).toBeVisible();

    // All five sections must be reachable — the old rail silently dropped
    // Expertise and About on narrow screens.
    for (const label of ["home", "expertise", "work", "about", "contact"]) {
      await expect(sheet.getByRole("link", { name: label })).toBeVisible();
    }

    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
  });

  test("scroll cue and progress bar stay off small screens", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator(".scroll-cue")).toBeHidden();
    await expect(page.locator(".scroll-progress")).toBeHidden();
  });
});

test("desktop shows the full nav rail and no hamburger", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  // The toggle's display lives in CSS; an unlayered rule once beat
  // Tailwind's sm:hidden and left a hamburger sitting on the desktop bar.
  await expect(page.locator(".menu-toggle")).toBeHidden();
  const rail = page.getByRole("navigation", { name: "Primary" }).first();
  for (const label of ["home", "expertise", "work", "about", "contact"]) {
    await expect(rail.getByRole("link", { name: label })).toBeVisible();
  }
});

test("every section heading takes part in the reveal system", async ({
  page,
}) => {
  // Headings were previously tagged by hand with class-string matches, so
  // "Let's talk" and others were silently missed. The selector is
  // structural now; this stops it drifting again.
  for (const path of ["/", "/obdesign", "/work/grain"]) {
    await page.goto(path);
    await page.waitForTimeout(400);
    const untagged = await page.evaluate(() =>
      [...document.querySelectorAll("main h2, main h3")]
        .filter((h) => !h.closest(".hero-stage"))
        .filter(
          (h) =>
            !h.classList.contains("reveal-init") &&
            !(h as HTMLElement).dataset.revealed,
        )
        .map((h) => h.textContent?.trim().slice(0, 30)),
    );
    expect(untagged, `untagged headings on ${path}`).toEqual([]);
  }
});

test("no content is left invisible after scrolling a case study", async ({
  page,
}) => {
  await page.goto("/work/figs-and-honey");
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= height; y += 600) {
    await page.evaluate((n) => window.scrollTo(0, n), y);
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(700);
  const stuck = await page.evaluate(
    () => document.querySelectorAll(".reveal-init:not(.is-revealed)").length,
  );
  expect(stuck).toBe(0);
});
