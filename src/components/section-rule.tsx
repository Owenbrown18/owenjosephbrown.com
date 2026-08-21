/**
 * The break between sections: the section number at the content edge, and
 * a hairline running from it out to the viewport edge, drawing itself in
 * as you arrive. Purely decorative — the heading below carries the
 * meaning, so it's hidden from assistive tech.
 */
export function SectionRule({ num }: { num: string }) {
  return (
    <div aria-hidden className="fullbleed section-rule">
      <span className="section-rule-num">{num}</span>
      <span className="section-rule-line" />
    </div>
  );
}
