import { describe, expect, it } from "vitest";
import { getWorkEntries, getWorkEntry, kindLabel } from "@/lib/content";

describe("content layer", () => {
  it("loads all five case studies", () => {
    const entries = getWorkEntries();
    expect(entries).toHaveLength(5);
    expect(entries.map((e) => e.slug)).toEqual([
      "grain",
      "leadgen",
      "grain-construction",
      "figs-and-honey",
      "daves-bakery",
    ]);
  });

  it("sorts by the order field", () => {
    const orders = getWorkEntries().map((e) => e.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("every entry has a non-empty body and valid kind", () => {
    for (const entry of getWorkEntries()) {
      expect(entry.body.length).toBeGreaterThan(500);
      expect(Object.keys(kindLabel)).toContain(entry.kind);
      expect(entry.stack.length).toBeGreaterThan(0);
    }
  });

  it("live URLs are https", () => {
    for (const entry of getWorkEntries()) {
      if (entry.liveUrl) expect(entry.liveUrl).toMatch(/^https:\/\//);
    }
  });

  it("hero images referenced in frontmatter exist on disk", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    for (const entry of getWorkEntries()) {
      if (entry.hero) {
        expect(
          fs.existsSync(path.join(process.cwd(), "public", entry.hero)),
          `${entry.slug} hero missing: ${entry.hero}`,
        ).toBe(true);
      }
    }
  });

  it("images referenced in MDX bodies exist on disk", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    for (const entry of getWorkEntries()) {
      const refs = [...entry.body.matchAll(/\((\/images\/[^)]+)\)/g)].map(
        (m) => m[1],
      );
      const srcs = [...entry.body.matchAll(/src="(\/images\/[^"]+)"/g)].map(
        (m) => m[1],
      );
      for (const ref of [...refs, ...srcs]) {
        expect(
          fs.existsSync(path.join(process.cwd(), "public", ref)),
          `${entry.slug} references missing image: ${ref}`,
        ).toBe(true);
      }
    }
  });

  it("rejects path-traversal slugs", () => {
    expect(getWorkEntry("../../etc/passwd")).toBeUndefined();
    expect(getWorkEntry("no-such-entry")).toBeUndefined();
  });
});
