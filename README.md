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

## Environment

Nothing here is needed to run the site locally. Each variable switches on the
feature it belongs to, and the contact form is written to degrade honestly
without any of them. Copy `.env.example` to `.env.local` to fill them in.

| Variable | Public | What it does |
| --- | --- | --- |
| `RESEND_API_KEY` | no | Delivers the contact form. Without it the form tells the visitor to email directly rather than pretending to send. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | yes | Renders the Cloudflare Turnstile widget on the form. Without it no widget appears and only the honeypot guards the send. |
| `TURNSTILE_SECRET_KEY` | no | Validates the Turnstile token server side. **Adding this is what turns enforcement on.** |

The spam check fails open in two cases on purpose: no secret configured, and
Cloudflare unreachable. Losing a real co-op enquiry to an outage is worse than
one spam email, which still has to clear the honeypot. A missing or refused
token is always blocked. That policy is pinned by tests in
`tests/unit/turnstile.test.ts`.

Cloudflare publishes test keys that always pass, which is what local runs and
the checked-in tests use:

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

Swapping the secret for `2x0000000000000000000000000000000AA` makes every
token fail, which is the quickest way to see the blocked path.

After changing any of these in Vercel, redeploy: the site key is inlined into
the client bundle at build time.

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
