"use client";

import { LangProvider } from "@/lib/lang-context";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Gallery } from "@/components/gallery";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <LangProvider>
      <Navbar />
      <Hero />
      <Gallery />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CtaSection />
      <Footer />
    </LangProvider>
  );
}
