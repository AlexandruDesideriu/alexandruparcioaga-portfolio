import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const familjen = localFont({
  src: [
    { path: "../../public/fonts/FamiljenGrotesk-400.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/FamiljenGrotesk-500.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/FamiljenGrotesk-600.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/FamiljenGrotesk-700.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-familjen",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alexandruparcioaga.com"),
  title: "Alexandru Parcioaga — Product. Creative. Human.",
  description:
    "Portfolio of Alexandru Parcioaga — product designer and creative developer based in Calgary, Alberta. Product, creative, and human-centred work.",
  keywords: [
    "Alexandru Parcioaga",
    "product design",
    "creative developer",
    "portfolio",
    "Calgary",
  ],
  openGraph: {
    title: "Alexandru Parcioaga — Product. Creative. Human.",
    description:
      "Product designer and creative developer based in Calgary, Alberta.",
    url: "/",
    siteName: "Alexandru Parcioaga",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexandru Parcioaga — Product. Creative. Human.",
    description:
      "Product designer and creative developer based in Calgary, Alberta.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f2ec",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={familjen.variable}>
      <body>{children}</body>
    </html>
  );
}
