# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> /work/grain-construction renders with no console errors
- Location: tests/e2e/smoke.spec.ts:15:7

# Error details

```
Test timeout of 45000ms exceeded.
```

```
Error: page.goto: Test timeout of 45000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/work/grain-construction", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to content" [ref=e2]:
    - /url: "#main"
  - banner [ref=e4]:
    - generic [ref=e5]:
      - link "OB." [ref=e6]:
        - /url: /#home
      - navigation "Primary" [ref=e8]:
        - link "home" [ref=e9]:
          - /url: /#home
          - text: 01home
        - link "work" [ref=e10]:
          - /url: /#work
          - text: 03work
        - link "contact" [ref=e11]:
          - /url: /#contact
          - text: 05contact
        - link "resume" [ref=e12]:
          - /url: /resume
  - main [ref=e13]:
    - article [ref=e14]:
      - generic [ref=e15]:
        - paragraph [ref=e17]: Client build · 2026
        - heading "Grain Construction" [level=1] [ref=e18]
        - paragraph [ref=e19]: "The first-ever website for a Salt Spring Island builder: 291 photos organized into thirteen project galleries, all editable by the owners."
        - generic [ref=e20]:
          - generic [ref=e21]:
            - term [ref=e22]: Role
            - definition [ref=e23]: Design, build, deploy, DNS
          - generic [ref=e24]:
            - term [ref=e25]: Timeline
            - definition [ref=e26]: 4 weeks
          - generic [ref=e27]:
            - term [ref=e28]: Stack
            - definition [ref=e29]: Next.js · TypeScript · Tailwind · Keystatic CMS · Vercel
          - generic [ref=e30]:
            - term [ref=e31]: Live
            - definition [ref=e32]:
              - link "grainconstruction.ca ↗" [ref=e33]:
                - /url: https://grainconstruction.ca
      - img "Grain Construction website hero on desktop" [ref=e35]
      - generic [ref=e36]:
        - paragraph [ref=e37]: "Grain Construction built its reputation on Salt Spring Island the traditional way: good work, word of mouth, and an Instagram account. No website, ever. When the owners reached out, the timing had a deadline attached. They were printing stickers for the company vehicles, so the domain had to be locked in before anything else. grainconstruction.ca was still available, and it was theirs within days."
        - heading "The real problem was 300 photos" [level=2] [ref=e38]
        - paragraph [ref=e39]: "Construction clients evaluate a builder one way: they want to see finished work. Years of it existed, but as a raw photo library of over three hundred shots (resort cabins, residential builds, renovations) with no organization at all."
        - paragraph [ref=e40]: I curated that down to 291 web-ready images across thirteen distinct projects, each with its own gallery page, so a visitor can walk through a single build start to finish instead of scrolling a wall of unrelated photos.
        - paragraph [ref=e41]:
          - img "Grain Construction featured project on the homepage" [ref=e42]
        - heading "The build" [level=2] [ref=e43]
        - paragraph [ref=e44]: "A four-page Next.js site in TypeScript, deployed on Vercel, using the company's real branding: their logo, their copper-and-black palette, their fonts. Every gallery is a Keystatic collection entry, so the owners add a project, drop in photos, and reorder them without touching code."
        - paragraph [ref=e45]:
          - img "The project gallery organized by individual build" [ref=e46]
        - paragraph [ref=e47]: "Two engineering details from this one that I keep reusing:"
        - list [ref=e48]:
          - listitem [ref=e49]:
            - strong [ref=e50]: Keystatic image paths have a shape, and getting it wrong fails silently.
            - text: For collections, images store under
            - code [ref=e51]: directory/<entry-slug>/<file>
            - text: and the JSON value must include the slug segment. Seed it flat and the site renders perfectly while the CMS editor shows every image field empty. The site being green proves nothing; I now open the editor and check the collection before any delivery.
          - listitem [ref=e52]:
            - strong [ref=e53]: Honest empty states.
            - text: The testimonial section stayed hidden until real client reviews existed, rather than padding the launch with fakes. It has since earned its content.
        - paragraph [ref=e54]:
          - img "A single project gallery page with its full photo set" [ref=e55]
        - heading "The result" [level=2] [ref=e56]
        - paragraph [ref=e57]: "grainconstruction.ca went live about a month after the go-ahead: the company's first website, on a domain they own outright, matching the stickers on their trucks. The owners manage projects and photos themselves through the CMS."
        - blockquote [ref=e58]:
          - paragraph [ref=e59]: "\"The entire experience was outstanding from start to finish. The process was seamless, his communication was excellent, and the attention to detail he put into every aspect of the site was exceptional.\""
          - paragraph [ref=e60]: — Dan Smith, Grain Construction
      - navigation "More work" [ref=e61]:
        - link "← The studio" [ref=e62]:
          - /url: /obdesign
        - link "Next Figs & Honey" [ref=e63]:
          - /url: /work/figs-and-honey
          - generic [ref=e64]: Next
          - text: Figs & Honey
  - contentinfo [ref=e65]:
    - generic [ref=e66]:
      - paragraph [ref=e67]: Owen Brown.
      - navigation "Footer" [ref=e68]:
        - link "owenjosephbrown@gmail.com" [ref=e69]:
          - /url: mailto:owenjosephbrown@gmail.com
        - link "GitHub" [ref=e73]:
          - /url: https://github.com/Owenbrown18
        - link "LinkedIn" [ref=e76]:
          - /url: https://www.linkedin.com/in/owenbrown18
        - link "OBdesign." [ref=e79]:
          - /url: https://www.obwebdesign.ca
        - link "Resume" [ref=e83]:
          - /url: /resume
  - alert [ref=e84]
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | const pages = [
  4  |   { path: "/", h1: /owen brown/i },
  5  |   { path: "/obdesign", h1: /obdesign/i },
  6  |   { path: "/work/grain", h1: /^grain$/i },
  7  |   { path: "/work/leadgen", h1: /lead generation pipeline/i },
  8  |   { path: "/work/grain-construction", h1: /grain construction/i },
  9  |   { path: "/work/figs-and-honey", h1: /figs & honey/i },
  10 |   { path: "/work/daves-bakery", h1: /daves' bakery/i },
  11 |   { path: "/resume", h1: /owen brown/i },
  12 | ];
  13 | 
  14 | for (const { path, h1 } of pages) {
  15 |   test(`${path} renders with no console errors`, async ({ page }) => {
  16 |     const errors: string[] = [];
  17 |     page.on("console", (msg) => {
  18 |       if (msg.type() === "error") errors.push(msg.text());
  19 |     });
  20 |     page.on("pageerror", (err) => errors.push(err.message));
  21 | 
> 22 |     const response = await page.goto(path);
     |                                 ^ Error: page.goto: Test timeout of 45000ms exceeded.
  23 |     expect(response?.status()).toBe(200);
  24 |     await expect(page.getByRole("heading", { level: 1 })).toContainText(h1);
  25 |     expect(errors, `console errors on ${path}: ${errors.join("; ")}`).toEqual(
  26 |       [],
  27 |     );
  28 |   });
  29 | }
  30 | 
  31 | test("404 page renders for unknown routes", async ({ page }) => {
  32 |   const response = await page.goto("/no-such-page");
  33 |   expect(response?.status()).toBe(404);
  34 |   await expect(page.getByRole("heading", { level: 1 })).toContainText(
  35 |     /nothing at this address/i,
  36 |   );
  37 | });
  38 | 
  39 | test("studio page links through to a case study", async ({ page }) => {
  40 |   await page.goto("/obdesign");
  41 |   await page.getByRole("link", { name: "Grain Construction →" }).click();
  42 |   await expect(page).toHaveURL(/\/work\/grain-construction/);
  43 |   await expect(page.getByRole("heading", { level: 1 })).toContainText(
  44 |     /grain construction/i,
  45 |   );
  46 | });
  47 | 
  48 | test("landing page reaches the studio page", async ({ page }) => {
  49 |   await page.goto("/");
  50 |   await page.getByRole("link", { name: /view the studio/i }).click();
  51 |   await expect(page).toHaveURL(/\/obdesign/);
  52 | });
  53 | 
```