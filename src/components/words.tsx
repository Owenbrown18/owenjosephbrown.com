import { Children, Fragment, type CSSProperties, type ReactNode } from "react";

/**
 * Splits a paragraph into words so they can cascade — the paragraph
 * analogue of a bullet list's item-by-item arrival. Each word is an
 * inline-block span carrying --i; spaces stay as real text nodes between
 * them so wrapping and copy-paste are untouched. Inline elements (links,
 * <strong>) ride along as one unit. Rendered on the server, so there is
 * no flash of unsplit text and no measuring.
 */
export function Words({ children }: { children: ReactNode }) {
  let i = 0;
  const out: ReactNode[] = [];
  const push = (node: ReactNode) => {
    out.push(
      <span key={out.length} className="w" style={{ "--i": i++ } as CSSProperties}>
        {node}
      </span>,
    );
  };
  for (const child of Children.toArray(children)) {
    if (typeof child === "string" || typeof child === "number") {
      const parts = String(child).split(/(\s+)/);
      for (const part of parts) {
        if (!part) continue;
        if (/^\s+$/.test(part)) out.push(<Fragment key={out.length}>{" "}</Fragment>);
        else push(part);
      }
    } else {
      push(child);
    }
  }
  return <>{out}</>;
}
