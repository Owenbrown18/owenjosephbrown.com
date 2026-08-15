"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll-linked motion, driven from JS for the same reason the reveals
 * are: CSS scroll-driven animations pass headless testing but fail in
 * real Safari, and their failure mode is elements pinned at `from` —
 * invisible rules, a dead progress bar, headings stuck low. One rAF
 * writes transform/opacity only, scheduled by scroll and resize, so the
 * cost is a handful of style writes per scrolled frame.
 *
 * Nothing here hides content. If this never runs, every element sits in
 * its resting stylesheet state, fully visible.
 */

type Frame = (scrollY: number, vh: number, scrollMax: number) => void;

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

export function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const jobs: Frame[] = [];

    // Progress hairline: a position indicator, not decoration, so it runs
    // even under reduced motion (as the CSS timeline version did).
    const progress = document.querySelector<HTMLElement>(".scroll-progress");
    if (progress) {
      jobs.push((y, _vh, max) => {
        progress.style.transform = `scaleX(${max > 0 ? clamp01(y / max) : 0})`;
      });
    }

    if (!reduced) {
      // The hero drifts up and dissolves across the first viewport of
      // scroll. Linear on scroll position, symmetric on the way back.
      for (const el of document.querySelectorAll<HTMLElement>(
        ".hero-parallax",
      )) {
        jobs.push((y, vh) => {
          const t = clamp01(y / vh);
          el.style.transform = `translateY(${(-12 * t).toFixed(3)}%)`;
          el.style.opacity = (1 - 0.85 * t).toFixed(3);
        });
      }

      // Section headings rise slightly slower than the page: 28px of
      // travel spent across the first ~45% of the element's journey
      // through the viewport.
      for (const el of document.querySelectorAll<HTMLElement>(".lift")) {
        jobs.push((_y, vh) => {
          const r = el.getBoundingClientRect();
          const entered = vh - r.top;
          const span = 0.45 * (vh + r.height) - 0.1 * r.height;
          const t = clamp01((entered - 0.1 * r.height) / span);
          el.style.transform = `translateY(${(28 * (1 - t)).toFixed(2)}px)`;
        });
      }

      // Two opposing drifts so stacked photos move against each other,
      // scrubbed across the element's full pass through the viewport.
      const drift = (el: HTMLElement, fromPct: number, toPct: number) => {
        jobs.push((_y, vh) => {
          const r = el.getBoundingClientRect();
          const t = clamp01((vh - r.top) / (vh + r.height));
          const pct = fromPct + (toPct - fromPct) * t;
          el.style.transform = `translateY(${pct.toFixed(3)}%)`;
        });
      };
      for (const el of document.querySelectorAll<HTMLElement>(".parallax-a"))
        drift(el, 7, -7);
      for (const el of document.querySelectorAll<HTMLElement>(".parallax-b"))
        drift(el, -4, 5);
    }

    if (!jobs.length) return;

    let raf = 0;
    const frame = () => {
      raf = 0;
      // One read batch, then writes: scroll metrics first, and each job
      // reads its own rect before writing only transform/opacity.
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      const y = window.scrollY;
      for (const job of jobs) job(y, vh, max);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}
