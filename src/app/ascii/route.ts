import { renderAsciiResume } from "@/lib/ascii";

export function GET(request: Request) {
  const url = new URL(request.url);
  const color = url.searchParams.get("plain") === null;
  return new Response(renderAsciiResume({ color }), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
