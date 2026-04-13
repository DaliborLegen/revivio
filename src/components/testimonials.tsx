"use client";

import { useLang } from "@/lib/lang-context";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  const { t } = useLang();

  return (
    <section id="testimonials" className="relative scroll-mt-20 py-28">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[500px] w-[700px] rounded-full bg-[#d4a054]/3 blur-[150px]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#d4a054]">
            {t.testimonials.title}
          </p>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-[#f0ebe4] sm:text-5xl">
            {t.testimonials.title}
          </h2>
          <p className="mt-4 text-lg text-[#8a8279]">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Gold separator */}
        <div className="mx-auto mt-10 mb-16 w-16">
          <div className="gold-line" />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {t.testimonials.items.map((item, i) => (
            <div
              key={i}
              className="card-hover group relative overflow-hidden rounded-2xl border border-[#d4a054]/8 bg-[#161412] p-7"
            >
              {/* Quote mark */}
              <div className="mb-5">
                <Quote className="size-8 text-[#d4a054]/20 transition-colors group-hover:text-[#d4a054]/40" />
              </div>

              {/* Stars */}
              <div className="mb-5 flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="size-4 fill-[#d4a054] text-[#d4a054]" />
                ))}
              </div>

              <p className="text-sm leading-relaxed text-[#c4bdb4] italic">
                &ldquo;{item.text}&rdquo;
              </p>

              {/* Divider */}
              <div className="my-6 h-px bg-gradient-to-r from-[#d4a054]/15 via-[#d4a054]/5 to-transparent" />

              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-[#d4a054] to-[#a67830] text-sm font-bold text-[#0e0d0b] shadow-lg shadow-[#d4a054]/20">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#f0ebe4]">
                    {item.name}
                  </div>
                  <div className="text-xs text-[#8a8279]">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
