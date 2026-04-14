"use client";

import { LangProvider } from "@/lib/lang-context";
import { CursorGlow } from "@/components/cursor-glow";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Gallery } from "@/components/gallery";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { Pricing } from "@/components/pricing";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <LangProvider>
      <CursorGlow />
      <Navbar />
      <Hero />
      <Gallery />
      <Features />
      <HowItWorks />
      <Testimonials />
      <div id="pricing">
        <Pricing />
      </div>
      <CtaSection />
      <Footer />
    </LangProvider>
  );
}
