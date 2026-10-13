"use client";

import { useEffect, useState } from "react";

// Google Analytics se naloži ŠELE po kliku "Sprejmi". Brez soglasja stran ne kontaktira Googla.
// Soglasje se prekliče z gumbom "Nastavitve piškotkov" v nogi (dogodek "odpri-piskotke").
const KEY = "cookie-consent";
const GA_ID = "G-HHV4P88VM5";

function loadGa() {
  if (document.getElementById("ga-src")) return;
  const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA_ID);
  const s = document.createElement("script");
  s.id = "ga-src";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let v: string | null = null;
    try {
      v = localStorage.getItem(KEY);
    } catch {}
    if (v === "granted") loadGa();
    else if (v !== "denied") setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener("odpri-piskotke", reopen);
    return () => window.removeEventListener("odpri-piskotke", reopen);
  }, []);

  function choose(v: "granted" | "denied") {
    try {
      localStorage.setItem(KEY, v);
    } catch {}
    setOpen(false);
    if (v === "granted") loadGa();
    if (v === "denied" && document.getElementById("ga-src")) {
      document.cookie.split(";").forEach((c) => {
        const n = c.split("=")[0].trim();
        if (n.startsWith("_ga")) document.cookie = `${n}=; Max-Age=0; path=/; domain=.${location.hostname.replace(/^www\./, "")}`;
      });
      location.reload();
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Piškotki"
      className="fixed bottom-4 left-4 right-4 z-[70] max-w-[420px] rounded-2xl border border-[#d4a054]/20 bg-[#161412] p-5 text-[#f0ebe4] shadow-2xl"
    >
      <p className="text-sm leading-relaxed text-[#b8afa4]">
        Z vašim dovoljenjem uporabljamo analitične piškotke (Google Analytics), da vidimo, kako obiskovalci uporabljajo stran. Brez soglasja jih ne naložimo. Več v{" "}
        <a href="/zasebnost" className="text-[#d4a054] underline underline-offset-2">
          politiki zasebnosti
        </a>
        .
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => choose("granted")}
          className="cursor-pointer rounded-full bg-gradient-to-r from-[#d4a054] to-[#a67830] px-5 py-2.5 text-sm font-semibold text-[#0e0d0b]"
        >
          Sprejmi
        </button>
        <button
          type="button"
          onClick={() => choose("denied")}
          className="cursor-pointer rounded-full border border-[#d4a054]/25 px-5 py-2.5 text-sm font-semibold text-[#f0ebe4] hover:border-[#d4a054]/50"
        >
          Zavrni
        </button>
      </div>
    </div>
  );
}

export function CookieSettingsButton({ className, label = "Nastavitve piškotkov" }: { className?: string; label?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("odpri-piskotke"))}>
      {label}
    </button>
  );
}
