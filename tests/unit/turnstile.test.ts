import { afterEach, describe, expect, it, vi } from "vitest";
import { shouldBlock, verifyTurnstile } from "@/lib/turnstile";

const TOKEN = "0.abcdef";

function mockFetch(impl: () => Promise<unknown> | never) {
  vi.stubGlobal("fetch", vi.fn(impl as () => Promise<Response>));
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("verifyTurnstile", () => {
  it("reports unconfigured, without calling out, when no secret is set", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const r = await verifyTurnstile(TOKEN);

    expect(r).toEqual({ ok: false, reason: "unconfigured" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("rejects a missing or blank token once enforcement is on", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    for (const token of [null, undefined, "", "   "]) {
      expect(await verifyTurnstile(token)).toEqual({
        ok: false,
        reason: "missing",
      });
    }
  });

  it("passes a token Cloudflare accepts", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    mockFetch(async () => ({ ok: true, json: async () => ({ success: true }) }));

    expect(await verifyTurnstile(TOKEN)).toEqual({ ok: true });
  });

  it("rejects a token Cloudflare refuses, keeping the codes", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    mockFetch(async () => ({
      ok: true,
      json: async () => ({
        success: false,
        "error-codes": ["timeout-or-duplicate"],
      }),
    }));

    expect(await verifyTurnstile(TOKEN)).toEqual({
      ok: false,
      reason: "rejected",
      codes: ["timeout-or-duplicate"],
    });
  });

  it("sends the secret and the token, and the IP only when known", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "s3cret");
    const spy = vi
      .fn<
        (
          url: string,
          init: { body: URLSearchParams },
        ) => Promise<{ ok: boolean; json: () => Promise<unknown> }>
      >()
      .mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.stubGlobal("fetch", spy);

    await verifyTurnstile(TOKEN, "203.0.113.9");
    let body = spy.mock.calls[0]![1].body;
    expect(body.get("secret")).toBe("s3cret");
    expect(body.get("response")).toBe(TOKEN);
    expect(body.get("remoteip")).toBe("203.0.113.9");

    await verifyTurnstile(TOKEN);
    body = spy.mock.calls[1]![1].body;
    expect(body.has("remoteip")).toBe(false);
  });

  it("reports unreachable when Cloudflare errors or times out", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");

    mockFetch(async () => {
      throw new Error("network down");
    });
    expect(await verifyTurnstile(TOKEN)).toEqual({
      ok: false,
      reason: "unreachable",
    });

    mockFetch(async () => ({ ok: false, status: 503, json: async () => ({}) }));
    expect(await verifyTurnstile(TOKEN)).toEqual({
      ok: false,
      reason: "unreachable",
    });
  });
});

describe("shouldBlock", () => {
  // The fail-open policy, stated as a test so it can't drift by accident.
  it("blocks only a missing or refused token", () => {
    expect(shouldBlock({ ok: true })).toBe(false);
    expect(shouldBlock({ ok: false, reason: "missing" })).toBe(true);
    expect(shouldBlock({ ok: false, reason: "rejected" })).toBe(true);
  });

  it("lets the message through when the check never ran", () => {
    // No keys yet, or Cloudflare is down: a lost enquiry costs more than
    // a spam email that still has to clear the honeypot.
    expect(shouldBlock({ ok: false, reason: "unconfigured" })).toBe(false);
    expect(shouldBlock({ ok: false, reason: "unreachable" })).toBe(false);
  });
});
