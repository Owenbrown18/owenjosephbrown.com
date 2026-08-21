"use server";

import { Resend } from "resend";
import { contactSchema } from "@/lib/contact";
import { identity } from "@/lib/resume-data";

export type ContactState = {
  status: "idle" | "sent" | "error";
  message?: string;
};

/**
 * Sends the contact form to Owen's inbox through Resend, from the studio
 * domain that's already verified there. Degrades honestly: with no key
 * configured the visitor is told to email directly instead of watching a
 * form pretend to work.
 */
export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    topic: formData.get("topic"),
    message: formData.get("message"),
    company: formData.get("company") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Something's missing.",
    };
  }
  // Honeypot filled: claim success and send nothing.
  if (formData.get("company")) return { status: "sent" };

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return {
      status: "error",
      message: `The form isn't wired up right now — email me at ${identity.email}.`,
    };
  }

  const { name, email, topic, message } = parsed.data;
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: "Owen Brown <portfolio@obwebdesign.ca>",
    to: identity.email,
    replyTo: `${name} <${email}>`,
    subject: `[portfolio] ${topic} — ${name}`,
    text: `${message}\n\n— ${name}\n${email}`,
  });

  if (error) {
    console.error("contact form send failed:", error);
    return {
      status: "error",
      message: `That didn't send. Email me directly at ${identity.email}.`,
    };
  }
  return { status: "sent" };
}
