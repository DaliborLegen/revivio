import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Revivio — AI obnova fotografij",
  description:
    "Oživite stare, poškodovane in zbledele fotografije s pomočjo umetne inteligence. Barvanje, HD izboljšava, odstranjevanje prask in več.",
  keywords: [
    "obnova fotografij",
    "AI",
    "stare fotografije",
    "barvanje",
    "photo restoration",
  ],
  openGraph: {
    title: "Revivio — AI obnova fotografij",
    description: "Oživite stare spomine s pomočjo umetne inteligence.",
    url: "https://revivio.si",
    siteName: "Revivio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sl"
      className={`${outfit.variable} ${cormorant.variable} h-full antialiased light`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HHV4P88VM5"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-HHV4P88VM5');`}
        </Script>
        {children}
      </body>
    </html>
  );
}
