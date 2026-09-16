import { expect, test, type Page } from "@playwright/test";
import sharp from "sharp";

/**
 * networkidle is the wrong readiness signal on a slow runner: the landing
 * page streams a dozen images and a video, and one trickling connection
 * holds the 500ms-of-silence clock past the test timeout. What the tests
 * actually need is hydration — the Reveal system arming is the proof.
 */
async function gotoReady(page: Page, path: string) {
  await page.goto(path, { waitUntil: "load" });
  await expect
    .poll(() => page.locator(".reveal-init").count(), { timeout: 15000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(250);
}

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
    .getByRole("link", { name: /r[ée]sum[ée]/i })
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

test("OG images render at full size on every card", async ({ request }) => {
  // A broken card still answers 200 with a PNG, so check the pixels are
  // really there: correct dimensions and a plausible payload. The obdesign
  // card is listed because it is the one that swaps in Fraunces for the
  // wordmark, which is its own font-loading path.
  for (const path of [
    "/opengraph-image",
    "/work/grain/opengraph-image",
    "/obdesign/opengraph-image",
  ]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");

    const png = await res.body();
    // IHDR carries width and height as big-endian uint32s at bytes 16-23.
    expect(png.readUInt32BE(16), `${path} width`).toBe(1200);
    expect(png.readUInt32BE(20), `${path} height`).toBe(630);
    expect(png.byteLength, `${path} is not a blank card`).toBeGreaterThan(
      20_000,
    );
  }
});

test("the home card really carries the three device screens", async ({
  request,
}) => {
  // The card composes screenshots into laptop and phone frames. If an
  // image fails to decode, Satori still returns a perfectly valid 1200x630
  // PNG with blank frames, which the size check above would pass. So look
  // at the pixels: each screen region must have real detail in it, where
  // untouched paper is essentially flat.
  const res = await request.get("/opengraph-image");
  const png = await res.body();

  const regions = {
    grain: { left: 700, top: 140, width: 400, height: 200 },
    figs: { left: 880, top: 310, width: 300, height: 200 },
    phone: { left: 616, top: 320, width: 124, height: 200 },
  };

  for (const [name, box] of Object.entries(regions)) {
    const crop = await sharp(png).extract(box).removeAlpha().png().toBuffer();
    // stats() reports on its input, so the crop has to be materialised
    // before measuring it.
    const { channels } = await sharp(crop).stats();
    const spread = Math.max(...channels.map((c) => c.stdev));
    expect(spread, `${name} screen is blank`).toBeGreaterThan(15);
  }

  // The control: bare paper beside the wordmark, which must stay flat.
  const paper = await sharp(png)
    .extract({ left: 72, top: 20, width: 300, height: 40 })
    .removeAlpha()
    .png()
    .toBuffer();
  const { channels: flat } = await sharp(paper).stats();
  expect(Math.max(...flat.map((c) => c.stdev))).toBeLessThan(5);
});

test("sitemap lists every case study", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  const xml = await res.text();
  for (const slug of [
    "grain",
    "leadgen",
    "whispr",
    "on-the-roadside",
  ]) {
    expect(xml).toContain(`/work/${slug}`);
  }
});

test("reduced motion still shows all home content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
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
  // The résumé is real HTML now, not an embed: experience entries must be
  // in the DOM, and the PDF is a secondary link that opens in a new tab.
  expect(await page.locator("article").count()).toBeGreaterThanOrEqual(4);
  const pdf = page.getByRole("link", { name: /pdf/i }).first();
  await expect(pdf).toBeVisible();
  await expect(pdf).toHaveAttribute("target", "_blank");
  // Coursework comes from the transcript as names and codes — never grades.
  await expect(page.getByText(/relevant coursework/i)).toBeVisible();
  // Coursework and skills chips live in the rail, not inside the entries.
  expect(
    await page.locator("main .chip").count(),
    "coursework chips",
  ).toBeGreaterThanOrEqual(12);
  // No chip carries a percentage or a trailing letter grade.
  const graded = await page.evaluate(() =>
    [...document.querySelectorAll("main .chip")]
      .map((c) => c.textContent?.trim() ?? "")
      .filter((t) => /%/.test(t) || /\s[A-F][+-]?$/.test(t)),
  );
  expect(graded, "coursework chips never carry grades").toEqual([]);
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

    // Every section must be reachable — the old rail silently dropped
    // sections on narrow screens.
    for (const label of ["home", "work", "about", "contact"]) {
      await expect(sheet.getByRole("link", { name: label })).toBeVisible();
    }

    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
  });

  test("the sheet opens and closes on a real transition, not a snap", async ({
    page,
  }) => {
    // It used to be `hidden={!open}`, which cannot animate at all. The
    // contract is: mounted while closed (so there is something to
    // animate), inert while closed (so `hidden`'s accessibility work
    // isn't lost), and a non-zero transition on the row that grows.
    await page.goto("/");
    const sheet = page.locator("#mobile-nav");

    const closed = await sheet.evaluate((el) => ({
      rows: getComputedStyle(el).gridTemplateRows,
      inert: el.hasAttribute("inert"),
      duration: getComputedStyle(el).transitionDuration,
    }));
    expect(closed.inert, "a closed sheet stays out of the tab order").toBe(true);
    expect(
      closed.duration.split(",").some((d) => parseFloat(d) > 0),
      "the sheet declares a transition",
    ).toBe(true);

    // A closed sheet must not be reachable by keyboard.
    const reachable = await page.evaluate(() => {
      const a = document.querySelector<HTMLAnchorElement>("#mobile-nav a");
      a?.focus();
      return document.activeElement === a;
    });
    expect(reachable, "closed sheet links cannot take focus").toBe(false);

    await page.getByRole("button", { name: /open menu/i }).click();
    await expect(sheet).toBeVisible();

    // Poll for the end of the transition instead of reading straight after
    // the click. Being visible only means the sheet started opening, and a
    // loaded CI worker can be sampled before the row has left 0px, which
    // made this fail against a perfectly good animation.
    await expect
      .poll(
        async () =>
          Math.round(
            await sheet.evaluate((el) => el.getBoundingClientRect().height),
          ),
        { message: "the sheet grows to its content" },
      )
      .toBeGreaterThan(100);

    const open = await sheet.evaluate((el) => ({
      rows: getComputedStyle(el).gridTemplateRows,
      inert: el.hasAttribute("inert"),
    }));
    expect(open.inert, "an open sheet is interactive").toBe(false);
    expect(open.rows, "the animated row actually changes").not.toBe(closed.rows);
  });

  test("the desktop nav rail stays off small screens", async ({ page }) => {
    await page.goto("/");
    // The rail is the desktop progress indicator; on a phone the hamburger
    // is the whole nav, and the header is free to hide on scroll.
    await expect(page.locator("[data-nav-section]").first()).toBeHidden();
  });
});

