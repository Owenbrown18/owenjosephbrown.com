import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
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
    "Software engineering student at UVic and founder of OBdesign. I build and ship production software for real businesses: nine live client sites, an iOS app, and the pipeline that finds the clients.",
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
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-bg focus:px-4 focus:py-2 focus:text-fg"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
