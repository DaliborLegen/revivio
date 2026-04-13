"use client";

import { useLang } from "@/lib/lang-context";
import { Upload, Cpu, Download } from "lucide-react";

const stepIcons = [Upload, Cpu, Download];

export function HowItWorks() {
  const { t } = useLang();

  return (
    <section id="how-it-works" className="noise-bg relative scroll-mt-20 py-28">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[#141210]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0e0d0b] via-transparent to-[#0e0d0b]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#d4a054]">
            {t.howItWorks.title}
          </p>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-[#f0ebe4] sm:text-5xl">
            {t.howItWorks.title}
          </h2>
          <p className="mt-4 text-lg text-[#8a8279]">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="mt-20 grid gap-12 sm:grid-cols-3 sm:gap-8">
          {t.howItWorks.steps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <div key={i} className="relative flex flex-col items-center text-center">
                {/* Connector line */}
                {i < 2 && (
                  <div className="absolute top-10 left-[calc(50%+48px)] hidden h-px w-[calc(100%-96px)] sm:block">
                    <div className="h-full w-full bg-gradient-to-r from-[#d4a054]/30 to-[#d4a054]/10" />
                    {/* Animated dot */}
                    <div className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4a054] glow-pulse" />
                  </div>
                )}

                {/* Step number + icon */}
                <div className="relative mb-8">
                  <div className="flex size-20 items-center justify-center rounded-2xl border border-[#d4a054]/15 bg-gradient-to-br from-[#d4a054]/10 to-transparent text-[#d4a054] shadow-[0_0_40px_rgba(212,160,84,0.08)]">
                    <Icon className="size-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full border-2 border-[#0e0d0b] bg-[#d4a054] text-xs font-bold text-[#0e0d0b]">
                    {step.step}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-[#f0ebe4]">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#8a8279]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
