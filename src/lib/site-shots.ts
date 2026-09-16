import type { StaticImageData } from "next/image";
import grainConstruction from "../../public/images/work/grain-construction.webp";
import figsAndHoney from "../../public/images/work/figs-and-honey.webp";
import davesBakery from "../../public/images/work/daves-bakery.webp";
import charliesExcavating from "../../public/images/work/charlies-excavating.webp";
import somaActiveHealth from "../../public/images/work/soma-active-health.webp";
import bayviewCottages from "../../public/images/work/bayview-cottages.webp";
import nicolConstruction from "../../public/images/work/nicol-construction.webp";
import maidInVictoria from "../../public/images/work/maid-in-victoria.webp";
import adrienneHughes from "../../public/images/work/adrienne-hughes.webp";
import beyondFitness from "../../public/images/work/beyond-fitness.webp";
import suzanneGay from "../../public/images/work/suzanne-gay.webp";

/**
 * Every client-site screenshot, imported rather than referenced by path.
 *
 * A static import gives each file a content hash in its URL. Referenced
 * as "/images/work/<slug>.webp", a re-synced screenshot kept its URL,
 * and Next's image optimizer (which has no invalidation, per its docs)
 * and browsers kept serving the old pixels: Nicol Construction's pre-
 * rebuild capture outlived the file swap. Now a new capture is a new URL.
 *
 * The files stay in public/images/work/ because the OG card generator
 * reads them from disk. `npm run sync:client-shots` refreshes them.
 */
export const siteShots: Record<string, StaticImageData> = {
  "grain-construction": grainConstruction,
  "figs-and-honey": figsAndHoney,
  "daves-bakery": davesBakery,
  "charlies-excavating": charliesExcavating,
  "soma-active-health": somaActiveHealth,
  "bayview-cottages": bayviewCottages,
  "nicol-construction": nicolConstruction,
  "maid-in-victoria": maidInVictoria,
  "adrienne-hughes": adrienneHughes,
  "beyond-fitness": beyondFitness,
  "suzanne-gay": suzanneGay,
};
