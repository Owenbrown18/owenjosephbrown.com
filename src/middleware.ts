import { NextRequest, NextResponse } from "next/server";

/**
 * `curl owenjosephbrown.com` gets the resume as ANSI text.
 * Browsers are untouched; only terminal user agents hitting the
 * root are rewritten.
 */
const TERMINAL_UA = /\b(curl|wget|httpie|libcurl|lynx)\b/i;

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  if (TERMINAL_UA.test(ua)) {
    return NextResponse.rewrite(new URL("/ascii", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
