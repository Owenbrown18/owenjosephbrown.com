import { ogCard, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "OBdesign: 10+ production websites for BC businesses.";

export default function Image() {
  return ogCard({
    eyebrow: "Web development",
    // The wordmark, in its own face, as the brand spec requires.
    wordmark: true,
    title: "OBdesign.",
    subtitle:
      "10+ production websites for BC businesses. Custom-coded, client-editable, found by a pipeline I wrote.",
  });
}
