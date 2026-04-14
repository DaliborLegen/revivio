"use client";

import { useEffect, useState } from "react";
import { LangProvider, useLang } from "@/lib/lang-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import {
  User,
  Crown,
  ImageIcon,
  Calendar,
  Download,
  Sparkles,
  ArrowRight,
} from "lucide-react";

type Profile = {
  plan: string;
  credits_remaining: number;
  credits_per_month: number;
  subscription_status: string | null;
  current_period_end: string | null;
};

type Restoration = {
  id: string;
  status: string;
  original_url: string | null;
  restored_url: string | null;
  created_at: string;
};

function DashboardContent() {
  const { t } = useLang();
  const d = t.dashboard;

  const [email, setEmail] = useState<string>("");
  const [memberSince, setMemberSince] = useState<string>("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [restorations, setRestorations] = useState<Restoration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/prijava";
          return;
        }

        setEmail(user.email ?? "");
        setMemberSince(
          new Date(user.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
          })
        );

        const [profileRes, restorationsRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/restorations"),
        ]);

        if (profileRes.ok) setProfile(await profileRes.json());
        if (restorationsRes.ok) setRestorations(await restorationsRes.json());
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#d4a054] border-t-transparent rounded-full" />
      </main>
    );
  }

  const creditsRemaining = profile?.credits_remaining ?? 0;
  const creditsTotal = Math.max(profile?.credits_per_month ?? 1, creditsRemaining);
  const creditsUsed = Math.max(0, creditsTotal - creditsRemaining);
  const creditsPercent =
    creditsTotal > 0 ? Math.min(100, Math.round((creditsUsed / creditsTotal) * 100)) : 0;

  const planLabel = profile?.plan
    ? profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)
    : "Free";

  const isActive = profile?.subscription_status === "active";

  return (
    <main className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#f0ebe4]">
            {d.title}
          </h1>
          <p className="text-[#8a8279] mt-2">{d.subtitle}</p>
        </div>

        {/* User info + credits row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* User card */}
          <div className="bg-[#161412] border border-[#d4a054]/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#d4a054]/10 flex items-center justify-center">
                <User className="w-6 h-6 text-[#d4a054]" />
              </div>
              <div>
                <p className="text-[#f0ebe4] font-medium">{email}</p>
                <p className="text-[#8a8279] text-sm">
                  {d.memberSince} {memberSince}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#d4a054]" />
              <span className="text-[#f0ebe4] text-sm font-medium">
                {d.plan}:
              </span>
              <span className="bg-[#d4a054]/10 text-[#d4a054] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {planLabel}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#8a8279]">{d.subscription}:</span>
              <span
                className={
                  isActive ? "text-green-400" : "text-[#8a8279]"
                }
              >
                {isActive ? d.active : d.inactive}
              </span>
            </div>

            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-[#d4a054] text-sm hover:underline"
            >
              {d.managePlan}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Credits card */}
          <div className="bg-[#161412] border border-[#d4a054]/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d4a054]" />
              <h2 className="font-display text-lg font-semibold text-[#f0ebe4]">
                {d.creditsUsed}
              </h2>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#f0ebe4] font-semibold text-lg">
                  {creditsRemaining}
                </span>
                <span className="text-[#8a8279]">{creditsUsed} porabljenih od {creditsTotal}</span>
              </div>
              <div className="w-full h-2.5 bg-[#1e1c19] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#d4a054] rounded-full transition-all duration-500"
                  style={{ width: `${100 - creditsPercent}%` }}
                />
              </div>
              <p className="text-[#8a8279] text-xs">
                {profile?.credits_remaining ?? 0} {t.credits.remaining}
              </p>
            </div>

            <Link
              href="/restore"
              className="inline-flex items-center gap-1.5 bg-[#d4a054] text-[#0e0c0a] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#c4903e] transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              {d.startRestoring}
            </Link>
          </div>
        </div>

        {/* Restoration history */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-[#f0ebe4]">
              {d.history}
            </h2>
            {restorations.length > 0 && (
              <span className="text-[#8a8279] text-sm">
                {restorations.length}{" "}
                {restorations.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>

          {restorations.length === 0 ? (
            <div className="bg-[#161412] border border-[#d4a054]/10 rounded-2xl p-12 text-center space-y-3">
              <ImageIcon className="w-12 h-12 text-[#8a8279] mx-auto" />
              <p className="text-[#f0ebe4] font-medium">{d.noHistory}</p>
              <p className="text-[#8a8279] text-sm">{d.noHistorySubtitle}</p>
              <Link
                href="/restore"
                className="inline-flex items-center gap-1.5 bg-[#d4a054] text-[#0e0c0a] text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#c4903e] transition-colors mt-2"
              >
                <Sparkles className="w-4 h-4" />
                {d.startRestoring}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restorations.map((r) => (
                <div
                  key={r.id}
                  className="bg-[#161412] border border-[#d4a054]/10 rounded-2xl overflow-hidden group"
                >
                  <div className="aspect-[4/3] relative bg-[#1e1c19]">
                    {r.original_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.restored_url ?? r.original_url}
                        alt="Restoration"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-[#8a8279]" />
                      </div>
                    )}

                    {r.restored_url && (
                      <a
                        href={r.restored_url}
                        download
                        className="absolute top-2 right-2 bg-[#0e0c0a]/80 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Download className="w-4 h-4 text-[#d4a054]" />
                      </a>
                    )}
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#8a8279] text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(r.created_at).toLocaleDateString()}
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        r.status === "completed"
                          ? "bg-green-500/10 text-green-400"
                          : r.status === "processing"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ProfilPage() {
  return (
    <LangProvider>
      <Navbar />
      <DashboardContent />
      <Footer />
    </LangProvider>
  );
}
