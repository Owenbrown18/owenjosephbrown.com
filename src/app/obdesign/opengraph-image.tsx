import { ogCard, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "OBdesign: nine production websites for BC businesses.";

export default function Image() {
  return ogCard({
    title: "OBdesign, the studio.",
    subtitle:
      "Nine production websites for BC businesses. Custom-coded, client-editable, found by a pipeline I wrote.",
  });
}
