import type { Metadata } from "next";
import { Bricolage_Grotesque, Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Atmosphere } from "@/components/atmosphere";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  // opsz stays: dropping it changes the glyph widths enough to wrap the
  // hero name onto two lines. wdth is genuinely unused, so it goes.
  axes: ["opsz"],
  variable: "--font-bricolage",
  display: "swap",
});

// Fraunces exists here for exactly one job: the OBdesign wordmark, which
// per brand spec is never set in another face.
// Fraunces exists for exactly one word, the OBdesign wordmark. A variable
// axis costs ~128KB for that; a single static weight is a fraction of it.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://owenjosephbrown.com"),
  title: {
    default: "Owen Brown — software engineer",
    template: "%s — Owen Brown",
  },
  description:
    "I'm a software engineering student at UVic and I run a small web studio called OBdesign. I've built and shipped over ten client sites, an iOS app, and the Python pipeline that finds the clients.",
  authors: [{ name: "Owen Brown", url: "https://owenjosephbrown.com" }],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://owenjosephbrown.com",
    siteName: "Owen Brown",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${fraunces.variable} ${inter.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-bg focus:px-4 focus:py-2 focus:text-fg"
        >
          Skip to content
        </a>
        <Atmosphere />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
