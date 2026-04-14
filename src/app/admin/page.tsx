"use client";

import { useEffect, useState } from "react";
import { LangProvider, useLang } from "@/lib/lang-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase";
import {
  Users,
  ImageIcon,
  Crown,
  DollarSign,
  Shield,
  Pencil,
  Check,
  X,
  RefreshCw,
  Search,
  TrendingUp,
  CreditCard,
  Wallet,
  Receipt,
} from "lucide-react";

const ADMIN_EMAIL = "dalibor.legen@gmail.com";

type Stats = {
  totalUsers: number;
  totalRestorations: number;
  activeSubscribers: number;
  estimatedCost: string;
  monthlyRestorations: number;
  monthlyCost: string;
};

type UserRow = {
  id: string;
  email: string;
  plan: string;
  credits_remaining: number;
  credits_per_month: number;
  subscription_status: string | null;
  created_at: string;
  total_restorations: number;
  estimated_cost: string;
};

type Revenue = {
  availableBalance: string;
  pendingBalance: string;
  monthlyRevenue: string;
  monthlyTransactions: number;
  totalRevenue: string;
  totalTransactions: number;
  mrr: string;
  activeSubscriptions: number;
  recentPayments: PaymentRow[];
};

type PaymentRow = {
  id: string;
  amount: string;
  status: string;
  email: string;
  created: string;
  description: string;
};

type RestorationRow = {
  id: string;
  user_email: string;
  status: string;
  original_size: number | null;
  mime_type: string | null;
  created_at: string;
};

