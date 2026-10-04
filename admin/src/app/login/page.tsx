"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { api, getToken, setToken } from "@/lib/api";
import type { AdminLoginResponse } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already signed in: skip the form. The shell re-validates the token.
  useEffect(() => {
    if (getToken()) router.replace("/");
  }, [router]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await api<AdminLoginResponse>("/auth/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(token);
      router.replace("/");
    } catch (err) {
      const message = (err as Error).message;
      setError(message === "Failed to fetch" ? "Cannot reach the API. Is the backend running?" : message);
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel */}
      <section className="relative hidden overflow-hidden border-r border-white/[0.06] bg-black lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-brand-600/25 blur-[120px]" />
        <div className="pointer-events-none absolute right-[-10rem] bottom-[-12rem] h-[30rem] w-[30rem] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(255 255 255) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />

        <div className="relative flex items-center gap-3">
          <Image src="/mark.png" alt="" width={44} height={38} style={{ width: 44, height: 38 }} priority />
          <span className="text-lg font-bold tracking-tight">StreamNest BD</span>
        </div>

        <div className="relative max-w-md">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_2px_rgb(242_27_48/0.6)]" />
            Control room
          </p>
          <h1 className="text-5xl leading-[1.05] font-extrabold tracking-tight">
            Every plan, price and customer,{" "}
            <span className="bg-gradient-to-r from-brand-400 to-orange-300 bg-clip-text text-transparent">
              in one place.
            </span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate-400">
            Update Netflix, ChatGPT, VPN and gift card packages. Changes go live in the shop the
            moment you save.
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-4 text-sm">
          {[
            ["Streaming", "🎬"],
            ["AI tools", "🤖"],
            ["Gift cards", "🎮"],
          ].map(([label, icon]) => (
            <div key={label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur">
              <div className="text-xl">{icon}</div>
              <div className="mt-2 font-medium text-slate-300">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="animate-rise w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Image src="/mark.png" alt="" width={36} height={31} style={{ width: 36, height: 31 }} priority />
            <span className="font-bold tracking-tight">
              StreamNest <span className="text-brand-400">Admin</span>
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-400">Sign in with the admin account to manage the shop.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold tracking-wide text-slate-400 uppercase">Email</span>
              <input
                type="email"
                required
                autoComplete="username"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@streamnestbd.com"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-100 transition outline-none placeholder:text-slate-600 focus:border-brand-500/70 focus:bg-white/[0.05] focus:ring-4 focus:ring-brand-500/15"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold tracking-wide text-slate-400 uppercase">Password</span>
              <span className="relative block">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pr-16 pl-4 text-sm text-slate-100 transition outline-none placeholder:text-slate-600 focus:border-brand-500/70 focus:bg-white/[0.05] focus:ring-4 focus:ring-brand-500/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-2 my-auto h-8 cursor-pointer rounded-lg px-2.5 text-xs font-medium text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
            </label>

            {error ? (
              <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgb(242_27_48/0.7)] transition hover:from-brand-400 hover:to-brand-500 disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : null}
              {loading ? "Signing in…" : "Sign in"}
              {!loading ? <span className="transition group-hover:translate-x-0.5">→</span> : null}
            </button>
          </form>

          <p className="mt-10 text-center text-xs text-slate-600">
            Restricted area · StreamNest BD staff only
          </p>
        </div>
      </section>
    </div>
  );
}
