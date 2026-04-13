"use client";

import { LangProvider } from "@/lib/lang-context";
import { RestoreApp } from "@/components/restore-app";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function RestorePage() {
  return (
    <LangProvider>
      <Navbar />
      <RestoreApp />
      <Footer />
    </LangProvider>
  );
}