test("desktop shows the full nav rail and no hamburger", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  // The toggle's display lives in CSS; an unlayered rule once beat
  // Tailwind's sm:hidden and left a hamburger sitting on the desktop bar.
  await expect(page.locator(".menu-toggle")).toBeHidden();
  const rail = page.getByRole("navigation", { name: "Primary" }).first();
  for (const label of ["home", "work", "about", "contact"]) {
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
    // gotoReady, not a fixed wait: arming happens on the frame after
    // hydration, and CI WebKit hydrates slower than any sleep guesses.
    await gotoReady(page, path);
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

// This test MUST assert computed opacity, not class bookkeeping. The
// specificity bug (prose hidden at (0,2,1) beating .reveal-init.is-revealed
// at (0,2,0)) shipped whole case studies as headings with no text while a
// class-based version of this test stayed green: every element had
// .is-revealed and still painted at opacity 0.
for (const path of ["/work/on-the-roadside", "/work/grain"]) {
  test(`no content is left invisible after scrolling ${path}`, async ({
    page,
  }) => {
    await gotoReady(page, path);
    const height = await page.evaluate(() => document.body.scrollHeight);
    const ghosts: string[] = [];
    for (let y = 0; y <= height; y += 600) {
      await page.evaluate(
        (n) => window.scrollTo({ top: n, behavior: "instant" }),
        y,
      );
      // Poll rather than sleep: the transition is 0.55s on a Mac and far
      // slower on a throttled CI runner, but "settled" means the same
      // thing everywhere — no in-view element still below full opacity.
      const deadline = Date.now() + 4000;
      let invisible: string[] = [];
      do {
        invisible = await page.evaluate(() =>
          // Armed elements, cascade children and cascaded words alike: any
          // of them still faint in view after settling is invisible text.
          [...document.querySelectorAll<HTMLElement>(".reveal-init, .cascade > *, .words .w, .words-enter .w")]
            .filter((el) => {
              const r = el.getBoundingClientRect();
              return r.top < innerHeight * 0.85 && r.bottom > 0 && r.height > 0;
            })
            .filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.9)
            .map((el) => (el.tagName + "." + el.className).slice(0, 70)),
        );
        if (!invisible.length) break;
        await page.waitForTimeout(200);
      } while (Date.now() < deadline);
      ghosts.push(...invisible.map((g) => `y=${y} ${g}`));
    }
    expect(ghosts, "in-viewport elements painted invisible").toEqual([]);
    const stuck = await page.evaluate(
      () => document.querySelectorAll(".reveal-init:not(.is-revealed)").length,
    );
    expect(stuck).toBe(0);
  });
}

// --- Scroll-linked motion (ScrollMotion) -------------------------------
// These systems used CSS scroll timelines, which pass headless testing
// but sit dead in real Safari. They are JS-driven now; these tests pin
// the behavior in every engine we run.

test("the nav rail fills section by section as you scroll", async ({
  page,
}) => {
  // The rail replaced the separate progress hairline: each anchor's rule
  // fills across its own section, so together they are the progress bar.
  await gotoReady(page, "/");
  const fills = () =>
    page.evaluate(() =>
      [...document.querySelectorAll("[data-nav-section]")].map((a) => ({
        section: (a as HTMLElement).dataset.navSection,
        x: new DOMMatrix(
          getComputedStyle(a.querySelector(".nav-rail-fill")!).transform,
        ).a,
      })),
    );

  const atTop = await fills();
  expect(atTop.length, "one rail per anchor").toBe(4);
  expect(atTop.at(-1)!.x, "last section empty at the top").toBeLessThan(0.05);

  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await expect
    .poll(async () => Math.min(...(await fills()).map((r) => r.x)), {
      timeout: 5000,
    })
    .toBeGreaterThan(0.9);
});

test("the header stays visible on desktop so the rail is readable", async ({
  page,
}) => {
  await gotoReady(page, "/");
  await page.evaluate(() => window.scrollTo({ top: 2000, behavior: "instant" }));
  await page.waitForTimeout(400);
  const onScreen = await page.evaluate(() => {
    const h = document.querySelector("header")!;
    return h.getBoundingClientRect().bottom > 0;
  });
  expect(onScreen).toBe(true);
});

test("section rules draw in on arrival, stay put once drawn", async ({
  page,
}) => {
  // networkidle: while images are still streaming in, layout can briefly
  // place a distant rule inside the viewport and legitimately reveal it.
  await gotoReady(page, "/");
  const lastLine = () =>
    page.evaluate(() => {
      const rule = [...document.querySelectorAll(".section-rule")].at(-1)!;
      const line = rule.querySelector(".section-rule-line")!;
      return {
        armed: rule.classList.contains("reveal-init"),
        revealed: rule.classList.contains("is-revealed"),
        scaleX: new DOMMatrix(getComputedStyle(line).transform).a,
        // Diagnostics, so a failure explains itself: where the rule sat,
        // where the page was, and how tall the document was.
        top: Math.round(rule.getBoundingClientRect().top),
        scrollY: Math.round(window.scrollY),
        docH: document.documentElement.scrollHeight,
        vh: window.innerHeight,
      };
    });
  const before = await lastLine();
  expect(before.armed, "rule container joins the reveal system").toBe(true);
  // WebKit reports the collapsed matrix as ~4e-6 rather than exactly 0.
  expect(
    before.scaleX,
    `line starts collapsed while offscreen: ${JSON.stringify(before)}`,
  ).toBeLessThan(0.01);
  await page.evaluate(() =>
    [...document.querySelectorAll(".section-rule")]
      .at(-1)!
      .scrollIntoView({ behavior: "instant", block: "center" }),
  );
  await expect
    .poll(async () => (await lastLine()).scaleX, { timeout: 6000 })
    .toBeGreaterThan(0.99);
});

test("hero drifts across the first viewport of scroll, and does not fade", async ({
  page,
}) => {
  await gotoReady(page, "/");
  const hero = () =>
    page.evaluate(() => {
      const el = document.querySelector<HTMLElement>(".hero-parallax")!;
      const s = getComputedStyle(el);
      return {
        opacity: parseFloat(s.opacity),
        y: new DOMMatrix(s.transform).f,
      };
    });
  const top = await hero();
  expect(top.opacity).toBeGreaterThan(0.9);
  await page.evaluate(() =>
    window.scrollTo({ top: window.innerHeight * 1.2, behavior: "instant" }),
  );
  // Parallax only: the copy drifts up (Owen's call — no fade on the hero,
  // same as the device cluster). Poll for the eased drift to land.
  await expect
    .poll(async () => (await hero()).y, { timeout: 5000 })
    .toBeLessThan(top.y - 20);
  const drifted = await hero();
  expect(drifted.opacity, "hero never fades").toBeGreaterThan(0.95);
});

test("lifted headings ride the scroll", async ({ page }) => {
  await gotoReady(page, "/");
  const sampleNear = async (selector: string, offset: number) => {
    return page.evaluate(
      ([sel, off]) => {
        const el = document.querySelector<HTMLElement>(sel as string)!;
        const target =
          el.getBoundingClientRect().top +
          window.scrollY -
          window.innerHeight +
          (off as number);
        window.scrollTo({ top: Math.max(0, target), behavior: "instant" });
        return new Promise<number>((resolve) =>
          setTimeout(
            () => resolve(new DOMMatrix(getComputedStyle(el).transform).f),
            150,
          ),
        );
      },
      [selector, offset] as const,
    );
  };
  // Only selectors the landing page actually uses. .parallax-a went with
  // the bespoke image blocks, and .parallax-b went with the watermark
  // numerals; .lift is the last scroll-scrubbed thing on this page.
  for (const sel of [".lift"]) {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    const early = await sampleNear(sel, 150);
    // Poll: the eased value needs several frames to diverge, and CI
    // WebKit delivers frames slowly.
    await expect
      .poll(async () => sampleNear(sel, 620), { timeout: 5000 })
      .not.toEqual(early);
  }
});

test("every stage piece finishes its entrance visible", async ({ page }) => {
  // The stage art sits under the pixel-dissolve grid. The ghost sweep
  // only checks .reveal-init elements themselves, so a broken dissolve
  // would strand the artwork covered while every other test stayed
  // green. Check the images themselves are painted.
  await gotoReady(page, "/");
  const count = await page.locator(".project-frame img").count();
  expect(count, "stages carry art").toBeGreaterThanOrEqual(10);
  await page.evaluate(() =>
    document.getElementById("work")!.scrollIntoView({ behavior: "instant" }),
  );
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollBy({ top: 900, behavior: "instant" }));
  // Poll: the stagger is 0.27s + 0.7s ease on a Mac, slower on CI.
  await expect
    .poll(
      async () =>
        page.evaluate(() =>
          [...document.querySelectorAll<HTMLElement>(".project-frame img")]
            .filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.9)
            .map(
              (el) => (el.getAttribute("src") || "").slice(0, 40),
            ),
        ),
      { timeout: 6000 },
    )
    .toEqual([]);
});

