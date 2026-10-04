"use client";

import { useShop } from "@/context/shop";
import { taka } from "@/lib/commerce";
import Link from "next/link";
import { useState } from "react";

export function AccountPanel({ mode }: { mode: "login" | "register" | "account" }) {
  const shop = useShop();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  if (!shop.ready) return <p className="text-muted">Loading account…</p>;

  async function onRegister(event: React.FormEvent) {
    event.preventDefault();
    if (form.name.trim().length < 2) return setError("Enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("Enter a valid email.");
    if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(form.phone.replace(/[\s-]/g, ""))) return setError("Enter a Bangladesh mobile number.");
    if (form.password.length < 6) return setError("Use at least 6 characters. Do not reuse a password from another site.");
    const message = await shop.register(form);
    setError(message);
  }

  async function onLogin(event: React.FormEvent) {
    event.preventDefault();
    const message = await shop.login(form.email, form.password);
    setError(message);
  }

  if (shop.session) {
    const mine = shop.orders.filter((order) => order.email === shop.session?.email);
    return (
      <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="rounded-[1.4rem] border border-line p-5">
          <p className="text-xs tracking-[0.18em] text-gold uppercase">Signed in</p>
          <h1 className="mt-2 font-display text-4xl">{shop.session.name}</h1>
          <p className="mt-2 text-sm text-muted">{shop.session.email}</p>
          <p className="text-sm text-muted">{shop.session.phone}</p>
          <button type="button" onClick={shop.logout} className="mt-5 rounded-full border border-line px-4 py-2 text-sm">
            Log out
          </button>
        </aside>
        <div>
          <h2 className="font-display text-3xl">Orders on this device</h2>
          {mine.length === 0 ? (
            <p className="mt-3 text-muted">No orders for this email yet. <Link className="text-gold" href="/collections/all">Start shopping</Link></p>
          ) : (
            <ul className="mt-4 space-y-3">
              {mine.map((order) => (
                <li key={order.id} className="rounded-2xl border border-line p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Link href={`/checkout/success?order=${order.id}`} className="font-semibold">{order.id}</Link>
                    <span className="text-sm">{taka(order.total)}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{new Date(order.createdAt).toLocaleString("en-BD")} · {taka(order.total)} · placed</p>
                  <p className="mt-2 text-sm text-muted">{order.lines.map((line) => `${line.name} (${line.variantName})`).join(", ")}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  const register = mode === "register";
  return (
    <form onSubmit={register ? onRegister : onLogin} className="mx-auto max-w-lg space-y-4">
      <h1 className="font-display text-5xl leading-none">{register ? "Create account" : "Log in"}</h1>
      <p className="text-sm text-muted">Your account works on any device. Use a password you do not use anywhere else.</p>
      {register ? <Text label="Name" value={form.name} onChange={(name) => setForm({ ...form, name })} /> : null}
      <Text label="Email" value={form.email} onChange={(email) => setForm({ ...form, email })} type="email" />
      {register ? <Text label="Mobile" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} /> : null}
      <Text label="Password" value={form.password} onChange={(password) => setForm({ ...form, password })} type="password" />
      {error ? <p className="text-sm text-ember">{error}</p> : null}
      <button type="submit" className="rounded-full bg-ember text-white px-5 py-3 text-sm font-semibold">
        {register ? "Create account" : "Log in"}
      </button>
      <p className="text-sm text-muted">
        {register ? (
          <Link href="/login" className="text-gold">Already registered? Log in</Link>
        ) : (
          <Link href="/register" className="text-gold">New here? Create an account</Link>
        )}
      </p>
    </form>
  );
}

function Text({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-muted">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-line bg-black/[0.04] px-4 py-3 outline-none focus:border-gold" />
    </label>
  );
}
