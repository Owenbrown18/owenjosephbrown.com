import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact";

const valid = {
  name: "Jane Recruiter",
  email: "jane@example.com",
  topic: "Co-op or internship",
  message: "Hello!",
  company: "",
};

describe("contact schema", () => {
  it("accepts a normal submission", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects a bad email with a human message", () => {
    const r = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
    if (!r.success)
      expect(r.error.issues[0].message).toMatch(/doesn't look right/);
  });
  it("rejects an unknown topic", () => {
    expect(
      contactSchema.safeParse({ ...valid, topic: "Buy my SEO" }).success,
    ).toBe(false);
  });
  it("rejects a filled honeypot", () => {
    expect(
      contactSchema.safeParse({ ...valid, company: "Bot LLC" }).success,
    ).toBe(false);
  });
  it("rejects an empty message", () => {
    expect(contactSchema.safeParse({ ...valid, message: "  " }).success).toBe(
      false,
    );
  });
});
