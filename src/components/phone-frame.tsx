import type { ReactNode } from "react";

/**
 * Device bezel around app screenshots, matching the studio site's device
 * treatment: dark rounded frame, side buttons, screen inset.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-[2rem] border border-white/25 bg-[#050f0e] p-[6px] shadow-2xl">
      {/* side buttons */}
      <span
        aria-hidden
        className="absolute -left-[2px] top-[22%] h-8 w-[2px] rounded-full bg-white/25"
      />
      <span
        aria-hidden
        className="absolute -right-[2px] top-[30%] h-12 w-[2px] rounded-full bg-white/25"
      />
      <div className="overflow-hidden rounded-[1.65rem]">{children}</div>
    </div>
  );
}
