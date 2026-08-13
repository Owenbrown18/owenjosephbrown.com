# owenjosephbrown.com

My personal site. Software engineering student at UVic, founder of [OBdesign](https://www.obwebdesign.ca), currently building [grain](https://owenjosephbrown.com/work/grain).

Try this before you open the browser:

```bash
curl owenjosephbrown.com
```

A middleware sniffs terminal user agents and rewrites the root to an ANSI-coloured resume. Browsers get the site; `curl` gets the point.

## What's in here

- **A live WebGL page.** The brand's forest gradient rendered as a fragment shader behind the whole landing page: value-noise fbm drifts the gradient centre, a soft light follows the pointer. DPR-clamped, 30fps-capped, paused offscreen, killed under `prefers-reduced-motion`, and it bails to a plain CSS gradient on software rasterizers.
- **One-page landing** with numbered anchor nav: expertise, work (featured projects + a marquee of nine client sites), experience, real client testimonials, contact.
- **Case studies as typed MDX.** Frontmatter validated with Zod at build time; unit tests assert every referenced image exists on disk. Code blocks via rehype-pretty-code and Shiki.
- **Dynamic OG images** per page with `next/og` on the brand card.
- **No-JS-first motion.** Scroll reveals are CSS scroll-driven animations behind `@supports`; nothing on the page depends on JavaScript to be readable.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · MDX (`next-mdx-remote-client` + gray-matter + Zod) · Vercel

No animation libraries, no UI kit, no theme machinery: one dark theme, hand-rolled shader, marquee, and prose styles; total client JS stays small.

## Running it

```bash
npm install
npm run dev
```

## Testing

```bash
npm run test        # vitest: content schema, image existence, ascii resume
npm run test:e2e    # playwright: every page, palette, theme, curl rewrite, OG, sitemap
npm run lint && npm run typecheck
```

CI runs the full suite (including e2e on Chromium and mobile WebKit) on every push.

## Structure

```
content/work/          case studies (MDX + zod-validated frontmatter)
src/app/               routes, incl. /ascii (the curl resume) and per-route OG images
src/components/        header, palette, forest canvas, marquee
src/lib/               content loader, resume data (single source for HTML + ASCII), og card
src/middleware.ts      curl/wget/httpie → /ascii rewrite
tests/                 vitest unit + playwright e2e
```

---

Design follows the OBdesign brand system: Deep Forest `#0b1f1d`, Sage `#7ba49e`, Fraunces (with the optical-size axis loaded, always) and Inter.
