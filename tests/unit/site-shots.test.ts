import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { clientSites } from "@/lib/sites";

// Read as text: the map is static image imports, which only a Next build
// resolves. What matters here is that the map and the roster agree.
const source = readFileSync("src/lib/site-shots.ts", "utf8");
const mapped = [...source.matchAll(/^\s+"([a-z0-9-]+)":\s/gm)].map((m) => m[1]);

describe("client-site screenshots", () => {
  it("every site on the roster has an imported screenshot", () => {
    for (const site of clientSites) {
      expect(mapped, `${site.slug} missing from site-shots.ts`).toContain(
        site.slug,
      );
    }
  });

  it("the map holds nothing that isn't on the roster", () => {
    const slugs = clientSites.map((s) => s.slug);
    for (const slug of mapped) expect(slugs).toContain(slug);
  });

  it("every imported file exists", () => {
    for (const slug of mapped) {
      expect(
        existsSync(`public/images/work/${slug}.webp`),
        `public/images/work/${slug}.webp`,
      ).toBe(true);
    }
  });
});
