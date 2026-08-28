import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The action pulls in a request context and an email client. Both are
// stubbed so the tests can exercise the gate order: honeypot, then shape,
// then spam check, then send.
type SendPayload = { replyTo: string; subject: string; text: string };
type SendResult = { data: { id: string }; error: null };
const send = vi
  .fn<(payload: SendPayload) => Promise<SendResult>>()
  .mockResolvedValue({ data: { id: "e1" }, error: null });
vi.mock("next/headers", () => ({
  headers: async () => new Map<string, string>() as unknown as Headers,
}));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const { sendContact } = await import("@/app/contact-action");

function form(overrides: Record<string, string> = {}) {
  const fd = new FormData();
  const base = {
    name: "Jane Recruiter",
    email: "jane@example.com",
    topic: "Co-op or internship",
    message: "Are you free for a Spring 2027 term?",
    company: "",
    ...overrides,
  };
  for (const [k, v] of Object.entries(base)) fd.set(k, v);
  return fd;
}

beforeEach(() => {
  send.mockClear();
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: true, json: async () => ({ success: true }) })),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("sendContact", () => {
  it("answers a filled honeypot with a silent success and sends nothing", async () => {
    // It used to fall through to the schema, which types `company` as an
    // empty string, so a bot got back a validation error naming the exact
    // field to leave alone next time.
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const r = await sendContact({ status: "idle" }, form({ company: "Bot LLC" }));

    expect(r).toEqual({ status: "sent" });
    expect(send).not.toHaveBeenCalled();
  });

  it("reports a bad field before spending a spam check on it", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const r = await sendContact({ status: "idle" }, form({ email: "nope" }));

    expect(r.status).toBe("error");
    expect(r.message).toMatch(/doesn't look right/);
    expect(send).not.toHaveBeenCalled();
  });

  it("blocks the send when Turnstile refuses the token", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ success: false, "error-codes": ["invalid-input-response"] }),
      })),
    );

    const r = await sendContact({ status: "idle" }, form({ "cf-turnstile-response": "forged" }));

    expect(r.status).toBe("error");
    expect(r.message).toMatch(/spam check/i);
    expect(send).not.toHaveBeenCalled();
  });

  it("blocks the send when enforcement is on and no token came with it", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");

    const r = await sendContact({ status: "idle" }, form());

    expect(r.status).toBe("error");
    expect(send).not.toHaveBeenCalled();
  });

  it("sends a good message once the token passes", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");

    const r = await sendContact({ status: "idle" }, form({ "cf-turnstile-response": "0.good" }));

    expect(r).toEqual({ status: "sent" });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0]?.[0]).toMatchObject({
      replyTo: "Jane Recruiter <jane@example.com>",
      subject: "[portfolio] Co-op or internship — Jane Recruiter",
    });
  });

  it("still sends before the Turnstile keys exist", async () => {
    // The whole point of the fail-open default: the form works the day
    // before the keys are added, and the day Cloudflare has an outage.
    vi.stubEnv("RESEND_API_KEY", "re_test");

    expect(await sendContact({ status: "idle" }, form())).toEqual({ status: "sent" });
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("hands over the direct address when Resend isn't configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const r = await sendContact({ status: "idle" }, form());

    expect(r.status).toBe("error");
    expect(r.message).toMatch(/owenjosephbrown@gmail\.com/);
    expect(send).not.toHaveBeenCalled();
  });
});
