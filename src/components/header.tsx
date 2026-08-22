"use client";

import Link from "next/link";
import { PixelCells } from "@/components/pixel-cells";
import { useEffect, useRef, useState } from "react";

/**
 * Nav that gets out of the way: transparent and floating at the top of the
 * page, hides as you scroll down, and drops back in (with a ground behind
 * it, so it stays readable over content) the moment you scroll up.
 *
 * Below `sm` the links collapse into a sheet — five numbered items plus a
 * resume button do not fit on a phone, and quietly dropping two of them
 * meant Expertise and About were unreachable there.
 */
const anchors = [
  { num: "01", label: "home", href: "/#home" },
  { num: "02", label: "work", href: "/#work" },
  { num: "03", label: "about", href: "/#about" },
  { num: "04", label: "contact", href: "/#contact" },
];

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const queued = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lastY.current = window.scrollY;

    const read = () => {
      queued.current = false;
      const y = window.scrollY;
      setAtTop(y < 40);

      const delta = y - lastY.current;
      if (Math.abs(delta) > 6 && y > 0) {
        setHidden(delta > 0 && y > 120);
        lastY.current = y;
      } else if (y < 40) {
        setHidden(false);
        lastY.current = y;
      }
    };

    const onScroll = () => {
      if (queued.current) return;
      queued.current = true;
      requestAnimationFrame(read);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // Stop the page scrolling behind the sheet.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[translate,background-color,border-color] duration-300 ease-out ${
        hidden && !open ? "-translate-y-full sm:translate-y-0" : "translate-y-0"
      } ${
        atTop && !open
          ? "border-b border-transparent bg-transparent"
          : "border-b border-white/10 bg-[color-mix(in_srgb,var(--bg)_94%,transparent)]"
      }`}
    >
      <div className="container-site flex h-20 items-center justify-between">
        <Link
          href="/#home"
          className="whitespace-nowrap font-display text-lg font-bold tracking-[-0.02em] text-white/95"
        >
          OB<span className="text-accent">.</span>
        </Link>

        {/* Desktop: the rail, spread across the width. Each item owns a
            rule that fills with sage as you move through its section, so
            the nav is also the progress indicator. */}
        <nav
          aria-label="Primary"
          className="ml-10 hidden flex-1 items-stretch gap-6 sm:flex"
        >
          {anchors.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-nav-section={item.href.split("#")[1]}
              className="nav-rail nav-enter group flex-1 pb-1.5 pt-1 text-[13px] text-white/55 transition-colors hover:text-white lg:text-sm"
            >
              <span aria-hidden className="nav-num">
                {item.num}
              </span>
              {item.label}
              <span aria-hidden className="nav-rail-track">
                <span className="nav-rail-fill" />
              </span>
            </Link>
          ))}
          <Link
            href="/resume"
            className="btn-pixel my-auto shrink-0 border border-white/20 px-4 py-1.5 text-[13px] text-white/80"
          >
            <PixelCells seed="nav-resume" variant="hover" cols={8} rows={3} spread={220} />
            <span className="btn-pixel__label">resume</span>
          </Link>
        </nav>

        {/* Mobile: one button. */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="menu-toggle sm:hidden"
          data-open={open ? "" : undefined}
        >
          <span aria-hidden />
          <span aria-hidden />
        </button>
      </div>

      {/* The sheet */}
      <div
        id="mobile-nav"
        ref={panelRef}
        hidden={!open}
        className="border-t border-white/10 bg-[color-mix(in_srgb,var(--bg)_97%,transparent)] sm:hidden"
      >
        <nav aria-label="Primary" className="container-site py-4">
          {anchors.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-3 border-b border-white/10 py-4 text-lg text-white/85 last:border-b-0"
            >
              <span aria-hidden className="nav-num !text-sm">
                {item.num}
              </span>
              {item.label}
            </Link>
          ))}
          <Link
            href="/resume"
            onClick={() => setOpen(false)}
            className="btn-pixel mt-4 block border border-white/25 py-3 text-center text-sm text-white/90"
          >
            <PixelCells seed="sheet-resume" variant="hover" cols={14} rows={3} spread={240} />
            <span className="btn-pixel__label">resume</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
