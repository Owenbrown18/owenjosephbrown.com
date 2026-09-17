import type { StaticImageData } from "next/image";

import grainHomeRoll from "../../public/images/grain/home_roll.webp";
import grainNewRollQr from "../../public/images/grain/new_roll_qr.webp";
import grainWaiting from "../../public/images/grain/waiting.webp";
import workOnTheRoadside from "../../public/images/work/on-the-roadside.webp";
import onTheRoadsideAppHome from "../../public/images/on-the-roadside/app-home.webp";
import onTheRoadsideAppDetail from "../../public/images/on-the-roadside/app-detail.webp";
import whisprSettingsGeneral from "../../public/images/whispr/settings-general.webp";
import whisprPillListeningV2 from "../../public/images/whispr/pill-listening-v2.webp";
import whisprPillTranscribingV2 from "../../public/images/whispr/pill-transcribing-v2.webp";
import leadgenDashboardTop from "../../public/images/leadgen/dashboard-top.webp";
import leadgenClassifierCode from "../../public/images/leadgen/classifier-code.webp";
import grainBranding from "../../public/images/grain/branding.webp";
import whisprDemoPoster from "../../public/images/whispr/demo-poster.webp";
import leadgenDashboard from "../../public/images/leadgen/dashboard.webp";
import onTheRoadsideShowcase from "../../public/images/on-the-roadside/showcase.webp";
import onTheRoadsideScreenTruckDetail from "../../public/images/on-the-roadside/screen-truck-detail.webp";
import aboutOwenBrownPortrait3 from "../../public/images/about/owen-brown-portrait-3.jpg";
import aboutOwenBrownHeadshot3 from "../../public/images/about/owen-brown-headshot-3.jpg";
import workGrainConstruction from "../../public/images/work/grain-construction.webp";
import workFigsAndHoney from "../../public/images/work/figs-and-honey.webp";
import workDavesBakery from "../../public/images/work/daves-bakery.webp";
import workCharliesExcavating from "../../public/images/work/charlies-excavating.webp";
import workSomaActiveHealth from "../../public/images/work/soma-active-health.webp";
import workBayviewCottages from "../../public/images/work/bayview-cottages.webp";
import workNicolConstruction from "../../public/images/work/nicol-construction.webp";
import workMaidInVictoria from "../../public/images/work/maid-in-victoria.webp";
import workAdrienneHughes from "../../public/images/work/adrienne-hughes.webp";
import workBeyondFitness from "../../public/images/work/beyond-fitness.webp";
import workSuzanneGay from "../../public/images/work/suzanne-gay.webp";

/**
 * Every image the site draws through next/image, as a static import.
 *
 * Referenced by bare path ("/images/…"), an image keeps its URL when the
 * file is replaced, and Next's image optimizer has no cache invalidation
 * (its own docs): Nicol Construction's pre-rebuild capture and On the
 * Roadside's first, wrong hero both outlived their replacement files. A
 * static import puts a content hash in the URL, so a new file is a new
 * URL and nothing can serve the old pixels.
 *
 * Content keeps readable paths (MDX frontmatter says hero: "/images/…");
 * img() resolves them here. An unregistered path throws, which fails the
 * build, rather than quietly bringing the stale-cache bug back.
 *
 * Plain <img> and <video poster> (MDX bodies, the Whispr video) are not
 * optimized and revalidate on every load, so they don't need this.
 */
const registry: Record<string, StaticImageData> = {
  "/images/grain/home_roll.webp": grainHomeRoll,
  "/images/grain/new_roll_qr.webp": grainNewRollQr,
  "/images/grain/waiting.webp": grainWaiting,
  "/images/work/on-the-roadside.webp": workOnTheRoadside,
  "/images/on-the-roadside/app-home.webp": onTheRoadsideAppHome,
  "/images/on-the-roadside/app-detail.webp": onTheRoadsideAppDetail,
  "/images/whispr/settings-general.webp": whisprSettingsGeneral,
  "/images/whispr/pill-listening-v2.webp": whisprPillListeningV2,
  "/images/whispr/pill-transcribing-v2.webp": whisprPillTranscribingV2,
  "/images/leadgen/dashboard-top.webp": leadgenDashboardTop,
  "/images/leadgen/classifier-code.webp": leadgenClassifierCode,
  "/images/grain/branding.webp": grainBranding,
  "/images/whispr/demo-poster.webp": whisprDemoPoster,
  "/images/leadgen/dashboard.webp": leadgenDashboard,
  "/images/on-the-roadside/showcase.webp": onTheRoadsideShowcase,
  "/images/on-the-roadside/screen-truck-detail.webp": onTheRoadsideScreenTruckDetail,
  "/images/about/owen-brown-portrait-3.jpg": aboutOwenBrownPortrait3,
  "/images/about/owen-brown-headshot-3.jpg": aboutOwenBrownHeadshot3,
  "/images/work/grain-construction.webp": workGrainConstruction,
  "/images/work/figs-and-honey.webp": workFigsAndHoney,
  "/images/work/daves-bakery.webp": workDavesBakery,
  "/images/work/charlies-excavating.webp": workCharliesExcavating,
  "/images/work/soma-active-health.webp": workSomaActiveHealth,
  "/images/work/bayview-cottages.webp": workBayviewCottages,
  "/images/work/nicol-construction.webp": workNicolConstruction,
  "/images/work/maid-in-victoria.webp": workMaidInVictoria,
  "/images/work/adrienne-hughes.webp": workAdrienneHughes,
  "/images/work/beyond-fitness.webp": workBeyondFitness,
  "/images/work/suzanne-gay.webp": workSuzanneGay,
};

export function img(path: string): StaticImageData {
  const hit = registry[path];
  if (!hit) {
    throw new Error(
      `Image "${path}" is not registered. Import it in src/lib/images.ts ` +
        "so it gets a content-hashed URL.",
    );
  }
  return hit;
}

/** Registered paths, for the tests. */
export const registeredImagePaths = Object.keys(registry);
