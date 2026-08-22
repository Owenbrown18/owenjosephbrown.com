import type { ReactNode } from "react";

/**
 * The laptop frame, ported from the OBdesign site's hero (Owen's call:
 * those frames, on this site). Dark screen bezel, a paper browser bar
 * with traffic dots and a padlocked URL pill, then the 16/10 viewport,
 * and the closed-deck base with its notch.
 */
export function LaptopFrame({
  url,
  children,
  size = "full",
}: {
  url: string;
  children: ReactNode;
  /** mini: the carousel's scaled-down metrics, ported from TrustStrip. */
  size?: "full" | "mini";
}) {
  return (
    <div className={`laptop-frame${size === "mini" ? " laptop-frame--mini" : ""}`}>
      <div className="laptop-frame__screen">
        <div className="laptop-frame__bar">
          <span className="laptop-frame__dots" aria-hidden>
            <span />
            <span />
            <span />
          </span>
          <span className="laptop-frame__url">
            <svg
              className="laptop-frame__lock"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <rect x="5" y="11" width="14" height="9" rx="2" fill="currentColor" />
              <path
                d="M8 11V8a4 4 0 0 1 8 0v3"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            {url}
          </span>
        </div>
        <div className="laptop-frame__view">{children}</div>
      </div>
      <div className="laptop-frame__base" aria-hidden>
        <span className="laptop-frame__notch" />
      </div>
    </div>
  );
}
