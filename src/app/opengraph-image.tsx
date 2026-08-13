import { ogCard, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt =
  "Owen Brown, software engineer: real products, real clients, real code.";

export default function Image() {
  return ogCard({
    title: "I build software people actually use.",
    subtitle:
      "UVic software engineering student. Nine production client sites, an iOS app, and the pipeline that finds the clients.",
  });
}
