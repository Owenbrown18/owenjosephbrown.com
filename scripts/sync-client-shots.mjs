/**
 * Regenerates the client-site screenshots in public/images/work/ from the
 * OBdesign site's own project assets, which are the ones Owen keeps
 * current. Exists because the copies here drifted: Nicol Construction was
 * rebuilt, obwebdesign.ca got the new screenshot on Sep 1, and this site
 * kept showing the old build for two weeks.
 *
 *   npm run sync:client-shots
 *   OBDESIGN_SITE=/path/to/obdesign-site npm run sync:client-shots
 *
 * Every slug in src/lib/sites.ts must have a matching <slug>.png in the
 * OBdesign repo, or an entry in LIVE below; a missing one fails the run
 * rather than leaving a stale file quietly in place.
 */
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";

/**
 * Sites with no page on obwebdesign.ca, so no screenshot in its repo
 * either. Captured from the live site instead, which keeps one command
 * for the whole roster rather than an orphan asset filed in a repo that
 * doesn't use it.
 */
const LIVE = { "on-the-roadside": "https://ontheroadside.ca" };

const SOURCE = join(
  process.env.OBDESIGN_SITE ??
    join(homedir(), "OBDesign/Systems/website/obdesign-site"),
  "src/assets/images/projects",
);
const OUT = join(process.cwd(), "public/images/work");

if (!existsSync(SOURCE)) {
  console.error(`No OBdesign project assets at ${SOURCE}.`);
  console.error("Set OBDESIGN_SITE to the obdesign-site repo and rerun.");
  process.exit(1);
}

// Read the slugs straight out of sites.ts so the list can't drift either.
const slugs = [
  ...readFileSync("src/lib/sites.ts", "utf8").matchAll(/slug:\s*"([a-z0-9-]+)"/g),
].map((m) => m[1]);

const missing = slugs.filter(
  (s) => !LIVE[s] && !existsSync(join(SOURCE, `${s}.png`)),
);
if (missing.length) {
  console.error(`Missing in the OBdesign repo: ${missing.join(", ")}`);
  process.exit(1);
}

/**
 * One 1600x1000 viewport at 2x, with motion reduced so an entrance
 * animation is captured at its resting state rather than mid-flight.
 */
async function capture(url) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: 1600, height: 1000 },
      deviceScaleFactor: 2,
      reducedMotion: "reduce",
    });
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    return await page.screenshot();
  } finally {
    await browser.close();
  }
}

for (const slug of slugs) {
  // 1600x1000 from the top: the laptop frames show a 16:10 viewport, and
  // a desktop capture's first screen is the part that reads at that size.
  const source = LIVE[slug]
    ? await capture(LIVE[slug])
    : join(SOURCE, `${slug}.png`);
  const info = await sharp(source)
    .resize(1600, 1000, { fit: "cover", position: "top" })
    .webp({ quality: 82 })
    .toFile(join(OUT, `${slug}.webp`));
  const from = LIVE[slug] ? ` (live: ${LIVE[slug]})` : "";
  console.log(`${slug.padEnd(22)} ${Math.round(info.size / 1024)} KB${from}`);
}
console.log(`\n${slugs.length} screenshots written to public/images/work/`);