test("contact form is present, labelled, and honeypotted", async ({
  page,
}) => {
  await gotoReady(page, "/");
  await page.evaluate(() =>
    document.getElementById("contact")!.scrollIntoView({ behavior: "instant" }),
  );
  for (const name of ["name", "email", "message"]) {
    await expect(page.locator(`[name="${name}"]`)).toBeVisible();
  }
  await expect(page.locator('select[name="topic"]')).toBeVisible();
  // The honeypot must exist for bots and be invisible to people.
  const trap = page.locator('input[name="company"]');
  await expect(trap).toHaveCount(1);
  await expect(trap).not.toBeInViewport();
  await expect(page.getByRole("button", { name: /send it/i })).toBeVisible();
});

test("footer indexes every project page", async ({ page }) => {
  await gotoReady(page, "/");
  const footer = page.locator("footer");
  for (const label of ["Pages", "Elsewhere", "Work"]) {
    await expect(footer.locator(`nav[aria-label="${label}"]`)).toBeVisible();
  }
  // Derived the same way the footer derives it, so this can't go stale.
  const { readdirSync } = await import("node:fs");
  const entries = readdirSync("content/work").filter((f) => f.endsWith(".mdx"));
  for (const f of entries) {
    const slug = f.replace(/\.mdx$/, "");
    await expect(
      footer.locator(`a[href="/work/${slug}"]`),
      `footer links ${slug}`,
    ).toHaveCount(1);
  }
});


