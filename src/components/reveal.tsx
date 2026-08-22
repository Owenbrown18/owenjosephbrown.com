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
          el.classList.add("is-revealed");
          el.dataset.revealed = "1";
          io.unobserve(el);
        }
      },
      {
        // Trigger slightly BEFORE the element scrolls in. Delaying it made
        // fast scrolling look like text failing to load, because the copy
        // was still fading up by the time it was readable.
        rootMargin: "0px 0px 12% 0px",
        threshold: 0,
      },
    );

    for (const el of els) {
      el.classList.add("reveal-init");
      io.observe(el);
    }

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
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}
