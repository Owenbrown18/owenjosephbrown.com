import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import matter from "gray-matter";
import { clientSites } from "@/lib/sites";

// Read as text: the registry is static image imports, which only a Next
// build resolves. What matters here is what the registry covers.
const registry = readFileSync("src/lib/images.ts", "utf8");
const registered = [
  ...registry.matchAll(/^\s+"(\/images\/[^"]+)":\s/gm),
].map((m) => m[1]);

describe("image registry", () => {
  it("every registered file exists", () => {
    for (const p of registered) {
      expect(existsSync(`public${p}`), `public${p}`).toBe(true);
    }
  });

  it("every client site on the roster has a registered screenshot", () => {
    for (const site of clientSites) {
      expect(registered).toContain(`/images/work/${site.slug}.webp`);
    }
  });

  it("every case study's hero and thumb are registered", () => {
    for (const f of readdirSync("content/work").filter((f) => f.endsWith(".mdx"))) {
      const { data } = matter(readFileSync(`content/work/${f}`, "utf8"));
      for (const key of ["hero", "thumb"] as const) {
        if (data[key]) {
          expect(registered, `${f} ${key}: ${data[key]}`).toContain(data[key]);
        }
      }
    }
  });

  it("nothing draws an image through a bare /images path", () => {
    // Any src="/images/…" string on next/image skips the registry and
    // brings the stale-cache bug back. Plain <img> in MDX is fine.
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = `${dir}/${e.name}`;
        if (e.isDirectory()) walk(p);
        else if (/\.tsx?$/.test(e.name) && p !== "src/lib/images.ts") {
          const src = readFileSync(p, "utf8");
          if (/src=["{`]+\/images\//.test(src)) offenders.push(p);
        }
      }
    };
    walk("src");
    expect(offenders).toEqual([]);
  });
});
