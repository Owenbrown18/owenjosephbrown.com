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

/**
 * Every client site's own link-preview (OG) image by slug, 1200x630, for
 * the cards on /obdesign: designed to be read small, where a full-page
 * screenshot shrinks to mush. The same files obwebdesign.ca's cards use,
 * refreshed by the same `npm run sync:client-shots`.
 */
export const sitePreviews: Record<string, StaticImageData> = Object.fromEntries(
  clientSites.map((site) => [site.slug, img(`/images/previews/${site.slug}.webp`)]),
);
