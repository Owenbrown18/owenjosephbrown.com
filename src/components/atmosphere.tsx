import { ForestCanvas } from "@/components/forest-canvas";
import { Reveal } from "@/components/reveal";
import { ScrollMotion } from "@/components/scroll-motion";
import { OffscreenPause } from "@/components/offscreen-pause";

/**
 * The site's ground and its motion plumbing: the field canvas, the
 * reveal observer, the scroll driver, and the off-screen pause. Rendered
 * once in the root layout so every page sits in the same air.
 */
export function Atmosphere() {
  return (
    <>
      <div aria-hidden className="forest-ground fixed inset-0 -z-10">
        <ForestCanvas />
      </div>
      <Reveal />
      <ScrollMotion />
      <OffscreenPause />
    </>
  );
}
