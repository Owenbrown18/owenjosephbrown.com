"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // true on the client after hydration, false during SSR — without a
  // setState-in-effect cascade.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // Render a stable placeholder until mounted so SSR and client match.
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={`flex h-8 w-8 items-center justify-center ${className ?? "text-fg-faint"}`}
      >
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="8" cy="8" r="6.5" />
        </svg>
      </button>
    );
  }

  const dark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={`flex h-8 w-8 items-center justify-center transition-colors ${
        className ?? "text-fg-faint hover:text-fg"
      }`}
    >
      {/* Contrast circle: half fills to the side you'll switch to. */}
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="8" cy="8" r="6.5" />
        <path
          d={dark ? "M8 1.5 a6.5 6.5 0 0 1 0 13 Z" : "M8 1.5 a6.5 6.5 0 0 0 0 13 Z"}
          fill="currentColor"
          stroke="none"
        />
      </svg>
    </button>
  );
}
