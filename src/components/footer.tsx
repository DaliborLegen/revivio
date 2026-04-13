"use client";

import { useLang } from "@/lib/lang-context";
import { Camera } from "lucide-react";

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="relative border-t border-[#d4a054]/8 bg-[#0a0908]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="/" className="group flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4a054] to-[#a67830] text-[#0e0d0b]">
                <Camera className="size-3.5" />
              </div>
              <span className="font-display text-lg font-semibold text-[#f0ebe4]">
                Revivio
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#6a6259]">
              {t.footer.description}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#d4a054]">
              {t.footer.product}
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#features" className="text-sm text-[#6a6259] transition-colors hover:text-[#f0ebe4]">
                  {t.footer.features}
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-sm text-[#6a6259] transition-colors hover:text-[#f0ebe4]">
                  {t.footer.pricing}
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#d4a054]">
              {t.footer.company}
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm text-[#6a6259] transition-colors hover:text-[#f0ebe4]">
                  {t.footer.about}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#6a6259] transition-colors hover:text-[#f0ebe4]">
                  {t.footer.contact}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#6a6259] transition-colors hover:text-[#f0ebe4]">
                  {t.footer.blog}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#d4a054]">
              {t.footer.legal}
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm text-[#6a6259] transition-colors hover:text-[#f0ebe4]">
                  {t.footer.privacy}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#6a6259] transition-colors hover:text-[#f0ebe4]">
                  {t.footer.terms}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-gradient-to-r from-transparent via-[#d4a054]/10 to-transparent" />

        <p className="text-center text-sm text-[#4a4440]">
          &copy; {new Date().getFullYear()} Revivio. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
