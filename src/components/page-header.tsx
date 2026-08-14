import type { ReactNode } from "react";

export type MetaItem = {
  label: string;
  value: ReactNode;
  /** Let long values (a stack list, an email) take two columns. */
  wide?: boolean;
};

/**
 * The masthead every subpage shares: sage rule, eyebrow, title, summary,
 * and an optional meta rail. One component so a case study and the studio
 * page can't drift apart.
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
  return (
    <header className="max-w-[52rem]">
      <div className="sage-bar mb-7" />
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="anim-heading mt-4 text-[clamp(2.75rem,7vw,5rem)] text-fg">{title}</h1>
      {summary && (
        <p className="mt-5 max-w-[52ch] text-lg text-fg-muted">{summary}</p>
      )}
      {children}
      {meta && meta.length > 0 && (
        <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-y border-line py-6 text-sm sm:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label} className={m.wide ? "col-span-2" : undefined}>
              <dt className="text-xs text-fg-faint">{m.label}</dt>
              <dd className="mt-1 break-words text-fg">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </header>
  );
}
