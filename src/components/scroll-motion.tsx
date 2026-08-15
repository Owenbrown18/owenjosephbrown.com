"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll-linked motion, driven from JS for the same reason the reveals
 * are: CSS scroll-driven animations pass headless testing but fail in
 * real Safari, pinned at `from`.
 *
 * Two rules keep it smooth, learned the hard way:
 *
 * 1. NO layout reads inside the frame loop. The first version called
 *    getBoundingClientRect per element per frame — after writing
 *    transforms — so every element's own translation fed back into its
 *    own input and the motion stepped. Document positions are measured
 *    once (untransformed) and again on resize; frames are pure math.
 * 2. Values ease toward their targets instead of mirroring scrollY 1:1.
 *    Scroll input is discrete; the exponential chase turns steps into
 *    motion and parks itself when everything has converged.
 *
 * Nothing here hides content. If this never runs, every element sits in
 * its resting stylesheet state, fully visible.
 */

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

type Job = {
  /** Target value from scroll state only — never from the DOM. */
  compute: (y: number, vh: number, max: number) => number;
  apply: (v: number) => void;
  /** Indicators track exactly; decorative motion gets the chase. */
  exact?: boolean;
  cur: number;
};

export function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const jobs: Job[] = [];
    const job = (j: Omit<Job, "cur">) => jobs.push({ ...j, cur: NaN });

    // Progress hairline: a position indicator, not decoration, so it runs
    // even under reduced motion and tracks exactly.
    const progress = document.querySelector<HTMLElement>(".scroll-progress");
    if (progress) {
      job({
        exact: true,
        compute: (y, _vh, max) => (max > 0 ? clamp01(y / max) : 0),
        apply: (v) => {
          progress.style.transform = `scaleX(${v.toFixed(5)})`;
        },
      });
    }

    // Elements whose progress depends on where they sit in the document.
    // Measured with inline transforms cleared so the driver's own writes
    // can never feed back into the measurement.
    const measured: { el: HTMLElement; docTop: number; height: number }[] = [];
    const measure = () => {
      const saved = measured.map(({ el }) => el.style.transform);
      for (const { el } of measured) el.style.transform = "";
      for (const m of measured) {
        const r = m.el.getBoundingClientRect();
        m.docTop = r.top + window.scrollY;
        m.height = r.height;
      }
      measured.forEach((m, i) => {
        m.el.style.transform = saved[i];
      });
    };
    const track = (el: HTMLElement) => {
      const m = { el, docTop: 0, height: 0 };
      measured.push(m);
      return m;
    };

    if (!reduced) {
      // The hero drifts up and dissolves across the first viewport of
      // scroll. Pure scrollY math — no measurement needed.
      for (const el of document.querySelectorAll<HTMLElement>(
        ".hero-parallax",
      )) {
        job({
          compute: (y, vh) => clamp01(y / vh),
          apply: (t) => {
            el.style.transform = `translateY(${(-12 * t).toFixed(3)}%)`;
            el.style.opacity = (1 - 0.85 * t).toFixed(3);
          },
        });
      }

      // Section headings rise slightly slower than the page: 28px of
      // travel across the first ~45% of the element's pass through the
      // viewport.
      for (const el of document.querySelectorAll<HTMLElement>(".lift")) {
        const m = track(el);
        job({
          compute: (y, vh) => {
            const entered = vh - (m.docTop - y);
            const span = 0.45 * (vh + m.height) - 0.1 * m.height;
            return clamp01((entered - 0.1 * m.height) / span);
          },
          apply: (t) => {
            el.style.transform = `translateY(${(28 * (1 - t)).toFixed(2)}px)`;
          },
        });
      }

      // Two opposing drifts so stacked photos move against each other,
      // scrubbed across the element's full pass through the viewport.
      const drift = (el: HTMLElement, fromPct: number, toPct: number) => {
        const m = track(el);
        job({
          compute: (y, vh) => clamp01((vh - (m.docTop - y)) / (vh + m.height)),
          apply: (t) => {
            const pct = fromPct + (toPct - fromPct) * t;
            el.style.transform = `translateY(${pct.toFixed(3)}%)`;
          },
        });
      };
      for (const el of document.querySelectorAll<HTMLElement>(".parallax-a"))
        drift(el, 7, -7);
      for (const el of document.querySelectorAll<HTMLElement>(".parallax-b"))
        drift(el, -4, 5);
    }

    if (!jobs.length) return;

    measure();

    let raf = 0;
    let last = 0;
    let remeasure = false;
    const frame = (now: number) => {
      raf = 0;
      if (remeasure) {
        remeasure = false;
        measure();
      }
      const dt = last ? Math.min(now - last, 100) : 16.7;
      last = now;
      // Time-based chase so the feel is identical at 60 and 120Hz.
      const k = 1 - Math.exp(-dt / 90);

      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      const y = window.scrollY;

      let settled = true;
      for (const j of jobs) {
        const goal = j.compute(y, vh, max);
        if (j.exact || Number.isNaN(j.cur)) {
          j.cur = goal;
        } else {
          j.cur += (goal - j.cur) * k;
          if (Math.abs(goal - j.cur) > 0.0005) settled = false;
          else j.cur = goal;
        }
        j.apply(j.cur);
      }
      // Keep chasing until everything converges, then park.
      if (!settled) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onResize = () => {
      remeasure = true;
      schedule();
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    // Late-loading images and fonts can shift document positions; one
    // re-measure after the page fully settles covers it.
    window.addEventListener("load", onResize, { once: true });
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}
