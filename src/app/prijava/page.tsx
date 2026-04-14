"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useLang } from "@/lib/lang-context";
import { LangProvider } from "@/lib/lang-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Camera, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

function AuthForm() {
  const { t } = useLang();
  const a = t.auth;
  const supabase = createClient();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "register" && password !== confirmPassword) {
      setError(a.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.href = "/restore";
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setSuccess(a.checkEmail);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="flex-1 pt-28 pb-20">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
          <div className="h-[600px] w-[600px] rounded-full bg-[#d4a054]/5 blur-[150px]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-md px-4 sm:px-6">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center">
          <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d4a054] to-[#a67830] text-[#0e0d0b] shadow-lg shadow-[#d4a054]/20">
            <Camera className="size-7" />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[#f0ebe4]">
            {mode === "login" ? a.welcome : a.welcomeNew}
          </h1>
          <p className="mt-2 text-sm text-[#8a8279]">
            {mode === "login" ? a.subtitle : a.subtitleNew}
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-[#d4a054]/10 bg-[#161412] p-8">
          {/* Google button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#d4a054]/15 bg-[#1c1a17] py-3 text-sm font-medium text-[#f0ebe4] transition-all hover:border-[#d4a054]/30 hover:bg-[#d4a054]/5 disabled:opacity-50"
          >
            <svg className="size-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {a.google}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#d4a054]/10" />
            <span className="text-xs text-[#6a6259]">{a.orContinueWith}</span>
            <div className="h-px flex-1 bg-[#d4a054]/10" />
          </div>

          {/* Email/Password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#8a8279]">
                {a.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#6a6259]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#d4a054]/10 bg-[#0e0d0b] py-3 pl-11 pr-4 text-sm text-[#f0ebe4] placeholder-[#4a4439] outline-none transition-all focus:border-[#d4a054]/30 focus:ring-1 focus:ring-[#d4a054]/20"
                  placeholder="ime@email.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#8a8279]">
                {a.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#6a6259]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-[#d4a054]/10 bg-[#0e0d0b] py-3 pl-11 pr-11 text-sm text-[#f0ebe4] placeholder-[#4a4439] outline-none transition-all focus:border-[#d4a054]/30 focus:ring-1 focus:ring-[#d4a054]/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6a6259] hover:text-[#8a8279]"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#8a8279]">
                  {a.confirmPassword}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#6a6259]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-[#d4a054]/10 bg-[#0e0d0b] py-3 pl-11 pr-4 text-sm text-[#f0ebe4] placeholder-[#4a4439] outline-none transition-all focus:border-[#d4a054]/30 focus:ring-1 focus:ring-[#d4a054]/20"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">
                <CheckCircle2 className="size-4 shrink-0" />
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4a054] to-[#a67830] py-3 text-sm font-semibold text-[#0e0d0b] shadow-[0_0_30px_rgba(212,160,84,0.15)] transition-all hover:shadow-[0_0_40px_rgba(212,160,84,0.25)] hover:brightness-110 disabled:opacity-50"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {mode === "login" ? a.loginButton : a.registerButton}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="mt-6 text-center text-sm text-[#8a8279]">
            {mode === "login" ? a.noAccount : a.hasAccount}{" "}
            <button
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
                setSuccess("");
              }}
              className="font-medium text-[#d4a054] hover:text-[#e0b06a]"
            >
              {mode === "login" ? a.register : a.login}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function PrijavaPage() {
  return (
    <LangProvider>
      <Navbar />
      <AuthForm />
      <Footer />
    </LangProvider>
  );
}
