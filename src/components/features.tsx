"use client";

import { useLang } from "@/lib/lang-context";
import { ImagePlus, Palette, ScanEye, Eraser, Sun, Printer } from "lucide-react";

const icons = [ImagePlus, Palette, ScanEye, Eraser, Sun, Printer];

export function Features() {
  const { t } = useLang();

  return (
    <section id="features" className="relative scroll-mt-20 py-28">
      {/* Subtle background texture */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#d4a054]/[0.02] to-transparent" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#d4a054]">
            {t.features.title}
          </p>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-[#f0ebe4] sm:text-5xl">
            {t.features.title}
          </h2>
          <p className="mt-4 text-lg text-[#8a8279]">
            {t.features.subtitle}
          </p>
        </div>

        {/* Gold separator */}
        <div className="mx-auto mt-10 mb-16 w-16">
          <div className="gold-line" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((feature, i) => {
            const Icon = icons[i];
            return (
              <div
                key={i}
                className="card-hover group relative overflow-hidden rounded-2xl border border-[#d4a054]/8 bg-[#161412] p-7"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute -top-20 -right-20 size-40 rounded-full bg-[#d4a054]/0 blur-3xl transition-all duration-700 group-hover:bg-[#d4a054]/5" />

                <div className="relative">
                  <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d4a054]/10 to-[#d4a054]/5 text-[#d4a054] ring-1 ring-[#d4a054]/10 transition-all group-hover:from-[#d4a054]/15 group-hover:to-[#d4a054]/8 group-hover:ring-[#d4a054]/20">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#f0ebe4]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#8a8279]">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
