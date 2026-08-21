"use client";

import { useEffect, useState } from "react";

/**
 * Owen's local clock. Rendered empty on the server and on first paint:
 * the server has no idea what time it is in Victoria relative to the
 * visitor, and rendering a guess would be a hydration mismatch.
 */
export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-CA", {
          timeZone: "America/Vancouver",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, []);

  // suppressHydrationWarning: the value legitimately differs between the
  // empty server render and the first client tick.
  return (
    <span suppressHydrationWarning className="tabular-nums">
      {time ?? "--:--"}
    </span>
  );
}