// Reveals must play where the eye is. Earlier the trigger fired 12% before
// an element entered the viewport, so a 0.3s reveal had finished by the time
// it was visible — every "is it visible eventually" test stayed green while
// the motion itself was never seen. This pins the trigger to in-view.
test("reveals wait until their element is actually in view", async ({
  page,
}) => {
  await gotoReady(page, "/resume");
  // Nothing below the fold is revealed on a fresh load at the top.
  const early = await page.evaluate(() =>
    [...document.querySelectorAll(".reveal-init.is-revealed")].filter(
      (e) => e.getBoundingClientRect().top > innerHeight,
    ).length,
  );
  expect(early, "below-fold elements revealed at load").toBe(0);

  // Park an entry just below the viewport: still not revealed.
  const parked = await page.evaluate(() => {
    const el = [...document.querySelectorAll<HTMLElement>(".resume-entry")].find(
      (e) => e.getBoundingClientRect().top > innerHeight,
    )!;
    const target = el.getBoundingClientRect().top + scrollY - innerHeight - 40;
    window.scrollTo({ top: target, behavior: "instant" });
    return el.className.includes("is-revealed");
  });
  await page.waitForTimeout(500);
  expect(parked).toBe(false);

  // Bring it 15% into view: now it reveals.
  await page.evaluate(() => window.scrollBy({ top: innerHeight * 0.15 + 40, behavior: "instant" }));
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const els = [...document.querySelectorAll<HTMLElement>(".resume-entry")];
          const inView = els.find((e) => {
            const r = e.getBoundingClientRect();
            return r.top < innerHeight * 0.9 && r.bottom > 0;
          });
          return inView?.classList.contains("is-revealed") ?? null;
        }),
      { timeout: 4000 },
    )
    .toBe(true);
});

