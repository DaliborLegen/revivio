"use client";

import { useLang } from "@/lib/lang-context";
import { ArrowRight, Play, Sparkles, Image, Zap, Shield } from "lucide-react";
import { BeforeAfterSlider } from "./before-after-slider";

export function Hero() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden pt-18">
      {/* Deep ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4">
          <div className="h-[800px] w-[800px] rounded-full bg-[#d4a054]/8 blur-[120px]" />
        </div>
        <div className="absolute top-1/3 -left-1/4">
          <div className="h-[400px] w-[400px] rounded-full bg-[#a67830]/6 blur-[100px]" />
        </div>
        <div className="absolute top-1/4 -right-1/4">
          <div className="h-[500px] w-[500px] rounded-full bg-[#d4a054]/5 blur-[120px]" />
        </div>
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="hero-particle absolute top-[12%] left-[8%] size-1.5 rounded-full bg-[#d4a054]/40" />
        <div className="hero-particle-slow absolute top-[20%] right-[12%] size-1 rounded-full bg-[#d4a054]/30" />
        <div className="hero-particle absolute top-[55%] left-[18%] size-1 rounded-full bg-[#d4a054]/20" />
        <div className="hero-particle-slow absolute top-[40%] right-[22%] size-2 rounded-full bg-[#d4a054]/25" />
        <div className="hero-particle absolute top-[70%] left-[65%] size-1.5 rounded-full bg-[#a67830]/30" />
      </div>

      {/* Decorative grid lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.03]">
        <div className="absolute top-0 left-1/4 h-full w-px bg-[#d4a054]" />
        <div className="absolute top-0 left-2/4 h-full w-px bg-[#d4a054]" />
        <div className="absolute top-0 left-3/4 h-full w-px bg-[#d4a054]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-24 lg:pt-36 lg:pb-32">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="hero-fade-in mb-10 inline-flex items-center gap-2.5 rounded-full border border-[#d4a054]/20 bg-[#d4a054]/5 px-5 py-2 text-sm font-medium text-[#d4a054] backdrop-blur-sm">
            <Sparkles className="size-4" />
            {t.hero.badge}
          </div>

          {/* Title — editorial serif */}
          <h1
            className="hero-fade-in font-display max-w-4xl text-5xl font-semibold leading-[1.1] tracking-tight text-[#f0ebe4] sm:text-6xl lg:text-7xl xl:text-8xl"
            style={{ animationDelay: "0.15s" }}
          >
            {t.hero.title.split("\n").map((line, i) => (
              <span key={i}>
                {i === 1 ? (
                  <span className="text-shimmer">{line}</span>
                ) : (
                  line
                )}
                {i === 0 && <br />}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p
            className="hero-fade-in mt-8 max-w-xl text-lg leading-relaxed text-[#8a8279]"
            style={{ animationDelay: "0.3s" }}
          >
            {t.hero.subtitle}
          </p>

          {/* CTA buttons */}
          <div
            className="hero-fade-in mt-12 flex flex-col gap-4 sm:flex-row"
            style={{ animationDelay: "0.45s" }}
          >
            <a href="/restore">
              <button className="group relative h-14 overflow-hidden rounded-full bg-gradient-to-r from-[#d4a054] to-[#a67830] px-8 text-base font-semibold text-[#0e0d0b] shadow-[0_0_40px_rgba(212,160,84,0.25)] transition-all hover:shadow-[0_0_60px_rgba(212,160,84,0.35)] hover:brightness-110 active:scale-[0.97]">
                <span className="relative z-10 flex items-center gap-2">
                  {t.hero.cta}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            </a>
            <a href="#how-it-works">
              <button className="flex h-14 items-center gap-2 rounded-full border border-[#d4a054]/20 px-8 text-base font-medium text-[#f0ebe4] transition-all hover:border-[#d4a054]/40 hover:bg-[#d4a054]/5">
                <Play className="size-4 text-[#d4a054]" />
                {t.hero.ctaSecondary}
              </button>
            </a>
          </div>

          {/* Before/After interactive slider */}
          <div
            className="hero-fade-in mt-20 w-full max-w-3xl"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="relative">
              {/* Ambient glow behind the card */}
              <div className="absolute -inset-8 rounded-3xl bg-[#d4a054]/6 blur-3xl" />
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-[#d4a054]/20 via-[#d4a054]/5 to-transparent" />

              <BeforeAfterSlider
                beforeSvg={
                  <div className="absolute inset-0">
                    <img src="/examples/old1.jpg" alt="Before" className="h-full w-full object-cover" />
                  </div>
                }
                afterSvg={
                  <div className="absolute inset-0">
                    <img src="/examples/restored1.jpg" alt="After" className="h-full w-full object-cover" />
                  </div>
                }
                beforeLabel="Original"
                afterLabel="Revivio AI"
                className="relative border border-[#d4a054]/15 shadow-2xl shadow-black/40"
              />
            </div>
          </div>

          {/* Decorative gold line */}
          <div
            className="hero-fade-in mt-16 w-full max-w-md"
            style={{ animationDelay: "0.75s" }}
          >
            <div className="gold-line" />
          </div>

          {/* Stats */}
          <div
            className="hero-fade-in mt-12 grid w-full max-w-2xl grid-cols-2 gap-8 sm:grid-cols-4"
            style={{ animationDelay: "0.85s" }}
          >
            {[
              { icon: Image, value: "10K+", label: t.stats.photosRestored },
              { icon: Zap, value: "<30", label: t.stats.seconds },
              { icon: Sparkles, value: "98%", label: t.stats.satisfaction },
              { icon: Shield, value: t.stats.privacyValue, label: t.stats.privacy },
            ].map((stat, i) => (
              <div
                key={i}
                className="group flex flex-col items-center transition-all hover:scale-105"
              >
                <div className="flex items-center gap-2 text-2xl font-bold text-[#f0ebe4]">
                  <stat.icon className="size-5 text-[#d4a054] transition-transform group-hover:rotate-12" />
                  {stat.value}
                </div>
                <span className="mt-1.5 text-xs font-medium uppercase tracking-widest text-[#8a8279]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
