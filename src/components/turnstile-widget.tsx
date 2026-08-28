"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The Cloudflare Turnstile widget, loaded late on purpose.
 *
 * The contact form sits at the foot of the landing page, so pulling a
 * third-party script at load would tax every visit for a thing almost
 * nobody scrolls to. The script is fetched the first time the form comes
 * near the viewport instead, which keeps the landing page's own budget
 * intact and still gives the token several seconds to arrive while the
 * visitor is typing.
 *
 * The token is held in React state and written to a hidden input we own
 * (response-field is off) so a re-render can't drop a node Turnstile
 * injected behind React's back.
 */

type TurnstileOptions = {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
  "timeout-callback"?: () => void;
  "before-interactive-callback"?: () => void;
  "response-field"?: boolean;
};

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: TurnstileOptions) => string | undefined;
      remove: (id: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

const SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** One shared load per document, however many widgets ask for it. */
let scriptPromise: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SRC}"]`,
    );
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("blocked")), {
      once: true,
    });
    if (!existing) {
      script.src = SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }).catch((err) => {
    // Let a later mount try again rather than caching the failure.
    scriptPromise = null;
    throw err;
  });

  return scriptPromise;
}

/**
 * idle/ready: mounted, Cloudflare is deciding, usually a second or two.
 * interactive: it decided to ask, and there is a checkbox waiting on a
 *   click. The send button has to say so, or the visitor watches a
 *   disabled button forever wondering what it is waiting for.
 * solved: token in hand. failed: it will never arrive.
 */
export type TurnstileStatus =
  | "idle"
  | "ready"
  | "interactive"
  | "solved"
  | "failed";

export function TurnstileWidget({
  siteKey,
  onStatusChange,
}: {
  siteKey: string;
  onStatusChange?: (status: TurnstileStatus) => void;
}) {
  const holder = useRef<HTMLDivElement | null>(null);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<TurnstileStatus>("idle");

  // Keep the callback in a ref so re-renders of the parent don't re-run
  // the mount effect and render a second widget.
  const notify = useRef(onStatusChange);
  useEffect(() => {
    notify.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    notify.current?.(status);
  }, [status]);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;

    let widgetId: string | undefined;
    let cancelled = false;

    const mount = () => {
      loadTurnstile()
        .then(() => {
          if (cancelled || !window.turnstile || !holder.current) return;
          widgetId = window.turnstile.render(holder.current, {
            sitekey: siteKey,
            // The page is ink-on-paper, whatever the class names say.
            theme: "light",
            "response-field": false,
            callback: (t) => {
              setToken(t);
              setStatus("solved");
            },
            "error-callback": () => {
              setToken("");
              setStatus("failed");
            },
            "expired-callback": () => {
              setToken("");
              setStatus("ready");
            },
            "timeout-callback": () => {
              setToken("");
              setStatus("ready");
            },
            "before-interactive-callback": () => {
              setStatus((cur) => (cur === "solved" ? cur : "interactive"));
            },
          });
          if (!cancelled)
            setStatus((s) =>
              s === "solved" || s === "interactive" ? s : "ready",
            );
        })
        .catch(() => {
          if (!cancelled) setStatus("failed");
        });
    };

    // Reduced-motion users and everyone else alike: load on approach, not
    // on page load. IntersectionObserver is the same trigger the reveals
    // use, so there's one scroll mechanism in the codebase.
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        mount();
      },
      { rootMargin: "200px 0px", threshold: 0 },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch {
          // Already gone with the unmounted subtree.
        }
      }
    };
  }, [siteKey]);

  return (
    <div className="mt-5">
      <div ref={holder} data-testid="turnstile" />
      <input type="hidden" name="cf-turnstile-response" value={token} />
      {status === "failed" && (
        <p className="mt-2 text-sm text-fg-muted">
          The spam check couldn’t load, so the form is blocked. Email me
          directly instead.
        </p>
      )}
    </div>
  );
}
