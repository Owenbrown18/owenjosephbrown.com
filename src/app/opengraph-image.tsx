import { OG_SIZE } from "@/lib/og";
import { ogHomeCard } from "@/lib/og-home";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt =
  "Owen Brown, software engineering student, beside three things he built: the Grain Construction and Figs & Honey websites and the grain iOS app.";

export default function Image() {
  return ogHomeCard();
}
