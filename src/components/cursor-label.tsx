"use client";

import { useEffect, useRef } from "react";

/**
 * A small "VIEW ↗" label that follows the pointer inside a project card,
 * so the whole stage reads as one clickable object without a button
 * sitting on the artwork. Pointer devices only; on touch there is no
 * hover and the card is simply a link. Transform-only writes, rAF
 * throttled, no layout reads in the loop.
 */
export function CursorLabel({ text = "View" }: { text?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const card = el.closest(".project-card") as HTMLElement | null;
    if (!card) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    let box = card.getBoundingClientRect();
    const paint = () => {
      raf = 0;
      el.style.transform = `translate(${x - box.left + 18}px, ${y - box.top + 18}px)`;
    };
    const onEnter = () => {
      box = card.getBoundingClientRect();
      el.dataset.on = "1";
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      delete el.dataset.on;
    };
    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove, { passive: true });
    card.addEventListener("pointerleave", onLeave);
    return () => {
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <span ref={ref} aria-hidden className="cursor-label">
      {text}
      <span className="cursor-label__arrow">↗</span>
    </span>
  );
}
