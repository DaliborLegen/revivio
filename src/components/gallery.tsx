"use client";

import { useLang } from "@/lib/lang-context";
import { Palette, Eraser, ScanEye } from "lucide-react";
import { BeforeAfterSlider } from "./before-after-slider";

const icons = [Palette, Eraser, ScanEye];

export function Gallery() {
  const { t, lang } = useLang();

  const cards =
    lang === "sl"
      ? [
          { title: "Barvanje", desc: "Stare črno-bele fotografije oživljene z naravnimi barvami" },
          { title: "Barvanje portretov", desc: "Družinske fotografije oživljene z naravnimi barvami oblačil in kože" },
          { title: "HD izboljšava", desc: "Zbledele fotografije stavb obnovljene v polni ločljivosti" },
        ]
      : [
          { title: "Colorization", desc: "Old black-and-white photos brought to life with natural colors" },
          { title: "Portrait Colorization", desc: "Family photos brought to life with natural skin tones and clothing colors" },
          { title: "HD Enhancement", desc: "Faded building photos restored to full resolution" },
        ];

  const beforeAfters = [
    { before: "/examples/old1.jpg", after: "/examples/restored1.jpg" },
    { before: "/examples/old3.jpg", after: "/examples/restored3.jpg" },
    { before: "/examples/old4.jpg", after: "/examples/restored4.jpg" },
  ];

  const sectionTitle = lang === "sl" ? "Primeri obnov" : "Restoration examples";
  const sectionSubtitle =
    lang === "sl"
      ? "Poglejte kako Revivio AI obnovi vaše fotografije."
      : "See how Revivio AI transforms your photographs.";

  return (
    <section className="relative scroll-mt-20 py-28">
      {/* Section ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[600px] w-[600px] rounded-full bg-[#d4a054]/4 blur-[150px]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#d4a054]">
            {lang === "sl" ? "Galerija" : "Gallery"}
          </p>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-[#f0ebe4] sm:text-5xl">
            {sectionTitle}
          </h2>
          <p className="mt-4 text-lg text-[#8a8279]">{sectionSubtitle}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {cards.map((card, i) => {
            const Icon = icons[i];
            const ba = beforeAfters[i];
            return (
              <div
                key={i}
                className="gallery-card card-hover group overflow-hidden rounded-2xl border border-[#d4a054]/8 bg-[#161412]"
              >
                {/* Before/After slider */}
                <BeforeAfterSlider
                  beforeSvg={
                    <div className="absolute inset-0 bg-[#1c1a17]">
                      <img src={ba.before} alt="Before" className="h-full w-full object-cover" />
                    </div>
                  }
                  afterSvg={
                    <div className="absolute inset-0 bg-[#141210]">
                      <img src={ba.after} alt="After" className="h-full w-full object-cover" />
                    </div>
                  }
                  beforeLabel="Before"
                  afterLabel="After"
                  className="aspect-[4/3]"
                />

                {/* Card text */}
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#d4a054]/8 transition-colors group-hover:bg-[#d4a054]/15">
                      <Icon className="size-5 text-[#d4a054]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#f0ebe4]">{card.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#8a8279]">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
