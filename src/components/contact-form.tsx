"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "@/app/contact-action";

const initial: ContactState = { status: "idle" };

const field =
  "w-full border border-white/20 bg-white/[0.03] px-3.5 py-2.5 text-sm " +
  "text-white placeholder:text-white/35 transition-colors " +
  "focus:border-sage focus:outline-none";

/**
 * The contact form. Square fields on the paper, one topic select so a
 * message arrives sorted, and honest states: sending, sent, or a failure
 * that hands over the direct address instead of shrugging.
 */
export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initial);

  if (state.status === "sent") {
    return (
      <div className="border border-sage/40 bg-sage/10 px-6 py-8 text-center">
        <p className="font-display text-xl font-bold text-white">
          Got it. Thanks!
        </p>
        <p className="mt-2 text-sm text-white/70">
          Your message is in my inbox — I read every one, and I’ll get back to
          you soon.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block font-mono text-[0.68rem] uppercase tracking-[0.12em] text-white/50">
            Name
          </span>
          <input name="name" required maxLength={200} className={field} />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[0.68rem] uppercase tracking-[0.12em] text-white/50">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            maxLength={320}
            className={field}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block font-mono text-[0.68rem] uppercase tracking-[0.12em] text-white/50">
          What’s this about?
        </span>
        <select name="topic" required className={field} defaultValue="">
          <option value="" disabled>
            Pick one
          </option>
          <option>Co-op or internship</option>
          <option>A website</option>
          <option>Something else</option>
        </select>
      </label>

      <label className="mt-4 block">
        <span className="mb-1.5 block font-mono text-[0.68rem] uppercase tracking-[0.12em] text-white/50">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={5}
          maxLength={5000}
          className={field}
        />
      </label>

      {/* Honeypot: humans never see it, bots fill it. */}
      <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === "error" && (
        <p role="alert" className="mt-4 border border-amber-700/40 bg-amber-500/10 px-3.5 py-2.5 text-sm text-amber-900">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex items-center gap-2 bg-white px-7 py-3 text-xs font-bold uppercase tracking-[0.06em] text-[var(--bg)] transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send it"}
      </button>
    </form>
  );
}
