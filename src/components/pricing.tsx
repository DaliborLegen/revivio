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
          <div className="flex items-center justify-center gap-6 opacity-60">
            {/* Visa */}
            <svg viewBox="0 0 48 32" className="h-8 w-auto" fill="none">
              <rect width="48" height="32" rx="4" fill="currentColor" className="text-[#1a1f71]" />
              <path d="M19.5 21h-3l1.9-11.5h3L19.5 21zm8.1-11.5l-2.8 7.9-.3-1.6-1-5.1s-.1-1.2-1.5-1.2h-4.7l-.1.3s1.6.3 3.4 1.4l2.8 10.8h3.1l4.7-12.5h-3.6zm14.9 11.5h2.7l-2.4-11.5h-2.4c-1.1 0-1.4.6-1.4.6l-4.4 10.9h3.1l.6-1.7h3.8l.4 1.7zm-3.3-4l1.6-4.3.9 4.3h-2.5zM31.3 12.1l.4-2.5s-1.3-.5-2.7-.5c-1.5 0-5 .7-5 3.5 0 2.6 3.6 2.7 3.6 4 0 1.4-3.2 1.1-4.3.3l-.4 2.6s1.4.6 3.4.6c2.1 0 5.2-1.1 5.2-3.7 0-2.7-3.6-2.9-3.6-4 0-1.2 2.5-1 3.4-.3z" fill="white" />
            </svg>
            {/* Mastercard */}
            <svg viewBox="0 0 48 32" className="h-8 w-auto" fill="none">
              <rect width="48" height="32" rx="4" fill="#252525" />
              <circle cx="19" cy="16" r="8" fill="#EB001B" />
              <circle cx="29" cy="16" r="8" fill="#F79E1B" />
              <path d="M24 9.8a8 8 0 0 1 0 12.4 8 8 0 0 1 0-12.4z" fill="#FF5F00" />
            </svg>
            {/* Apple Pay */}
            <div className="flex h-8 items-center rounded bg-[#8a8279]/20 px-3">
              <span className="text-xs font-semibold text-[#8a8279]">Apple Pay</span>
            </div>
            {/* Google Pay */}
            <div className="flex h-8 items-center rounded bg-[#8a8279]/20 px-3">
              <span className="text-xs font-semibold text-[#8a8279]">Google Pay</span>
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