test("a lazy image reveals only once it has loaded", async ({ page }) => {
  await gotoReady(page, "/");
  await page.evaluate(() =>
    document.getElementById("about")!.scrollIntoView({ behavior: "instant" }),
  );
  // When the reveal lands, the image must already be complete: the pop
  // plays on the picture, not on an empty box that snaps in later.
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const img = document.querySelector<HTMLImageElement>("#about img.anim-image")!;
          return img.classList.contains("is-revealed") ? img.complete : null;
        }),
      { timeout: 8000 },
    )
    .toBe(true);
});


test("word cascades land every word", async ({ page }) => {
  // Paragraphs cascade word by word; a stuck word is invisible text, so
  // assert every word reaches full opacity once its paragraph reveals.
  await gotoReady(page, "/");
  await page.evaluate(() =>
    document.getElementById("about")!.scrollIntoView({ behavior: "instant" }),
  );
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const p = document.querySelector<HTMLElement>("#about p.words")!;
          if (!p.classList.contains("is-revealed")) return null;
          const ws = [...p.querySelectorAll<HTMLElement>(".w")];
          return ws.length > 10 && ws.every((w) => parseFloat(getComputedStyle(w).opacity) > 0.95);
        }),
      { timeout: 8000 },
    )
    .toBe(true);
  // The hero pitch cascades on load too.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  expect(await page.locator(".hero-stage p.words-enter .w").count()).toBeGreaterThan(10);
});


