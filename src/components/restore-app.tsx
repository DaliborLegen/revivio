"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useLang } from "@/lib/lang-context";
import {
  Upload,
  Download,
  Loader2,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Crown,
} from "lucide-react";

type Stage = "upload" | "processing" | "done" | "error";

export function RestoreApp() {
  const { t } = useLang();
  const r = t.restore;
  const cr = t.credits;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<Stage>("upload");
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [restoredSrc, setRestoredSrc] = useState<string | null>(null);
  const [restoredMime, setRestoredMime] = useState<string>("image/png");
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.credits_remaining !== undefined) {
          setCredits(data.credits_remaining);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      const reader = new FileReader();
      reader.onload = () => setOriginalSrc(reader.result as string);
      reader.readAsDataURL(file);

      setStage("processing");
      setErrorMsg("");

      try {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("/api/restore", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.code === "NO_CREDITS") {
            setCredits(0);
          }
          throw new Error(data.error || r.error);
        }

        const mime = data.mimeType || "image/png";
        setRestoredMime(mime);
        setRestoredSrc(`data:${mime};base64,${data.image}`);
        setStage("done");

        if (data.creditsRemaining !== undefined) {
          setCredits(data.creditsRemaining);
        }
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : r.error);
        setStage("error");
      }
    },
    [r.error]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const reset = () => {
    setStage("upload");
    setOriginalSrc(null);
    setRestoredSrc(null);
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const downloadRestored = () => {
    if (!restoredSrc) return;
    const ext = restoredMime.includes("png") ? "png" : "jpg";
    const a = document.createElement("a");
    a.href = restoredSrc;
    a.download = `revivio-restored.${ext}`;
    a.click();
  };

  const noCredits = credits !== null && credits <= 0;

  return (
    <main className="flex-1 pt-28 pb-20">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
          <div className="h-[600px] w-[600px] rounded-full bg-[#d4a054]/5 blur-[150px]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d4a054]/20 bg-[#d4a054]/5 px-5 py-2 text-sm font-medium text-[#d4a054]">
            <Sparkles className="size-4" />
            {r.title}
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-[#f0ebe4] sm:text-5xl">
            {r.title}
          </h1>
          <p className="mt-4 text-lg text-[#8a8279]">{r.subtitle}</p>

          {/* Credit counter */}
          {!loadingProfile && credits !== null && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#d4a054]/12 bg-[#161412] px-4 py-2 text-sm">
              <div
                className={`size-2 rounded-full ${
                  credits > 5
                    ? "bg-emerald-500"
                    : credits > 0
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
              />
              <span className="font-semibold text-[#f0ebe4]">{credits}</span>
              <span className="text-[#8a8279]">{cr.remaining}</span>
            </div>
          )}
        </div>

        {/* No credits prompt */}
        {noCredits && stage === "upload" && (
          <div className="mx-auto max-w-2xl text-center">
            <div className="rounded-3xl border border-[#d4a054]/15 bg-[#161412] p-12">
              <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-[#d4a054]/10 ring-1 ring-[#d4a054]/20">
                <Crown className="size-9 text-[#d4a054]" />
              </div>
              <h2 className="text-xl font-semibold text-[#f0ebe4]">
                {cr.noCredits}
              </h2>
              <p className="mt-3 text-[#8a8279]">{cr.upgradePrompt}</p>
              <a href="/pricing" className="mt-8 inline-block">
                <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d4a054] to-[#a67830] px-8 py-3.5 text-sm font-semibold text-[#0e0d0b] shadow-[0_0_40px_rgba(212,160,84,0.2)] transition-all hover:shadow-[0_0_60px_rgba(212,160,84,0.3)] hover:brightness-110">
                  <Crown className="size-4" />
                  {cr.upgrade}
                </button>
              </a>
            </div>
          </div>
        )}

        {/* Upload stage */}
        {stage === "upload" && !noCredits && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group mx-auto max-w-2xl cursor-pointer rounded-3xl border-2 border-dashed p-16 text-center transition-all duration-500 ${
              dragOver
                ? "border-[#d4a054]/60 bg-[#d4a054]/8 shadow-[0_0_60px_rgba(212,160,84,0.1)]"
                : "border-[#d4a054]/15 hover:border-[#d4a054]/30 hover:bg-[#d4a054]/[0.03]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onFileSelect}
              className="hidden"
            />
            <div className="mx-auto mb-8 flex size-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#d4a054]/12 to-[#d4a054]/5 ring-1 ring-[#d4a054]/10 transition-all group-hover:scale-110 group-hover:ring-[#d4a054]/20">
              <Upload className="size-10 text-[#d4a054]" />
            </div>
            <p className="text-xl font-semibold text-[#f0ebe4]">{r.dropzone}</p>
            <p className="mt-3 text-sm text-[#8a8279]">{r.dropzoneFormats}</p>
          </div>
        )}

        {/* Processing stage */}
        {stage === "processing" && (
          <div className="mx-auto max-w-2xl text-center">
            {originalSrc && (
              <div className="mb-10 overflow-hidden rounded-2xl border border-[#d4a054]/10">
                <img
                  src={originalSrc}
                  alt="Original"
                  className="mx-auto max-h-[400px] object-contain"
                />
              </div>
            )}
            <div className="flex flex-col items-center gap-5">
              <div className="flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#d4a054] to-[#a67830] shadow-[0_0_50px_rgba(212,160,84,0.3)]">
                <Loader2 className="size-9 animate-spin text-[#0e0d0b]" />
              </div>
              <div>
                <p className="text-xl font-semibold text-[#f0ebe4]">{r.processing}</p>
                <p className="mt-2 text-sm text-[#8a8279]">{r.processingSubtitle}</p>
              </div>
            </div>
          </div>
        )}

        {/* Done stage */}
        {stage === "done" && originalSrc && restoredSrc && (
          <div>
            <div className="mb-8 flex items-center justify-center gap-3">
              <CheckCircle2 className="size-6 text-emerald-500" />
              <p className="text-lg font-semibold text-emerald-400">
                {r.done}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Original */}
              <div className="overflow-hidden rounded-2xl border border-[#d4a054]/8 bg-[#161412]">
                <div className="border-b border-[#d4a054]/8 px-5 py-3 text-center text-sm font-medium text-[#8a8279]">
                  {r.original}
                </div>
                <div className="flex items-center justify-center p-5">
                  <img
                    src={originalSrc}
                    alt="Original"
                    className="max-h-[500px] rounded-lg object-contain"
                  />
                </div>
              </div>

              {/* Restored */}
              <div className="overflow-hidden rounded-2xl border border-[#d4a054]/25 bg-[#161412] shadow-[0_0_60px_rgba(212,160,84,0.08)]">
                <div className="border-b border-[#d4a054]/20 bg-gradient-to-r from-[#d4a054]/8 to-transparent px-5 py-3 text-center text-sm font-semibold text-[#d4a054]">
                  <Sparkles className="mb-0.5 mr-1.5 inline size-4" />
                  {r.restored}
                </div>
                <div className="flex items-center justify-center p-5">
                  <img
                    src={restoredSrc}
                    alt="Restored"
                    className="max-h-[500px] rounded-lg object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={downloadRestored}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d4a054] to-[#a67830] px-8 py-3.5 text-sm font-semibold text-[#0e0d0b] shadow-[0_0_40px_rgba(212,160,84,0.2)] transition-all hover:shadow-[0_0_60px_rgba(212,160,84,0.3)] hover:brightness-110"
              >
                <Download className="size-4" />
                {r.download}
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full border border-[#d4a054]/15 px-8 py-3.5 text-sm font-medium text-[#8a8279] transition-all hover:border-[#d4a054]/30 hover:text-[#f0ebe4]"
              >
                <RotateCcw className="size-4" />
                {r.tryAnother}
              </button>
            </div>
          </div>
        )}

        {/* Error stage */}
        {stage === "error" && (
          <div className="mx-auto max-w-2xl text-center">
            {originalSrc && (
              <div className="mb-10 overflow-hidden rounded-2xl border border-[#d4a054]/8">
                <img
                  src={originalSrc}
                  alt="Original"
                  className="mx-auto max-h-[400px] object-contain"
                />
              </div>
            )}
            <div className="flex flex-col items-center gap-5">
              <div className="flex size-20 items-center justify-center rounded-3xl bg-red-500/10 ring-1 ring-red-500/20">
                <AlertCircle className="size-9 text-red-400" />
              </div>
              <p className="text-lg font-semibold text-red-400">
                {errorMsg || r.error}
              </p>
              {noCredits ? (
                <a href="/pricing">
                  <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d4a054] to-[#a67830] px-8 py-3.5 text-sm font-semibold text-[#0e0d0b] transition-all hover:brightness-110">
                    <Crown className="size-4" />
                    {cr.upgrade}
                  </button>
                </a>
              ) : (
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d4a054] to-[#a67830] px-8 py-3.5 text-sm font-semibold text-[#0e0d0b] transition-all hover:brightness-110"
                >
                  <RotateCcw className="size-4" />
                  {r.tryAnother}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-16 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#6a6259] transition-colors hover:text-[#d4a054]"
          >
            <ArrowLeft className="size-4" />
            {r.backHome}
          </a>
        </div>
      </div>
    </main>
  );
}
