"use client";

import { useEffect, useState } from "react";
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
  LogOut,
  Lock,
  Mail,
  Loader2,
  UserPlus,
  Trash2,
  KeyRound,
  Settings,
} from "lucide-react";

type Stats = {
  totalUsers: number;
  totalRestorations: number;
  activeSubscribers: number;
  estimatedCost: string;
  monthlyRestorations: number;
  monthlyCost: string;
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

type RestorationRow = {
  id: string;
  user_email: string;
  status: string;
  original_size: number | null;
  mime_type: string | null;
  created_at: string;
};

type AdminUser = {
  email: string;
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

// ─── Login Form ───

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Napaka pri prijavi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0e0d0b] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#d4a054]/10 ring-1 ring-[#d4a054]/20">
            <Shield className="size-7 text-[#d4a054]" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-[#f0ebe4]">Admin</h1>
        </div>

        <div className="rounded-2xl border border-[#d4a054]/10 bg-[#161412] p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#6a6259]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#d4a054]/10 bg-[#0e0d0b] py-3 pl-11 pr-4 text-sm text-[#f0ebe4] placeholder-[#4a4439] outline-none focus:border-[#d4a054]/30"
                  placeholder="Email"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#6a6259]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#d4a054]/10 bg-[#0e0d0b] py-3 pl-11 pr-4 text-sm text-[#f0ebe4] placeholder-[#4a4439] outline-none focus:border-[#d4a054]/30"
                  placeholder="Geslo"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4a054] to-[#a67830] py-3 text-sm font-semibold text-[#0e0d0b] transition-all hover:brightness-110 disabled:opacity-50"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              Prijava
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

// ─── Dashboard ───

function AdminDashboard({ adminEmail }: { adminEmail: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [restorations, setRestorations] = useState<RestorationRow[]>([]);
  const [revenue, setRevenue] = useState<Revenue | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ plan: "free", credits_remaining: 0, credits_per_month: 0 });
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Admin management
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [changePassEmail, setChangePassEmail] = useState("");
  const [changePassValue, setChangePassValue] = useState("");
  const [adminMsg, setAdminMsg] = useState("");

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

  const loadAdmins = async () => {
    const res = await fetch("/api/admin/admins");
    if (res.ok) setAdminUsers(await res.json());
  };

  useEffect(() => {
    loadData().then(() => setLoading(false));
    loadAdmins();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.reload();
  };

  const startEdit = (u: UserRow) => {
    setEditingUser(u.id);
    setEditForm({ plan: u.plan || "free", credits_remaining: u.credits_remaining, credits_per_month: u.credits_per_month });
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
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, ...editForm } : u));
        setEditingUser(null);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const addAdmin = async () => {
    if (!newAdminEmail || !newAdminPassword) return;
    setAdminMsg("");
    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newAdminEmail, password: newAdminPassword }),
    });
    if (res.ok) {
      setNewAdminEmail("");
      setNewAdminPassword("");
      setAdminMsg("Admin dodan");
      loadAdmins();
    } else {
      const data = await res.json();
      setAdminMsg(data.error || "Napaka");
    }
  };

  const changePassword = async () => {
    if (!changePassEmail || !changePassValue) return;
    setAdminMsg("");
    const res = await fetch("/api/admin/admins", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: changePassEmail, password: changePassValue }),
    });
    if (res.ok) {
      setChangePassValue("");
      setAdminMsg("Geslo spremenjeno");
    } else {
      const data = await res.json();
      setAdminMsg(data.error || "Napaka");
    }
  };

  const deleteAdmin = async (email: string) => {
    setAdminMsg("");
    const res = await fetch("/api/admin/admins", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setAdminMsg("Admin odstranjen");
      loadAdmins();
    } else {
      const data = await res.json();
      setAdminMsg(data.error || "Napaka");
    }
  };

  const filteredUsers = searchQuery
    ? users.filter((u) =>
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.plan?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0e0d0b]">
        <div className="animate-spin h-8 w-8 border-2 border-[#d4a054] border-t-transparent rounded-full" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0e0d0b] pt-8 pb-20 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#d4a054]/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#d4a054]" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-[#f0ebe4]">Admin</h1>
              <p className="text-xs text-[#8a8279]">{adminEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdminSettings(!showAdminSettings)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
                showAdminSettings
                  ? "border-[#d4a054]/30 text-[#d4a054] bg-[#d4a054]/5"
                  : "border-[#d4a054]/15 text-[#8a8279] hover:border-[#d4a054]/30 hover:text-[#d4a054]"
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-full border border-[#d4a054]/15 px-4 py-2 text-sm text-[#8a8279] transition-all hover:border-[#d4a054]/30 hover:text-[#d4a054] disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-[#d4a054]/15 px-4 py-2 text-sm text-[#8a8279] transition-all hover:border-red-500/30 hover:text-red-400"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Admin settings panel */}
        {showAdminSettings && (
          <div className="bg-[#161412] border border-[#d4a054]/10 rounded-2xl p-6 space-y-6">
            <h2 className="font-display text-xl font-semibold text-[#f0ebe4] flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#d4a054]" />
              Admin uporabniki
            </h2>

            {/* Current admins */}
            <div className="space-y-2">
              {adminUsers.map((a) => (
                <div key={a.email} className="flex items-center justify-between rounded-xl border border-[#d4a054]/8 bg-[#0e0d0b] px-4 py-3">
                  <div>
                    <span className="text-sm text-[#f0ebe4]">{a.email}</span>
                    <span className="ml-2 text-xs text-[#8a8279]">
                      {new Date(a.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {a.email !== adminEmail && (
                    <button
                      onClick={() => deleteAdmin(a.email)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add admin */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#8a8279]">Dodaj admina</h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="flex-1 rounded-xl border border-[#d4a054]/10 bg-[#0e0d0b] py-2.5 px-4 text-sm text-[#f0ebe4] placeholder-[#4a4439] outline-none focus:border-[#d4a054]/30"
                />
                <input
                  type="text"
                  placeholder="Geslo"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-36 rounded-xl border border-[#d4a054]/10 bg-[#0e0d0b] py-2.5 px-4 text-sm text-[#f0ebe4] placeholder-[#4a4439] outline-none focus:border-[#d4a054]/30"
                />
                <button
                  onClick={addAdmin}
                  className="flex items-center gap-1.5 rounded-xl bg-[#d4a054] px-4 py-2.5 text-sm font-semibold text-[#0e0d0b] hover:brightness-110 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Dodaj
                </button>
              </div>
            </div>

            {/* Change password */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#8a8279]">Spremeni geslo</h3>
              <div className="flex gap-2">
                <select
                  value={changePassEmail}
                  onChange={(e) => setChangePassEmail(e.target.value)}
                  className="flex-1 rounded-xl border border-[#d4a054]/10 bg-[#0e0d0b] py-2.5 px-4 text-sm text-[#f0ebe4] outline-none focus:border-[#d4a054]/30"
                >
                  <option value="">Izberi admina</option>
                  {adminUsers.map((a) => (
                    <option key={a.email} value={a.email}>{a.email}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Novo geslo"
                  value={changePassValue}
                  onChange={(e) => setChangePassValue(e.target.value)}
                  className="w-36 rounded-xl border border-[#d4a054]/10 bg-[#0e0d0b] py-2.5 px-4 text-sm text-[#f0ebe4] placeholder-[#4a4439] outline-none focus:border-[#d4a054]/30"
                />
                <button
                  onClick={changePassword}
                  className="flex items-center gap-1.5 rounded-xl border border-[#d4a054]/15 px-4 py-2.5 text-sm font-medium text-[#8a8279] hover:text-[#d4a054] hover:border-[#d4a054]/30 transition-all"
                >
                  <KeyRound className="w-4 h-4" />
                  Spremeni
                </button>
              </div>
            </div>

            {adminMsg && (
              <p className={`text-sm ${adminMsg.includes("Napaka") || adminMsg.includes("mores") ? "text-red-400" : "text-emerald-400"}`}>
                {adminMsg}
              </p>
            )}
          </div>
        )}

        {/* Overview cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={<Users className="w-5 h-5 text-[#d4a054]" />} label="Uporabnikov" value={stats?.totalUsers ?? 0} />
          <StatCard icon={<Crown className="w-5 h-5 text-[#d4a054]" />} label="Narocnikov" value={stats?.activeSubscribers ?? 0} />
          <StatCard icon={<ImageIcon className="w-5 h-5 text-[#d4a054]" />} label="Obnov" value={stats?.totalRestorations ?? 0} />
        </div>

        {/* Cost cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={<ImageIcon className="w-5 h-5 text-emerald-400" />} label="Ta mesec" value={stats?.monthlyRestorations ?? 0} />
          <StatCard icon={<DollarSign className="w-5 h-5 text-amber-400" />} label="Stroski mesec" value={`€${stats?.monthlyCost ?? "0.00"}`} />
          <StatCard icon={<DollarSign className="w-5 h-5 text-red-400" />} label="Skupni stroski" value={`€${stats?.estimatedCost ?? "0.00"}`} />
        </div>

        {/* Revenue section */}
        {revenue && (
          <>
            <div className="flex items-center gap-3 pt-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className="font-display text-xl font-semibold text-[#f0ebe4]">Prihodki (Stripe)</h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard icon={<Wallet className="w-5 h-5 text-emerald-400" />} label="Celotni prihodki" value={`€${revenue.totalRevenue}`} />
              <StatCard icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} label="Ta mesec" value={`€${revenue.monthlyRevenue}`} />
              <StatCard icon={<Receipt className="w-5 h-5 text-blue-400" />} label="MRR" value={`€${revenue.mrr}`} />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard icon={<CreditCard className="w-5 h-5 text-emerald-400" />} label="Razpolozljivo" value={`€${revenue.availableBalance}`} />
              <StatCard icon={<DollarSign className="w-5 h-5 text-yellow-400" />} label="V obdelavi" value={`€${revenue.pendingBalance}`} />
              <StatCard icon={<Crown className="w-5 h-5 text-purple-400" />} label="Aktivne narocnine" value={revenue.activeSubscriptions} />
            </div>

            {revenue.recentPayments.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-semibold text-[#f0ebe4]">Zadnja placila</h2>
                <div className="bg-[#161412] border border-[#d4a054]/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#d4a054]/10">
                          <th className="text-left px-4 py-3 text-[#8a8279] font-medium">Email</th>
                          <th className="text-left px-4 py-3 text-[#8a8279] font-medium">Znesek</th>
                          <th className="text-left px-4 py-3 text-[#8a8279] font-medium">Status</th>
                          <th className="text-left px-4 py-3 text-[#8a8279] font-medium">Datum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenue.recentPayments.map((p) => (
                          <tr key={p.id} className="border-b border-[#d4a054]/5 last:border-0 hover:bg-[#1e1c19]/50">
                            <td className="px-4 py-3 text-[#f0ebe4]">{p.email}</td>
                            <td className="px-4 py-3 text-emerald-400 font-medium">€{p.amount}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.status === "paid" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-[#8a8279]">{new Date(p.created).toLocaleDateString()} {new Date(p.created).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
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
            <h2 className="font-display text-xl font-semibold text-[#f0ebe4]">Uporabniki</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8279]" />
              <input
                type="text"
                placeholder="Iskanje..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm rounded-full border border-[#d4a054]/15 bg-[#161412] text-[#f0ebe4] placeholder-[#4a4439] focus:outline-none focus:border-[#d4a054]/30 w-56"
              />
            </div>
          </div>
          <div className="bg-[#161412] border border-[#d4a054]/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#d4a054]/10">
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">Paket</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">Krediti</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">Krediti/m</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">Obnove</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">Strosek</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">Datum</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-[#d4a054]/5 last:border-0 hover:bg-[#1e1c19]/50 transition-colors">
                      <td className="px-4 py-3 text-[#f0ebe4]">{u.email}</td>
                      <td className="px-4 py-3">
                        {editingUser === u.id ? (
                          <select value={editForm.plan} onChange={(e) => setEditForm((f) => ({ ...f, plan: e.target.value }))} className="bg-[#1c1a17] border border-[#d4a054]/20 text-[#f0ebe4] text-xs rounded-lg px-2 py-1 outline-none">
                            {PLANS.map((p) => (<option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>))}
                          </select>
                        ) : (
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${planBadgeColors[u.plan] || planBadgeColors.free}`}>
                            {u.plan ? u.plan.charAt(0).toUpperCase() + u.plan.slice(1) : "Free"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingUser === u.id ? (
                          <input type="number" value={editForm.credits_remaining} onChange={(e) => setEditForm((f) => ({ ...f, credits_remaining: parseInt(e.target.value) || 0 }))} className="w-16 bg-[#1c1a17] border border-[#d4a054]/20 text-[#f0ebe4] text-xs rounded-lg px-2 py-1 outline-none" />
                        ) : <span className="text-[#f0ebe4]">{u.credits_remaining}</span>}
                      </td>
                      <td className="px-4 py-3">
                        {editingUser === u.id ? (
                          <input type="number" value={editForm.credits_per_month} onChange={(e) => setEditForm((f) => ({ ...f, credits_per_month: parseInt(e.target.value) || 0 }))} className="w-16 bg-[#1c1a17] border border-[#d4a054]/20 text-[#f0ebe4] text-xs rounded-lg px-2 py-1 outline-none" />
                        ) : <span className="text-[#8a8279]">{u.credits_per_month}</span>}
                      </td>
                      <td className="px-4 py-3 text-[#f0ebe4] font-medium">{u.total_restorations}</td>
                      <td className="px-4 py-3 text-amber-400 font-medium">€{u.estimated_cost}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${u.subscription_status === "active" ? "text-green-400" : "text-[#8a8279]"}`}>
                          {u.subscription_status || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#8a8279]">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {editingUser === u.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => saveEdit(u.id)} disabled={saving} className="p-1.5 rounded-lg text-green-400 hover:bg-green-500/10 disabled:opacity-50"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setEditingUser(null)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"><X className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <button onClick={() => startEdit(u)} className="p-1.5 rounded-lg text-[#8a8279] hover:text-[#d4a054] hover:bg-[#d4a054]/10"><Pencil className="w-4 h-4" /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan={9} className="px-4 py-8 text-center text-[#8a8279]">Ni uporabnikov</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent restorations */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-[#f0ebe4]">Nedavne obnove</h2>
          <div className="bg-[#161412] border border-[#d4a054]/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#d4a054]/10">
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">Uporabnik</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">Datum</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-[#8a8279] font-medium">Velikost</th>
                  </tr>
                </thead>
                <tbody>
                  {restorations.map((r) => (
                    <tr key={r.id} className="border-b border-[#d4a054]/5 last:border-0 hover:bg-[#1e1c19]/50">
                      <td className="px-4 py-3 text-[#f0ebe4]">{r.user_email}</td>
                      <td className="px-4 py-3 text-[#8a8279]">{new Date(r.created_at).toLocaleDateString()} {new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.status === "completed" ? "bg-green-500/10 text-green-400" : r.status === "processing" ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#8a8279]">{formatBytes(r.original_size)}</td>
                    </tr>
                  ))}
                  {restorations.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-[#8a8279]">Ni obnov</td></tr>
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

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-[#161412] border border-[#d4a054]/10 rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-[#d4a054]/10 flex items-center justify-center">{icon}</div>
        <span className="text-[#8a8279] text-sm">{label}</span>
      </div>
      <p className="text-[#f0ebe4] text-2xl font-bold font-display">{value}</p>
    </div>
  );
}

// ─── Main Page ───

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthenticated(true);
          setAdminEmail(data.email);
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0e0d0b]">
        <div className="animate-spin h-8 w-8 border-2 border-[#d4a054] border-t-transparent rounded-full" />
      </main>
    );
  }

  if (!authenticated) {
    return <AdminLogin onLogin={() => window.location.reload()} />;
  }

  return <AdminDashboard adminEmail={adminEmail} />;
}
