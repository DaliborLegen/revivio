"use client";

import { LangProvider, useLang } from "@/lib/lang-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CheckCircle2, ArrowRight } from "lucide-react";

function SuccessContent() {
  const { t } = useLang();
  const c = t.checkout;

  return (
    <main className="flex-1 pt-28 pb-20">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
          <div className="h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[150px]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-lg px-4 text-center sm:px-6">
        <div className="mb-8 inline-flex size-24 items-center justify-center rounded-3xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
          <CheckCircle2 className="size-12 text-emerald-400" />
        </div>

        <h1 className="font-display text-4xl font-semibold tracking-tight text-[#f0ebe4]">
          {c.successTitle}
        </h1>
        <p className="mt-4 text-lg text-[#8a8279]">{c.successSubtitle}</p>

        <a href="/restore" className="mt-10 inline-block">
          <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d4a054] to-[#a67830] px-8 py-3.5 text-sm font-semibold text-[#0e0d0b] shadow-[0_0_40px_rgba(212,160,84,0.2)] transition-all hover:shadow-[0_0_60px_rgba(212,160,84,0.3)] hover:brightness-110">
            {c.successButton}
            <ArrowRight className="size-4" />
          </button>
        </a>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <LangProvider>
      <Navbar />
      <SuccessContent />
      <Footer />
    </LangProvider>
  );
}
