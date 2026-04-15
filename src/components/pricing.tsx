"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/lib/lang-context";
import { createClient } from "@/lib/supabase";
import { Check, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const PLAN_KEYS = ["free", "starter", "pro", "business"] as const;

export function Pricing() {
  const { t, lang } = useLang();
  const p = t.pricing;
  const [user, setUser] = useState<User | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleCheckout = async (planIndex: number) => {
    const planKey = PLAN_KEYS[planIndex];

    if (planKey === "free") {
      window.location.href = user ? "/restore" : "/prijava";
      return;
    }

    if (!user) {
      window.location.href = "/prijava";
      return;
    }

    setLoadingPlan(planIndex);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planKey,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setLoadingPlan(null);
    }
  };

  return (
    <section className="relative py-28">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
          <div className="h-[600px] w-[800px] rounded-full bg-[#d4a054]/4 blur-[150px]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#d4a054]">
            {p.title}
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-[#f0ebe4] sm:text-5xl lg:text-6xl">
            {p.title}
          </h1>
          <p className="mt-4 text-lg text-[#8a8279]">{p.subtitle}</p>

        </div>

        {/* Plans grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {p.plans.map((plan, i) => {
            const isPopular = "popular" in plan && plan.popular;
            const isFree = plan.price === "0";
            const isLoading = loadingPlan === i;

            return (
              <div
                key={i}
                className={`card-hover relative flex flex-col rounded-2xl border p-7 transition-all ${
                  isPopular
                    ? "border-[#d4a054]/30 bg-gradient-to-b from-[#1c1a17] to-[#161412] shadow-[0_0_60px_rgba(212,160,84,0.08)]"
                    : "border-[#d4a054]/8 bg-[#161412]"
                }`}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#d4a054] to-[#a67830] px-4 py-1.5 text-xs font-semibold text-[#0e0d0b] shadow-lg shadow-[#d4a054]/25">
                      <Sparkles className="size-3" />
                      {p.mostPopular}
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <h3 className="text-lg font-semibold text-[#f0ebe4]">{plan.name}</h3>

                {/* Credits */}
                <p className="mt-1 text-sm text-[#8a8279]">
                  {plan.credits} {p.creditsPerMonth}
                </p>

                {/* Price */}
                <div className="mt-5 mb-7">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-5xl font-bold text-[#f0ebe4]">
                      €{plan.price}
                    </span>
                    {!isFree && (
                      <span className="text-sm text-[#8a8279]">{p.perMonth}</span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleCheckout(i)}
                  disabled={isLoading}
                  className={`mb-7 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all disabled:opacity-60 ${
                    isPopular
                      ? "bg-gradient-to-r from-[#d4a054] to-[#a67830] text-[#0e0d0b] shadow-lg shadow-[#d4a054]/20 hover:shadow-[#d4a054]/30 hover:brightness-110"
                      : isFree
                        ? "border border-[#d4a054]/15 bg-transparent text-[#8a8279] hover:border-[#d4a054]/30 hover:text-[#f0ebe4]"
                        : "bg-[#f0ebe4] text-[#0e0d0b] hover:bg-[#f0ebe4]/90"
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      {isFree ? p.startFree : p.choosePlan}
                      {!isFree && <ArrowRight className="size-4" />}
                    </>
                  )}
                </button>

                {/* Features */}
                <ul className="flex-1 space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className={`mt-0.5 size-4 shrink-0 ${
                          isPopular ? "text-[#d4a054]" : "text-emerald-500"
                        }`}
                      />
                      <span className="text-[#8a8279]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Payment methods */}
        <div className="mt-16 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-[#8a8279]">
            {lang === "sl" ? "Varno plačilo z" : "Secure payment with"}
          </p>
          <div className="flex items-center justify-center gap-3">
            {/* Visa */}
            <div className="flex h-10 w-16 items-center justify-center rounded-lg border border-[#d4a054]/15 bg-white">
              <svg viewBox="0 0 780 500" className="h-5 w-auto">
                <path d="M293.2 348.7l33.4-195.8h53.4l-33.4 195.8h-53.4zm246.8-191c-10.6-4-27.2-8.3-47.9-8.3-52.8 0-90 26.6-90.2 64.7-.3 28.2 26.5 43.9 46.8 53.3 20.8 9.6 27.8 15.8 27.7 24.4-.1 13.2-16.6 19.2-32 19.2-21.4 0-32.7-3-50.3-10.2l-6.9-3.1-7.5 43.8c12.5 5.5 35.6 10.2 59.6 10.5 56.2 0 92.6-26.3 93-66.8.2-22.3-14-39.2-44.6-53.2-18.6-9.1-29.9-15.1-29.8-24.3 0-8.1 9.6-16.8 30.4-16.8 17.4-.3 29.9 3.5 39.7 7.5l4.8 2.2 7.2-42.8zm137.8-4.8h-41.3c-12.8 0-22.4 3.5-28 16.3l-79.4 179.8h56.2s9.2-24.2 11.3-29.5h68.6c1.6 6.9 6.5 29.5 6.5 29.5h49.7l-43.6-196.1zm-65.8 126.5c4.4-11.3 21.4-54.8 21.4-54.8-.3.5 4.4-11.4 7.1-18.8l3.6 17s10.3 47 12.4 56.6h-44.5zM327.1 152.9L274 348.7h-53.5l-33-156c-2-7.6-3.7-10.4-9.8-13.6-9.9-5.2-26.3-10.1-40.7-13.2l1-4.9h85.6c11.6 0 21.5 7.4 23.7 19.9l21.2 106.3 52.3-126.3h56.3z" fill="#1a1f71"/>
              </svg>
            </div>
            {/* Mastercard */}
            <div className="flex h-10 w-16 items-center justify-center rounded-lg border border-[#d4a054]/15 bg-white">
              <svg viewBox="0 0 48 32" className="h-6 w-auto">
                <circle cx="17" cy="16" r="9" fill="#EB001B"/>
                <circle cx="31" cy="16" r="9" fill="#F79E1B"/>
                <path d="M24 8.6a9 9 0 0 1 0 14.8 9 9 0 0 1 0-14.8z" fill="#FF5F00"/>
              </svg>
            </div>
            {/* Apple Pay */}
            <div className="flex h-10 items-center gap-1 rounded-lg border border-[#d4a054]/15 bg-white px-3">
              <svg viewBox="0 0 17 20" className="h-4 w-auto">
                <path d="M14.04 10.58c-.03-2.67 2.18-3.95 2.28-4.01-1.24-1.81-3.17-2.06-3.86-2.09-1.64-.17-3.2.97-4.03.97-.84 0-2.13-.94-3.5-.92-1.8.03-3.46 1.05-4.39 2.66-1.87 3.24-.48 8.05 1.34 10.68.89 1.29 1.95 2.73 3.35 2.68 1.34-.05 1.85-.87 3.47-.87 1.62 0 2.07.87 3.49.84 1.45-.02 2.36-1.31 3.24-2.6 1.02-1.5 1.44-2.95 1.47-3.02-.03-.01-2.82-1.08-2.86-4.32zM11.37 2.95C12.1 2.07 12.59.87 12.46-.32c-1.03.04-2.28.69-3.02 1.55-.66.77-1.24 1.99-1.09 3.17 1.15.09 2.33-.58 3.02-1.45z" fill="#000"/>
              </svg>
              <span className="text-xs font-semibold text-black">Pay</span>
            </div>
            {/* Google Pay */}
            <div className="flex h-10 items-center gap-1 rounded-lg border border-[#d4a054]/15 bg-white px-3">
              <svg viewBox="0 0 24 24" className="h-4 w-auto">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-xs font-semibold text-[#5f6368]">Pay</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-[#8a8279]/60">
            {lang === "sl" ? "Vsa plačila so šifrirana in varna prek Stripe" : "All payments are encrypted and secured by Stripe"}
          </p>
        </div>
      </div>
    </section>
  );
}
