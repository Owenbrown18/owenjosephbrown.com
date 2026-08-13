import { describe, expect, it } from "vitest";
import { renderAsciiResume } from "@/lib/ascii";
import { identity } from "@/lib/resume-data";

describe("ascii resume", () => {
  it("contains the essentials", () => {
    const out = renderAsciiResume();
    expect(out).toContain(identity.email);
    expect(out).toContain("EXPERIENCE");
    expect(out).toContain("PROJECTS");
    expect(out).toContain("EDUCATION");
    expect(out).toContain("SKILLS");
    expect(out).toContain("OBdesign");
    expect(out).toContain("grain");
    expect(out).toContain("University of Victoria");
    expect(out).toContain("Spring 2027");
  });

  it("emits ANSI colour codes by default", () => {
    expect(renderAsciiResume()).toContain("\x1b[");
  });

  it("strips every escape code in plain mode", () => {
    const plain = renderAsciiResume({ color: false });
    expect(plain).not.toContain("\x1b");
    expect(plain).toContain(identity.email);
  });

  it("wraps bullets to a readable width", () => {
    const plain = renderAsciiResume({ color: false });
    for (const line of plain.split("\n")) {
      expect(line.length, `line too wide: ${line}`).toBeLessThanOrEqual(72);
    }
  });
});