const PLANS = ["free", "starter", "pro", "business"];

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
  const [revenue, setRevenue] = useState<Revenue | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    plan: string;
    credits_remaining: number;
    credits_per_month: number;
  }>({ plan: "free", credits_remaining: 0, credits_per_month: 0 });
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [statsRes, usersRes, restorationsRes, revenueRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users"),
        fetch("/api/admin/restorations"),
        fetch("/api/admin/revenue"),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (restorationsRes.ok) {
        const data = await restorationsRes.json();
        setRestorations(data.slice(0, 50));
      }
      if (revenueRes.ok) setRevenue(await revenueRes.json());
    } catch (err) {
      console.error("Admin load error:", err);
    }
  };

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
        await loadData();
      } catch (err) {
        console.error("Admin load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const startEdit = (u: UserRow) => {
    setEditingUser(u.id);
    setEditForm({
      plan: u.plan || "free",
      credits_remaining: u.credits_remaining,
      credits_per_month: u.credits_per_month,
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
  };

  const saveEdit = async (userId: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...editForm }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? { ...u, ...editForm }
              : u
          )
        );
        setEditingUser(null);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = searchQuery
    ? users.filter(
        (u) =>
          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.plan?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

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
    totalRestorations: lang === "sl" ? "Skupaj obnov" : "Total Restorations",
    activeSubscribers: lang === "sl" ? "Aktivni narocniki" : "Active Subscribers",
    estimatedCost: lang === "sl" ? "Skupni stroski" : "Total Cost",
    monthlyRestorations: lang === "sl" ? "Obnove ta mesec" : "This Month",
    monthlyCost: lang === "sl" ? "Stroski ta mesec" : "Monthly Cost",
    usersTitle: lang === "sl" ? "Uporabniki" : "Users",
    restorationsTitle: lang === "sl" ? "Nedavne obnove" : "Recent Restorations",
    email: "Email",
    plan: lang === "sl" ? "Paket" : "Plan",
    creditsRemaining: lang === "sl" ? "Krediti" : "Credits",
    creditsPerMonth: lang === "sl" ? "Krediti/mesec" : "Credits/mo",
    restorations: lang === "sl" ? "Obnove" : "Restorations",
    userCost: lang === "sl" ? "Strosek" : "Cost",
    status: "Status",
    joined: lang === "sl" ? "Pridruzitev" : "Joined",
    date: lang === "sl" ? "Datum" : "Date",
    fileSize: lang === "sl" ? "Velikost" : "File Size",
    userEmail: lang === "sl" ? "Uporabnik" : "User",
    actions: lang === "sl" ? "Akcije" : "Actions",
    search: lang === "sl" ? "Iskanje uporabnikov..." : "Search users...",
    refresh: lang === "sl" ? "Osvezi" : "Refresh",
    revenueTitle: lang === "sl" ? "Prihodki (Stripe)" : "Revenue (Stripe)",
    totalRevenue: lang === "sl" ? "Celotni prihodki" : "Total Revenue",
    monthlyRevenueLabel: lang === "sl" ? "Prihodki ta mesec" : "This Month Revenue",
    mrr: "MRR",
    availableBalance: lang === "sl" ? "Razpolozljivo" : "Available",
    pendingBalance: lang === "sl" ? "V obdelavi" : "Pending",
    activeSubs: lang === "sl" ? "Aktivne narocnine" : "Active Subscriptions",
    recentPayments: lang === "sl" ? "Zadnja placila" : "Recent Payments",
    amount: lang === "sl" ? "Znesek" : "Amount",
    description: lang === "sl" ? "Opis" : "Description",
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#d4a054]/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#d4a054]" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[#f0ebe4]">
              {t.title}
            </h1>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-full border border-[#d4a054]/15 px-4 py-2 text-sm text-[#8a8279] transition-all hover:border-[#d4a054]/30 hover:text-[#d4a054] disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            {t.refresh}
          </button>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={<Users className="w-5 h-5 text-[#d4a054]" />}
            label={t.totalUsers}
            value={stats?.totalUsers ?? 0}
          />
          <StatCard
            icon={<Crown className="w-5 h-5 text-[#d4a054]" />}
            label={t.activeSubscribers}
            value={stats?.activeSubscribers ?? 0}
          />
          <StatCard
            icon={<ImageIcon className="w-5 h-5 text-[#d4a054]" />}
            label={t.totalRestorations}
            value={stats?.totalRestorations ?? 0}
          />
        </div>

        {/* Cost cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={<ImageIcon className="w-5 h-5 text-emerald-400" />}
            label={t.monthlyRestorations}
            value={stats?.monthlyRestorations ?? 0}
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5 text-amber-400" />}
            label={t.monthlyCost}
            value={`€${stats?.monthlyCost ?? "0.00"}`}
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5 text-red-400" />}
            label={t.estimatedCost}
            value={`€${stats?.estimatedCost ?? "0.00"}`}
          />
        </div>

        {/* Revenue section */}
        {revenue && (
          <>
            <div className="flex items-center gap-3 pt-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className="font-display text-xl font-semibold text-[#f0ebe4]">
                {t.revenueTitle}
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                icon={<Wallet className="w-5 h-5 text-emerald-400" />}
                label={t.totalRevenue}
                value={`€${revenue.totalRevenue}`}
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
                label={t.monthlyRevenueLabel}
                value={`€${revenue.monthlyRevenue}`}
              />
              <StatCard
                icon={<Receipt className="w-5 h-5 text-blue-400" />}
                label={t.mrr}
                value={`€${revenue.mrr}`}
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                icon={<CreditCard className="w-5 h-5 text-emerald-400" />}
                label={t.availableBalance}
                value={`€${revenue.availableBalance}`}
              />
              <StatCard
                icon={<DollarSign className="w-5 h-5 text-yellow-400" />}
                label={t.pendingBalance}
                value={`€${revenue.pendingBalance}`}
              />
              <StatCard
                icon={<Crown className="w-5 h-5 text-purple-400" />}
                label={t.activeSubs}
                value={revenue.activeSubscriptions}
              />
            </div>

            {/* Recent payments table */}
            {revenue.recentPayments.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-semibold text-[#f0ebe4]">
                  {t.recentPayments}
                </h2>
                <div className="bg-[#161412] border border-[#d4a054]/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#d4a054]/10">
                          <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.email}</th>
                          <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.amount}</th>
                          <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.status}</th>
                          <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.description}</th>
                          <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.date}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenue.recentPayments.map((p) => (
                          <tr
                            key={p.id}
                            className="border-b border-[#d4a054]/5 last:border-0 hover:bg-[#1e1c19]/50 transition-colors"
                          >
                            <td className="px-4 py-3 text-[#f0ebe4]">{p.email}</td>
                            <td className="px-4 py-3 text-emerald-400 font-medium">€{p.amount}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                  p.status === "paid"
                                    ? "bg-green-500/10 text-green-400"
                                    : p.status === "refunded"
                                    ? "bg-red-500/10 text-red-400"
                                    : "bg-yellow-500/10 text-yellow-400"
                                }`}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-[#8a8279] max-w-[200px] truncate">
                              {p.description}
                            </td>
                            <td className="px-4 py-3 text-[#8a8279]">
                              {new Date(p.created).toLocaleDateString()}{" "}
                              {new Date(p.created).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Users table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-[#f0ebe4]">
              {t.usersTitle}
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8279]" />
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm rounded-full border border-[#d4a054]/15 bg-[#161412] text-[#f0ebe4] placeholder-[#4a4439] focus:outline-none focus:border-[#d4a054]/30 w-64"
              />
            </div>
          </div>
          <div className="bg-[#161412] border border-[#d4a054]/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#d4a054]/10">
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.email}</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.plan}</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.creditsRemaining}</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.creditsPerMonth}</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.restorations}</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.userCost}</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.status}</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.joined}</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-[#d4a054]/5 last:border-0 hover:bg-[#1e1c19]/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-[#f0ebe4]">{u.email}</td>
                      <td className="px-4 py-3">
                        {editingUser === u.id ? (
                          <select
                            value={editForm.plan}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, plan: e.target.value }))
                            }
                            className="bg-[#1c1a17] border border-[#d4a054]/20 text-[#f0ebe4] text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-[#d4a054]/40"
                          >
                            {PLANS.map((p) => (
                              <option key={p} value={p}>
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              planBadgeColors[u.plan] || planBadgeColors.free
                            }`}
                          >
                            {u.plan ? u.plan.charAt(0).toUpperCase() + u.plan.slice(1) : "Free"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingUser === u.id ? (
                          <input
                            type="number"
                            value={editForm.credits_remaining}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                credits_remaining: parseInt(e.target.value) || 0,
                              }))
                            }
                            className="w-16 bg-[#1c1a17] border border-[#d4a054]/20 text-[#f0ebe4] text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-[#d4a054]/40"
                          />
                        ) : (
                          <span className="text-[#f0ebe4]">{u.credits_remaining}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingUser === u.id ? (
                          <input
                            type="number"
                            value={editForm.credits_per_month}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                credits_per_month: parseInt(e.target.value) || 0,
                              }))
                            }
                            className="w-16 bg-[#1c1a17] border border-[#d4a054]/20 text-[#f0ebe4] text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-[#d4a054]/40"
                          />
                        ) : (
                          <span className="text-[#8a8279]">{u.credits_per_month}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#f0ebe4] font-medium">{u.total_restorations}</td>
                      <td className="px-4 py-3 text-amber-400 font-medium">€{u.estimated_cost}</td>
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
                      <td className="px-4 py-3">
                        {editingUser === u.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => saveEdit(u.id)}
                              disabled={saving}
                              className="p-1.5 rounded-lg text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-50"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(u)}
                            className="p-1.5 rounded-lg text-[#8a8279] hover:text-[#d4a054] hover:bg-[#d4a054]/10 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-[#8a8279]">
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
                        {lang === "sl" ? "Ni obnov" : "No restorations yet"}
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
