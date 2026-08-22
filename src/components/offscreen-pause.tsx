"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Continuous animations (the hero cluster's float, the marquee) cost the
 * compositor a frame's work forever, whether or not they're on screen.
 * This marks any [data-pause-offscreen] element with data-offscreen while
 * it is out of view; CSS pauses the animations inside. Nothing visual
 * depends on it running — with no JS everything simply keeps animating.
 */
export function OffscreenPause() {
  const pathname = usePathname();

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-pause-offscreen]");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) delete el.dataset.offscreen;
          else el.dataset.offscreen = "1";
        }
      },
      { rootMargin: "10% 0px 10% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
