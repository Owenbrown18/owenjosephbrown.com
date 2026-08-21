import type { ReactNode } from "react";

/**
 * The iPhone frame, ported from the OBdesign site's hero. Dark shell,
 * speaker slit, screenshot rounded within. Children: one image.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mobile-frame">
      <span className="mobile-frame__speaker" aria-hidden />
      <div className="mobile-frame__view">{children}</div>
    </div>
  );
}
