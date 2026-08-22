"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll reveals, the standard way: an IntersectionObserver adds a class
 * and CSS transitions do the rest.
 *
 * This replaced a CSS scroll-driven-animation version. That approach is
 * newer, needs no JS, and tested fine in headless — but it did not work in
 * a real browser, and its failure mode is invisible content rather than
 * missing motion. IntersectionObserver is supported everywhere, is trivial
 * to inspect in devtools, and degrades to "everything visible".
 *
 * The hidden state is applied from JS on purpose: if this never runs, the
 * markup renders fully visible instead of blank.
 */
const SELECTOR = [
  ".anim-heading",
  ".anim-image",
  ".anim-copy",
  ".anim-row",
  "[data-reveal]",
  ".reveal-up",
  // Every section heading, so a new one can never be forgotten.
  "main h2:not(.hero-stage *)",
  "main h3:not(.hero-stage *)",
  ".prose-ob > p",
  ".prose-ob > ul",
  ".prose-ob > ol",
  ".prose-ob > blockquote",
  ".prose-ob > pre",
  ".prose-ob > table",
  ".prose-ob img",
  ".pipeline-step",
  ".stat",
  // Observed for the child line's draw-in. The container never transforms,
  // so its intersection area stays honest while the line scales from zero.
  ".section-rule",
].join(",");

export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = Array.from(
      document.querySelectorAll<HTMLElement>(SELECTOR),
    ).filter((el) => !el.dataset.revealed);

    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Also reveal anything already scrolled past: an anchor jump or a
          // fast flick can skip an element entirely, and it would otherwise
          // stay hidden forever above the viewport.
          const passed = entry.boundingClientRect.top < 0;
          if (!entry.isIntersecting && !passed) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          // An image that hasn't arrived yet would play its pop on an empty
          // box and then snap in when the bytes land. Reveal it when it's
          // actually there; a failed load still reveals (the alt shows).
          if (el instanceof HTMLImageElement && !el.complete) {
            const show = () => {
              el.classList.add("is-revealed");
              el.dataset.revealed = "1";
            };
            el.addEventListener("load", show, { once: true });
            el.addEventListener("error", show, { once: true });
            continue;
          }
          el.classList.add("is-revealed");
          el.dataset.revealed = "1";
        }
      },
      {
        // Trigger once the element is actually IN view — 8% past the
        // bottom edge — not before it. The earlier version fired 12%
        // before entry, which meant a 0.3s reveal had finished by the time
        // the eye arrived: the effect existed in the code and nowhere
        // else. 8% is shallow enough that a fast scroll still reads as
        // content arriving, not loading.
        rootMargin: "0px 0px -8% 0px",
        threshold: 0,
      },
    );

    // Arm on the next frame rather than synchronously in the effect: on a
    // client-side route change the new page's scroll position and first
    // layout settle first, so the observer's initial pass judges every
    // element where it actually is.
    let armRaf = requestAnimationFrame(() => {
      armRaf = 0;
      for (const el of els) {
        el.classList.add("reveal-init");
        io.observe(el);
      }
    });

    // Anything sitting inside the bottom margin when the page runs out of
    // scroll can never trigger, so flush the remainder at the end.
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        // Only a real scroll counts. At scrollY 0 the page is never "at the
        // bottom" in the sense that matters: if the whole document fits the
        // viewport the observer reveals everything anyway, and a scroll
        // event fired during load while layout is still transiently short
        // used to flush every element invisible-to-the-eye, so distant
        // section rules were already drawn by the time you reached them.
        const atBottom =
          window.scrollY > 0 &&
          window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 4;
        if (!atBottom) return;
        for (const el of els) {
          if (el.dataset.revealed) continue;
          el.classList.add("is-revealed");
          el.dataset.revealed = "1";
          io.unobserve(el);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (armRaf) cancelAnimationFrame(armRaf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}
