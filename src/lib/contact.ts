import { z } from "zod";

/**
 * The contact form's shape, shared by the server action and its tests.
 * `company` is the honeypot: humans never see it, bots fill it.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Tell me who you are").max(200),
  email: z.string().trim().email("That email doesn't look right").max(320),
  topic: z.enum(["Co-op or internship", "A website", "Something else"]),
  message: z.string().trim().min(1, "The message is empty").max(5000),
  company: z.literal("").optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
