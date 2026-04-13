"use client";

import { LangProvider } from "@/lib/lang-context";
import { Navbar } from "@/components/navbar";
import { Pricing } from "@/components/pricing";
import { Footer } from "@/components/footer";

export default function PricingPage() {
  return (
    <LangProvider>
      <Navbar />
      <main className="pt-16">
        <Pricing />
      </main>
      <Footer />
    </LangProvider>
  );
}
