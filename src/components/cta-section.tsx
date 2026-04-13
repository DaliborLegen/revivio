"use client";

import { useLang } from "@/lib/lang-context";
import { ArrowRight, Sparkles } from "lucide-react";

export function CtaSection() {
  const { t } = useLang();

  return (
    <section id="cta" className="scroll-mt-20 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="noise-bg relative overflow-hidden rounded-3xl border border-[#d4a054]/15 bg-gradient-to-br from-[#1c1a17] via-[#161412] to-[#1c1a17] px-8 py-20 text-center sm:px-16">
          {/* Ambient glows */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-[400px] w-[400px] rounded-full bg-[#d4a054]/10 blur-[100px]" />
          </div>
          <div className="pointer-events-none absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3">
            <div className="h-[300px] w-[300px] rounded-full bg-[#a67830]/8 blur-[80px]" />
          </div>

          {/* Decorative corner accents */}
          <div className="pointer-events-none absolute top-6 left-6 h-12 w-px bg-gradient-to-b from-[#d4a054]/30 to-transparent" />
          <div className="pointer-events-none absolute top-6 left-6 h-px w-12 bg-gradient-to-r from-[#d4a054]/30 to-transparent" />
          <div className="pointer-events-none absolute right-6 bottom-6 h-12 w-px bg-gradient-to-t from-[#d4a054]/30 to-transparent" />
          <div className="pointer-events-none absolute right-6 bottom-6 h-px w-12 bg-gradient-to-l from-[#d4a054]/30 to-transparent" />

          <div className="relative">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#d4a054]/20 bg-[#d4a054]/8 px-5 py-2 text-sm font-medium text-[#d4a054]">
              <Sparkles className="size-4" />
              Revivio AI
            </div>
            <h2 className="font-display text-4xl font-semibold text-[#f0ebe4] sm:text-5xl">
              {t.cta.title}
            </h2>
            <p className="mt-5 text-lg text-[#8a8279]">
              {t.cta.subtitle}
            </p>
            <div className="mt-10">
              <a href="/restore">
                <button className="group relative h-14 overflow-hidden rounded-full bg-gradient-to-r from-[#d4a054] to-[#a67830] px-10 text-base font-semibold text-[#0e0d0b] shadow-[0_0_50px_rgba(212,160,84,0.3)] transition-all hover:shadow-[0_0_70px_rgba(212,160,84,0.4)] hover:brightness-110 active:scale-[0.97]">
                  <span className="relative z-10 flex items-center gap-2">
                    {t.cta.button}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
