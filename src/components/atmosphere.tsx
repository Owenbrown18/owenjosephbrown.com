import { ForestCanvas } from "@/components/forest-canvas";
import { Reveal } from "@/components/reveal";
import { ScrollMotion } from "@/components/scroll-motion";

/**
 * The site's ground: the live forest field, the grain, and the scroll
 * hairline. Rendered once in the root layout so every page sits in the
 * same air — subpages previously rendered on flat colour and read as a
 * different site.
 */
export function Atmosphere() {
  return (
    <>
      <div aria-hidden className="forest-ground fixed inset-0 -z-10">
        <ForestCanvas />
      </div>
      <div aria-hidden className="grain" />
      <div aria-hidden className="scroll-progress" />
      <Reveal />
      <ScrollMotion />
    </>
  );
}
