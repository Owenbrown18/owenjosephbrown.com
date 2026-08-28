/**
 * Cloudflare Turnstile verification, server side.
 *
 * Two deliberate choices live here, both about not losing a real message:
 *
 * 1. With no secret configured the check reports "unconfigured" and the
 *    caller lets the message through. Adding TURNSTILE_SECRET_KEY is what
 *    switches enforcement on, so the form works before the keys exist and
 *    a half-finished setup never silently swallows mail.
 * 2. If Cloudflare itself can't be reached, the check reports "unreachable"
 *    and the caller also lets it through. A Cloudflare outage costing Owen
 *    a co-op enquiry is a worse failure than one spam email arriving, and
 *    the honeypot is still standing either way.
 *
 * Everything else (missing token, forged token, replayed token) is a hard
 * rejection.
 */
const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** How long to wait on Cloudflare before giving up and letting it through. */
const TIMEOUT_MS = 5_000;

export type TurnstileResult =
  | { ok: true }
  | {
      ok: false;
      /**
       * unconfigured: no secret set, the check didn't run.
       * missing:      enforcement is on and the form sent no token.
       * rejected:     Cloudflare said no.
       * unreachable:  Cloudflare didn't answer in time.
       */
      reason: "unconfigured" | "missing" | "rejected" | "unreachable";
      codes?: string[];
    };

type SiteverifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstile(
  token: FormDataEntryValue | null | undefined,
  remoteip?: string,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: false, reason: "unconfigured" };

  if (typeof token !== "string" || !token.trim()) {
    return { ok: false, reason: "missing" };
  }

  const body = new URLSearchParams({ secret, response: token });
  // Cloudflare treats this as advisory; it sharpens the score when present.
  if (remoteip) body.set("remoteip", remoteip);

  let data: SiteverifyResponse;
  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return { ok: false, reason: "unreachable" };
    data = (await res.json()) as SiteverifyResponse;
  } catch {
    return { ok: false, reason: "unreachable" };
  }

  if (data.success) return { ok: true };
  return {
    ok: false,
    reason: "rejected",
    codes: data["error-codes"] ?? [],
  };
}

/**
 * Whether a result should stop the message. Kept next to the verifier so
 * the fail-open cases are stated once and can be tested directly.
 */
export function shouldBlock(result: TurnstileResult): boolean {
  if (result.ok) return false;
  return result.reason === "missing" || result.reason === "rejected";
}
