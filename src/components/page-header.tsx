import type { CSSProperties, ReactNode } from "react";
import { Words } from "@/components/words";

export type MetaItem = {
  label: string;
  value: ReactNode;
  /** Let long values (a stack list, an email) take two columns. */
  wide?: boolean;
};

/**
 * The masthead every subpage shares — case studies and the studio page —
 * and the page's entrance: eyebrow, title, summary (word by word),
 * anything passed as children, then the meta rail, one stagger apart.
 * Pages that use it set sheet-still, because this carries the entrance.
 */
export function PageHeader({
  eyebrow,
  title,
  summary,
  meta,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  summary?: string;
  meta?: MetaItem[];
  children?: ReactNode;
}) {
  const at = (i: number) => ({ "--i": i } as CSSProperties);
  return (
    <header>
      <p className="eyebrow enter" style={at(0)}>
        {eyebrow}
      </p>
      <h1 className="enter mt-4 text-[clamp(2.75rem,7vw,5rem)] text-fg" style={at(1)}>
        {title}
      </h1>
      {summary && (
        <p className="words-enter mt-5 max-w-[52ch] text-lg text-fg-muted" style={{ "--enter-at": "0.18s" } as CSSProperties}>
          <Words>{summary}</Words>
        </p>
      )}
      {children && (
        <div className="enter" style={at(2)}>
          {children}
        </div>
      )}
      {meta && meta.length > 0 && (
        <dl className="enter mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-y border-line py-6 text-sm sm:grid-cols-4" style={at(3)}>
          {meta.map((m) => (
            <div key={m.label} className={m.wide ? "col-span-2" : undefined}>
              <dt className="label-mono text-fg-faint">{m.label}</dt>
              <dd className="mt-1 break-words text-fg">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </header>
  );
}
