"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export const inputCx =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-100 transition placeholder:text-slate-600 focus:border-brand-500/70 focus:bg-white/[0.05] focus:ring-4 focus:ring-brand-500/15 focus:outline-none disabled:opacity-50 [&>option]:bg-ink-900";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="block text-xs text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

const buttonVariants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-[0_8px_24px_-12px_rgb(242_27_48/0.8)] hover:from-brand-400 hover:to-brand-500",
  ghost:
    "border border-white/10 bg-white/[0.03] text-slate-200 hover:border-white/20 hover:bg-white/[0.06]",
  danger:
    "border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:border-rose-500/60 hover:bg-rose-500/20",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${buttonVariants[variant]} ${className ?? ""}`}
    />
  );
}

type BadgeTone = "green" | "red" | "amber" | "slate" | "sky";

const badgeTones: Record<BadgeTone, string> = {
  green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  red: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  slate: "bg-slate-500/10 text-slate-300 border-slate-500/30",
  sky: "bg-brand-500/10 text-brand-300 border-brand-500/30",
};

export function Badge({
  tone = "slate",
  children,
}: {
  tone?: BadgeTone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap ${badgeTones[tone]}`}
    >
      {children}
    </span>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
      {message}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-ink-900/60 p-5 shadow-[0_1px_0_0_rgb(255_255_255/0.03)_inset] backdrop-blur ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1.5 text-[11px] font-semibold tracking-[0.18em] text-brand-400 uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-1.5 text-sm text-slate-400">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-900/60 p-5 backdrop-blur transition hover:border-brand-500/30">
      <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl transition group-hover:bg-brand-500/20" />
      <div className="relative flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">{label}</p>
        {icon ? (
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.04] text-lg ring-1 ring-white/[0.06]">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="relative mt-3 text-3xl font-bold tracking-tight">{value}</p>
      {hint ? <p className="relative mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function Avatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-xs font-bold ring-1 ring-white/10">
      {initials || "?"}
    </span>
  );
}
