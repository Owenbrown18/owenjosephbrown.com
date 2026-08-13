"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full border border-line px-5 py-2.5 text-xs font-bold uppercase tracking-[0.06em] text-fg transition-colors hover:border-fg print:hidden"
    >
      Print / save PDF
    </button>
  );
}
