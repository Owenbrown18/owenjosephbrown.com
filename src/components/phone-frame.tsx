import type { ReactNode } from "react";

/**
 * The iPhone frame, ported from the OBdesign site's hero. Dark shell,
 * speaker slit, screenshot rounded within. Children: one image.
 *
 * Proportional, like the laptop: the outer box is the size container and
 * the shell measures itself in cqw of it (an element can't size its own
 * padding in its own container units), so a phone on a small Explore
 * more tile is the home card's phone, scaled, not a fatter-bezeled one.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mobile-frame-box">
      <div className="mobile-frame">
        <span className="mobile-frame__speaker" aria-hidden />
        <div className="mobile-frame__view">{children}</div>
      </div>
    </div>
  );
}
