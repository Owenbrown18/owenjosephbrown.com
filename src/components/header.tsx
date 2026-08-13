"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
];

export function Header() {
  const pathname = usePathname();
  // The landing page lives on the forest field regardless of theme,
  // so its chrome is always dark.
  const onForest = pathname === "/";

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-sm ${
        onForest ? "border-white/10 bg-forest/70" : "border-line bg-bg/85"
      }`}
    >
      <div className="container-site flex h-14 items-center justify-between">
        <Link
          href="/"
          className={`whitespace-nowrap font-display text-base font-bold tracking-[-0.02em] sm:text-lg ${
            onForest ? "text-white/95" : "text-fg"
          }`}
        >
          <span className="sm:hidden">
            OB<span className="text-accent">.</span>
          </span>
          <span className="hidden sm:inline">
            Owen Brown<span className="text-accent">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label="Primary" className="flex items-center">
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-2 py-1.5 text-[13px] transition-colors sm:px-3 sm:text-sm ${
                    onForest
                      ? "text-white/60 hover:text-white"
                      : active
                        ? "text-fg"
                        : "text-fg-faint hover:text-fg"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() =>
              document.dispatchEvent(new CustomEvent("open-command-palette"))
            }
            className={`hidden items-center gap-1.5 border px-2 py-1 text-xs transition-colors sm:flex ${
              onForest
                ? "border-white/20 text-white/60 hover:text-white"
                : "border-line text-fg-faint hover:text-fg"
            }`}
            aria-label="Open command palette"
          >
            <kbd className="font-body">⌘K</kbd>
          </button>

          <ThemeToggle
            className={onForest ? "text-white/60 hover:text-white" : undefined}
          />
        </div>
      </div>
    </header>
  );
}
