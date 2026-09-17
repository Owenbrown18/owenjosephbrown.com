import type { StaticImageData } from "next/image";
import { clientSites } from "@/lib/sites";
import { img } from "@/lib/images";

/**
 * Every client-site screenshot by slug, resolved through the image
 * registry (src/lib/images.ts) so each has a content-hashed URL.
 * `npm run sync:client-shots` refreshes the files in public/images/work/.
 */
export const siteShots: Record<string, StaticImageData> = Object.fromEntries(
  clientSites.map((site) => [site.slug, img(`/images/work/${site.slug}.webp`)]),
);