test("case studies share one animated masthead and cascade their pieces", async ({
  page,
}) => {
  await gotoReady(page, "/work/leadgen");
  const head = await page.evaluate(() => ({
    eyebrowEnter: document.querySelector("header .eyebrow")?.classList.contains("enter"),
    titleEnter: document.querySelector("header h1")?.classList.contains("enter"),
    summaryWords: document.querySelectorAll("header .words-enter .w").length,
    metaEnter: document.querySelector("header dl")?.classList.contains("enter"),
    sheetStill: !!document.querySelector(".sheet.sheet-still"),
  }));
  expect(head).toEqual({ eyebrowEnter: true, titleEnter: true, summaryWords: expect.any(Number), metaEnter: true, sheetStill: true });
  expect(head.summaryWords).toBeGreaterThan(5);
  // Pipeline steps carry cascade indices assigned by Reveal.
  const steps = await page.evaluate(() =>
    [...document.querySelectorAll(".pipeline.cascade > *")].map((li) => (li as HTMLElement).style.getPropertyValue("--i")),
  );
  expect(steps.length).toBeGreaterThan(2);
  expect(steps).toEqual(steps.map((_, i) => String(i)));
});


test("a client-side hop into a case study reveals nothing early", async ({
  page,
}) => {
  // The bug: the new route armed while the document still sat at the
  // landing page's scroll offset, revealing whatever was "in view" there,
  // and only then scrolled to the top — so below-fold content was already
  // done by the time the reader reached it. Direct loads never showed it.
  await gotoReady(page, "/");
  await page.evaluate(() =>
    document.getElementById("work")!.scrollIntoView({ behavior: "instant" }),
  );
  await page.waitForTimeout(600);
  await page.locator(".project-card").nth(1).click();
  await page.waitForURL(/\/work\//, { timeout: 10000 });
  await expect
    .poll(() => page.locator(".reveal-init").count(), { timeout: 10000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(1200);
  const state = await page.evaluate(() => ({
    scrollY: Math.round(scrollY),
    belowFoldRevealed: [...document.querySelectorAll(".reveal-init.is-revealed")].filter(
      (e) => e.getBoundingClientRect().top > innerHeight,
    ).length,
  }));
  expect(state.scrollY, "landed at the top").toBe(0);
  expect(state.belowFoldRevealed, "below-fold elements revealed early").toBe(0);
});

test.describe("contact form", () => {
  // Deliberately no happy-path submit here. A valid submission with
  // RESEND_API_KEY present would put a real email in Owen's inbox on every
  // run, so the send path is covered by tests/unit/contact-action.test.ts
  // with the mail client stubbed. These check what only a browser can.

  test("renders every field, with the honeypot hidden from people", async ({
    page,
  }) => {
    await gotoReady(page, "/");
    const form = page.locator("#contact form");

    for (const name of ["name", "email", "topic", "message"]) {
      await expect(form.locator(`[name="${name}"]`)).toBeVisible();
    }

    // The honeypot has to be in the DOM and out of everyone's way: parked
    // off screen for sighted users, untabbable, and never announced. It is
    // deliberately NOT display:none — a bot that skips hidden fields is a
    // bot this doesn't catch — so "hidden" here means off the canvas.
    const pot = form.locator('[name="company"]');
    await expect(pot).toHaveAttribute("tabindex", "-1");
    await expect(form.locator('[aria-hidden="true"] [name="company"]')).toHaveCount(1);
    const box = await pot.boundingBox();
    expect(box, "the honeypot should still be laid out").not.toBeNull();
    expect(box!.x + box!.width).toBeLessThan(0);
  });

  test("without Turnstile configured the form stays usable", async ({ page }) => {
    // The default build ships no site key, and the form must not be held
    // hostage by a spam check that was never set up.
    await gotoReady(page, "/");
    const widget = page.getByTestId("turnstile");
    const send = page.locator("#contact").getByRole("button", { name: /send it/i });

    if ((await widget.count()) === 0) {
      await expect(send).toBeEnabled();
      return;
    }

    // Configured: the token has to land before the button opens up, or the
    // submit would bounce off the server check.
    await expect(page.locator('input[name="cf-turnstile-response"]')).toHaveValue(
      /.+/,
      { timeout: 20_000 },
    );
    await expect(send).toBeEnabled();
  });

  test("the spam check never loads on arrival, only on approach", async ({
    page,
  }) => {
    // The form is at the foot of the landing page. Pulling Cloudflare's
    // script at load would tax every visit for a section most people never
    // reach, and it would land in the Lighthouse budget.
    const requests: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("challenges.cloudflare.com")) requests.push(r.url());
    });

    await gotoReady(page, "/");
    expect(requests).toHaveLength(0);
  });
});
