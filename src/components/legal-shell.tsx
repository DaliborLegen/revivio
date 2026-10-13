"use client";

import { LangProvider } from "@/lib/lang-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function LegalShell({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <LangProvider>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 text-[15.5px] leading-relaxed text-[#b8afa4] [&_a]:text-[#d4a054] [&_b]:text-foreground [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">
        <h1 className="font-display text-4xl font-bold text-[#f0ebe4] sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-[#6a6259]">Velja od {updated}</p>
        <div className="mt-8">{children}</div>
      </main>
      <Footer />
    </LangProvider>
  );
}
