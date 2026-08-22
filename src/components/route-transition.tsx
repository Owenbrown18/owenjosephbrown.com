"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Leaving a page is a short fade-and-lift, mirrored by the page entrance
 * the sheet and hero already carry, so the site reads as one surface.
 * Internal link clicks are intercepted, <html data-leaving> plays the
 * exit, and the navigation fires once it has. Anything that is not a
 * plain same-tab internal navigation is left alone. Reduced motion skips
 * the wait. Without JS, links are just links.
 */
const EXIT_MS = 160;

export function RouteTransition() {
  const router = useRouter();
  const pathname = usePathname();

  // A new route has committed: clear the leaving state.
  useEffect(() => {
    delete document.documentElement.dataset.leaving;
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download") || a.dataset.noTransition !== undefined) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // same page / hash
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      e.preventDefault();
      document.documentElement.dataset.leaving = "1";
      window.setTimeout(() => {
        router.push(url.pathname + url.search + url.hash);
      }, EXIT_MS);
    };
    // Capture phase: Next's <Link> handles the click at React's root and
    // prevents default before a bubbling document listener would see it.
    // Capturing runs first; Link then sees defaultPrevented and stands
    // down, and the navigation is ours to time.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
