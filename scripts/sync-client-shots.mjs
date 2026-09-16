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
 * OBdesign repo; a missing one fails the run rather than leaving a stale
 * file quietly in place.
 */
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";

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

const missing = slugs.filter((s) => !existsSync(join(SOURCE, `${s}.png`)));
if (missing.length) {
  console.error(`Missing in the OBdesign repo: ${missing.join(", ")}`);
  process.exit(1);
}

for (const slug of slugs) {
  // 1600x1000 from the top: the laptop frames show a 16:10 viewport, and
  // a desktop capture's first screen is the part that reads at that size.
  const info = await sharp(join(SOURCE, `${slug}.png`))
    .resize(1600, 1000, { fit: "cover", position: "top" })
    .webp({ quality: 82 })
    .toFile(join(OUT, `${slug}.webp`));
  console.log(`${slug.padEnd(22)} ${Math.round(info.size / 1024)} KB`);
}
console.log(`\n${slugs.length} screenshots written to public/images/work/`);
