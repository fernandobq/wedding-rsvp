import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Cormorant_Garamond,
  EB_Garamond,
  Pinyon_Script,
  Tenor_Sans,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pinyon = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pinyon",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const ebGaramond = EB_Garamond({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-ebgaramond",
});

const tenor = Tenor_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tenor",
});

// Resolve the public site URL for absolute metadata (og:image) URLs. Prefer an
// explicit SITE_URL, then fall back to the URLs Netlify injects at build time,
// and finally localhost for local dev. Without an absolute URL, social
// crawlers (WhatsApp, Facebook, etc.) can't fetch the preview image.
const siteUrl =
  process.env.SITE_URL ??
  process.env.URL ??
  process.env.DEPLOY_PRIME_URL ??
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Boda de L&F",
  description: "Te invitamos a nuestra boda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${pinyon.variable} ${cormorant.variable} ${ebGaramond.variable} ${tenor.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
