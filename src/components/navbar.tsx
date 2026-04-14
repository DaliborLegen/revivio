"use client";

import { useLang } from "@/lib/lang-context";
import { createClient } from "@/lib/supabase";
import { Camera, Globe, Menu, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import type { User as SupaUser } from "@supabase/supabase-js";

export function Navbar() {
  const { lang, t, toggleLang } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<SupaUser | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-[#d4a054]/10 bg-[#0e0d0b]/90 backdrop-blur-2xl shadow-[0_1px_40px_rgba(212,160,84,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <a href="/" className="group flex items-center gap-2.5">
          <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4a054] to-[#a67830] text-[#0e0d0b] shadow-lg shadow-[#d4a054]/20 transition-transform group-hover:scale-105">
            <Camera className="size-4.5" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/20" />
          </div>
          <span className="text-xl font-display font-semibold tracking-wide text-[#f0ebe4]">
            Revivio
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {[
            { href: "#features", label: t.nav.features },
            { href: "#how-it-works", label: t.nav.howItWorks },
            { href: "#testimonials", label: t.nav.testimonials },
            { href: "/pricing", label: t.footer.pricing },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-sm text-[#8a8279] transition-colors hover:text-[#f0ebe4] after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-[#d4a054] after:transition-all hover:after:w-1/2"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 rounded-full border border-[#d4a054]/15 px-3 py-1.5 text-xs font-medium text-[#8a8279] transition-all hover:border-[#d4a054]/30 hover:text-[#d4a054]"
          >
            <Globe className="size-3.5" />
            {lang === "sl" ? "EN" : "SL"}
          </button>

          {user ? (
            <>
              <a href="/restore">
                <button className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#d4a054] to-[#a67830] px-5 py-2 text-sm font-semibold text-[#0e0d0b] shadow-lg shadow-[#d4a054]/20 transition-all hover:shadow-[#d4a054]/30 hover:brightness-110 active:scale-[0.97]">
                  <span className="relative z-10">{t.nav.tryNow}</span>
                </button>
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full border border-[#d4a054]/15 px-3 py-1.5 text-xs font-medium text-[#8a8279] transition-all hover:border-red-500/30 hover:text-red-400"
                title={t.auth.logout}
              >
                <LogOut className="size-3.5" />
              </button>
            </>
          ) : (
            <>
              <a
                href="/prijava"
                className="px-4 py-2 text-sm font-medium text-[#8a8279] transition-colors hover:text-[#f0ebe4]"
              >
                {t.auth.login}
              </a>
              <a href="/prijava">
                <button className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#d4a054] to-[#a67830] px-5 py-2 text-sm font-semibold text-[#0e0d0b] shadow-lg shadow-[#d4a054]/20 transition-all hover:shadow-[#d4a054]/30 hover:brightness-110 active:scale-[0.97]">
                  <span className="relative z-10">{t.nav.tryNow}</span>
                </button>
              </a>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleLang}
            className="flex size-9 items-center justify-center rounded-full border border-[#d4a054]/15 text-[#8a8279]"
          >
            <Globe className="size-4" />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex size-9 items-center justify-center rounded-full border border-[#d4a054]/15 text-[#8a8279]"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[#d4a054]/10 bg-[#0e0d0b]/95 px-6 py-6 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-1">
            {[
              { href: "#features", label: t.nav.features },
              { href: "#how-it-works", label: t.nav.howItWorks },
              { href: "#testimonials", label: t.nav.testimonials },
              { href: "/pricing", label: t.footer.pricing },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm text-[#8a8279] transition-colors hover:bg-[#1c1a17] hover:text-[#f0ebe4]"
              >
                {link.label}
              </a>
            ))}
            <div className="my-2 h-px bg-[#d4a054]/10" />
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-[#8a8279]">
                  <User className="size-4" />
                  {user.email}
                </div>
                <a href="/restore" onClick={() => setMobileOpen(false)}>
                  <button className="w-full rounded-full bg-gradient-to-r from-[#d4a054] to-[#a67830] py-3 text-sm font-semibold text-[#0e0d0b]">
                    {t.nav.tryNow}
                  </button>
                </a>
                <button
                  onClick={handleLogout}
                  className="mt-1 rounded-lg px-4 py-3 text-left text-sm text-red-400 transition-colors hover:bg-red-500/5"
                >
                  {t.auth.logout}
                </button>
              </>
            ) : (
              <>
                <a href="/prijava" onClick={() => setMobileOpen(false)}>
                  <button className="w-full rounded-full bg-gradient-to-r from-[#d4a054] to-[#a67830] py-3 text-sm font-semibold text-[#0e0d0b]">
                    {t.nav.tryNow}
                  </button>
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
