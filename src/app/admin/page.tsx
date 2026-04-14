"use client";

import { useEffect, useState } from "react";
import { LangProvider, useLang } from "@/lib/lang-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase";
import { Users, ImageIcon, Crown, DollarSign, Shield } from "lucide-react";

const ADMIN_EMAIL = "dalibor.legen@gmail.com";

type Stats = {
  totalUsers: number;
  totalRestorations: number;
  activeSubscribers: number;
  estimatedCost: string;
};

type UserRow = {
  email: string;
  plan: string;
  credits_remaining: number;
  credits_per_month: number;
  subscription_status: string | null;
  created_at: string;
};

type RestorationRow = {
  id: string;
  user_email: string;
  status: string;
  original_size: number | null;
  mime_type: string | null;
  created_at: string;
};

const planBadgeColors: Record<string, string> = {
  free: "bg-gray-500/10 text-gray-400",
  starter: "bg-blue-500/10 text-blue-400",
  pro: "bg-[#d4a054]/10 text-[#d4a054]",
  business: "bg-purple-500/10 text-purple-400",
};

function formatBytes(bytes: number | null): string {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AdminDashboardContent() {
  const { lang } = useLang();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [restorations, setRestorations] = useState<RestorationRow[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user || user.email !== ADMIN_EMAIL) {
          window.location.href = "/";
          return;
        }

        setAuthorized(true);

        const [statsRes, usersRes, restorationsRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/users"),
          fetch("/api/admin/restorations"),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (usersRes.ok) setUsers(await usersRes.json());
        if (restorationsRes.ok) {
          const data = await restorationsRes.json();
          setRestorations(data.slice(0, 20));
        }
      } catch (err) {
        console.error("Admin load error:", err);
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

  if (!authorized) return null;

  const t = {
    title: lang === "sl" ? "Admin nadzorna plosca" : "Admin Dashboard",
    totalUsers: lang === "sl" ? "Skupaj uporabnikov" : "Total Users",
    totalRestorations: lang === "sl" ? "Skupaj restavracij" : "Total Restorations",
    activeSubscribers: lang === "sl" ? "Aktivni narocniki" : "Active Subscribers",
    estimatedCost: lang === "sl" ? "Ocenjeni stroski" : "Estimated Cost",
    usersTitle: lang === "sl" ? "Uporabniki" : "Users",
    restorationsTitle: lang === "sl" ? "Nedavne restavracije" : "Recent Restorations",
    email: "Email",
    plan: lang === "sl" ? "Paket" : "Plan",
    creditsRemaining: lang === "sl" ? "Krediti" : "Credits",
    creditsPerMonth: lang === "sl" ? "Krediti/mesec" : "Credits/mo",
    status: "Status",
    joined: lang === "sl" ? "Pridruzitev" : "Joined",
    date: lang === "sl" ? "Datum" : "Date",
    fileSize: lang === "sl" ? "Velikost" : "File Size",
    userEmail: lang === "sl" ? "Uporabnik" : "User",
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#d4a054]/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#d4a054]" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#f0ebe4]">
            {t.title}
          </h1>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Users className="w-5 h-5 text-[#d4a054]" />}
            label={t.totalUsers}
            value={stats?.totalUsers ?? 0}
          />
          <StatCard
            icon={<ImageIcon className="w-5 h-5 text-[#d4a054]" />}
            label={t.totalRestorations}
            value={stats?.totalRestorations ?? 0}
          />
          <StatCard
            icon={<Crown className="w-5 h-5 text-[#d4a054]" />}
            label={t.activeSubscribers}
            value={stats?.activeSubscribers ?? 0}
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5 text-[#d4a054]" />}
            label={t.estimatedCost}
            value={`\u20AC${stats?.estimatedCost ?? "0.00"}`}
          />
        </div>

        {/* Users table */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-[#f0ebe4]">
            {t.usersTitle}
          </h2>
          <div className="bg-[#161412] border border-[#d4a054]/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#d4a054]/10">
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.email}</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.plan}</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.creditsRemaining}</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.creditsPerMonth}</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.status}</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.joined}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr
                      key={i}
                      className="border-b border-[#d4a054]/5 last:border-0 hover:bg-[#1e1c19]/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-[#f0ebe4]">{u.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            planBadgeColors[u.plan] || planBadgeColors.free
                          }`}
                        >
                          {u.plan ? u.plan.charAt(0).toUpperCase() + u.plan.slice(1) : "Free"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#f0ebe4]">{u.credits_remaining}</td>
                      <td className="px-4 py-3 text-[#8a8279]">{u.credits_per_month}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium ${
                            u.subscription_status === "active"
                              ? "text-green-400"
                              : "text-[#8a8279]"
                          }`}
                        >
                          {u.subscription_status || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#8a8279]">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-[#8a8279]">
                        {lang === "sl" ? "Ni uporabnikov" : "No users found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent restorations */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-[#f0ebe4]">
            {t.restorationsTitle}
          </h2>
          <div className="bg-[#161412] border border-[#d4a054]/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#d4a054]/10">
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.userEmail}</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.date}</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.status}</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.fileSize}</th>
                  </tr>
                </thead>
                <tbody>
                  {restorations.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-[#d4a054]/5 last:border-0 hover:bg-[#1e1c19]/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-[#f0ebe4]">{r.user_email}</td>
                      <td className="px-4 py-3 text-[#8a8279]">
                        {new Date(r.created_at).toLocaleDateString()}{" "}
                        {new Date(r.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
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
                      </td>
                      <td className="px-4 py-3 text-[#8a8279]">
                        {formatBytes(r.original_size)}
                      </td>
                    </tr>
                  ))}
                  {restorations.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-[#8a8279]">
                        {lang === "sl" ? "Ni restavracij" : "No restorations yet"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-[#161412] border border-[#d4a054]/10 rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-[#d4a054]/10 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-[#8a8279] text-sm">{label}</span>
      </div>
      <p className="text-[#f0ebe4] text-2xl font-bold font-display">{value}</p>
    </div>
  );
}

export default function AdminPage() {
  return (
    <LangProvider>
      <Navbar />
      <AdminDashboardContent />
      <Footer />
    </LangProvider>
  );
}
