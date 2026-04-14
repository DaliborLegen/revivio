"use client";

import { LangProvider, useLang } from "@/lib/lang-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { XCircle, ArrowLeft } from "lucide-react";

function CancelContent() {
  const { t } = useLang();
  const c = t.checkout;

  return (
    <main className="flex-1 pt-28 pb-20">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
          <div className="h-[600px] w-[600px] rounded-full bg-[#d4a054]/5 blur-[150px]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-lg px-4 text-center sm:px-6">
        <div className="mb-8 inline-flex size-24 items-center justify-center rounded-3xl bg-[#d4a054]/10 ring-1 ring-[#d4a054]/20">
          <XCircle className="size-12 text-[#d4a054]" />
        </div>

        <h1 className="font-display text-4xl font-semibold tracking-tight text-[#f0ebe4]">
          {c.cancelTitle}
        </h1>
        <p className="mt-4 text-lg text-[#8a8279]">{c.cancelSubtitle}</p>

        <a href="/pricing" className="mt-10 inline-block">
          <button className="inline-flex items-center gap-2 rounded-full border border-[#d4a054]/15 px-8 py-3.5 text-sm font-medium text-[#8a8279] transition-all hover:border-[#d4a054]/30 hover:text-[#f0ebe4]">
            <ArrowLeft className="size-4" />
            {c.cancelButton}
          </button>
        </a>
      </div>
    </main>
  );
}

export default function CheckoutCancelPage() {
  return (
    <LangProvider>
      <Navbar />
      <CancelContent />
      <Footer />
    </LangProvider>
  );
}
