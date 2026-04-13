import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
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
  title: "Revivio — AI restavracija fotografij",
  description:
    "Oživite stare, poškodovane in zbledele fotografije s pomočjo umetne inteligence. Barvanje, HD izboljšava, odstranjevanje prask in več.",
  keywords: [
    "restavracija fotografij",
    "AI",
    "stare fotografije",
    "barvanje",
    "photo restoration",
  ],
  openGraph: {
    title: "Revivio — AI restavracija fotografij",
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
      className={`${outfit.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
