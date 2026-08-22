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

    // Nav rail: each anchor's hairline fills across its own section, so
    // the five rules together read as one progress bar. Exact, not eased:
    // it's an indicator. Runs under reduced motion for the same reason
    // the progress bar did.
    const rails = document.querySelectorAll<HTMLElement>("[data-nav-section]");
    for (const rail of rails) {
      const fill = rail.querySelector<HTMLElement>(".nav-rail-fill");
      const section = document.getElementById(rail.dataset.navSection ?? "");
      if (!fill || !section) continue;
      const m = track(section);
      job({
        exact: true,
        // The scroll range over which this section is the one you're
        // reading. The end is clamped to the last reachable scroll
        // position, because the final section can never scroll fully past
        // the viewport and would otherwise stop short of full.
        compute: (y, vh, max) => {
          // A section "starts" when it reaches the reading line 35% down
          // the viewport — except the first one, which is already there at
          // scrollY 0 and must read as zero progress at the top of the page.
          const start = Math.max(0, m.docTop - vh * 0.35);
          const end = Math.min(m.docTop + m.height - vh * 0.35, max);
          return clamp01((y - start) / Math.max(1, end - start));
        },
        apply: (v) => {
          fill.style.transform = `scaleX(${v.toFixed(4)})`;
        },
      });
    }

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

      // The device cluster is plain parallax: it drifts at a different
      // rate than the page so the hero reads as two depths, but it never
      // fades (Owen's call — the objects should stay objects).
      for (const el of document.querySelectorAll<HTMLElement>(".hero-drift")) {
        job({
          compute: (y, vh) => clamp01(y / vh),
          apply: (t) => {
            el.style.transform = `translateY(${(-22 * t).toFixed(3)}%)`;
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
