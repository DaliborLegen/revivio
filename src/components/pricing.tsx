"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/lib/lang-context";
import { createClient } from "@/lib/supabase";
import { Check, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const PLAN_KEYS = ["free", "starter", "pro", "business"] as const;

export function Pricing() {
  const { t } = useLang();
  const p = t.pricing;
  const [yearly, setYearly] = useState(false);
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
          interval: yearly ? "yearly" : "monthly",
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

          {/* Toggle */}
          <div className="mt-10 inline-flex items-center gap-1 rounded-full border border-[#d4a054]/12 bg-[#161412] p-1">
            <button
              onClick={() => setYearly(false)}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                !yearly
                  ? "bg-[#d4a054] text-[#0e0d0b] shadow-lg shadow-[#d4a054]/20"
                  : "text-[#8a8279] hover:text-[#c4bdb4]"
              }`}
            >
              {p.monthly}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                yearly
                  ? "bg-[#d4a054] text-[#0e0d0b] shadow-lg shadow-[#d4a054]/20"
                  : "text-[#8a8279] hover:text-[#c4bdb4]"
              }`}
            >
              {p.yearly}
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                {p.yearlyDiscount}
              </span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {p.plans.map((plan, i) => {
            const isPopular = "popular" in plan && plan.popular;
            const isFree = plan.price === "0";
            const isLoading = loadingPlan === i;
            const monthlyFromYearly =
              yearly && !isFree
                ? (parseFloat(plan.priceYearly) / 12).toFixed(2)
                : null;

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
                  {isFree ? (
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-5xl font-bold text-[#f0ebe4]">
                        €0
                      </span>
                    </div>
                  ) : yearly ? (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-5xl font-bold text-[#f0ebe4]">
                          €{monthlyFromYearly}
                        </span>
                        <span className="text-sm text-[#8a8279]">{p.perMonth}</span>
                      </div>
                      <p className="mt-1 text-sm text-[#6a6259]">
                        €{plan.priceYearly}
                        {p.perYear}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-5xl font-bold text-[#f0ebe4]">
                        €{plan.price}
                      </span>
                      <span className="text-sm text-[#8a8279]">{p.perMonth}</span>
                    </div>
                  )}
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
      </div>
    </section>
  );
}
