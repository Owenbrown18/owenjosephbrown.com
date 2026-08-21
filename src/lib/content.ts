import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const CONTENT_DIR = path.join(process.cwd(), "content", "work");

export const workFrontmatter = z.object({
  title: z.string(),
  kind: z.enum(["product", "systems", "client"]),
  summary: z.string(),
  year: z.string(),
  timeline: z.string(),
  role: z.string(),
  stack: z.array(z.string()),
  liveUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  hero: z.string().optional(),
  heroAlt: z.string().optional(),
  // A looping video hero, for work whose whole point is an interaction a
  // still frame can't show. `hero` is its poster frame when set.
  heroVideo: z.string().optional(),
  downloadUrl: z.string().url().optional(),
  downloadLabel: z.string().optional(),
  order: z.number().int(),
});

export type WorkFrontmatter = z.infer<typeof workFrontmatter>;

export type WorkEntry = WorkFrontmatter & {
  slug: string;
  body: string;
};

export function getWorkEntries(): WorkEntry[] {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"));

  const entries = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const parsed = workFrontmatter.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        `Invalid frontmatter in ${file}: ${parsed.error.message}`,
      );
    }
    return {
      ...parsed.data,
      slug: file.replace(/\.mdx$/, ""),
      body: content,
    };
  });

  return entries.sort((a, b) => a.order - b.order);
}

export function getWorkEntry(slug: string): WorkEntry | undefined {
  // Slugs come from the filesystem at build time; reject anything that
  // isn't a plain slug rather than resolving paths.
  if (!/^[a-z0-9-]+$/.test(slug)) return undefined;
  return getWorkEntries().find((e) => e.slug === slug);
}

export const kindLabel: Record<WorkFrontmatter["kind"], string> = {
  product: "Product",
  systems: "Systems",
  client: "Client build",
};
