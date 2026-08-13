import type { MetadataRoute } from "next";
import { getWorkEntries } from "@/lib/content";

const BASE = "https://owenjosephbrown.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const statics = ["", "/obdesign", "/resume"].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
  }));
  const work = getWorkEntries().map((e) => ({
    url: `${BASE}/work/${e.slug}`,
    lastModified: new Date(),
  }));
  return [...statics, ...work];
}
