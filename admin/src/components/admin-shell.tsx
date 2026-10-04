"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { api, API_URL, getToken, setToken } from "@/lib/api";

const navItems = [
  { href: "/", label: "Dashboard", icon: <IconGrid /> },
  { href: "/products", label: "Products & Packages", icon: <IconBox /> },
  { href: "/categories", label: "Categories", icon: <IconTag /> },
  { href: "/users", label: "Customers", icon: <IconUsers /> },
];

/**
 * Gates every page behind the admin login. /login renders bare; everything
 * else renders inside the sidebar shell once the stored token checks out.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const isLogin = pathname === "/login";

  useEffect(() => {
    if (isLogin) return;
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    let cancelled = false;
    api<{ email: string }>("/auth/admin/me")
      .then((me) => {
        if (!cancelled) setAdminEmail(me.email);
      })
      .catch(() => {
        setToken(null);
        router.replace("/login");
      });
    return () => {
      cancelled = true;
    };
  }, [isLogin, router]);

  if (isLogin) return <>{children}</>;

  if (!adminEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-brand-500" />
          Checking admin session…
        </div>
      </div>
    );
  }

  function logout() {
    setToken(null);
    router.replace("/login");
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const sidebar = (
    <div className="flex h-full flex-col gap-8 p-5">
      <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
        <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-black ring-1 ring-brand-500/30 shadow-[0_0_24px_-4px_rgb(242_27_48/0.55)]">
          <Image src="/mark.png" alt="" width={32} height={28} style={{ width: 32, height: 28 }} priority />
        </span>
        <span className="leading-tight">
          <span className="block text-[15px] font-bold tracking-tight">StreamNest BD</span>
          <span className="block text-[11px] font-medium tracking-[0.2em] text-brand-400 uppercase">
            Admin
          </span>
        </span>
      </Link>

      <nav className="flex flex-col gap-1 text-sm">
        <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
          Manage
        </p>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition ${
                active
                  ? "bg-gradient-to-r from-brand-500/20 to-brand-500/[0.02] text-white"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
              }`}
            >
              {active ? (
                <span className="absolute top-2 bottom-2 left-0 w-[3px] rounded-full bg-brand-500" />
              ) : null}
              <span className={active ? "text-brand-400" : "text-slate-500 group-hover:text-slate-300"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <a
          href={`${API_URL}/api-docs`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-xs text-slate-400 transition hover:border-white/15 hover:text-slate-200"
        >
          API docs (Swagger)
          <span aria-hidden>↗</span>
        </a>
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-sm font-bold">
            {adminEmail.charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold text-slate-200">Administrator</span>
            <span className="block truncate text-[11px] text-slate-500">{adminEmail}</span>
          </span>
          <button
            type="button"
            onClick={logout}
            title="Log out"
            aria-label="Log out"
            className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-white/[0.06] hover:text-brand-400"
          >
            <IconLogout />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/[0.06] bg-ink-900/70 backdrop-blur lg:block">
        {sidebar}
      </aside>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-white/[0.06] bg-ink-900">
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/[0.06] bg-ink-950/80 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="cursor-pointer rounded-lg p-2 text-slate-300 hover:bg-white/[0.06]"
          >
            <IconMenu />
          </button>
          <span className="font-bold tracking-tight">
            StreamNest <span className="text-brand-400">Admin</span>
          </span>
        </header>
        <main key={pathname} className="animate-rise mx-auto w-full max-w-7xl min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function IconGrid() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconBox() {
  return (
    <svg {...iconProps}>
      <path d="M21 8 12 3 3 8l9 5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg {...iconProps}>
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg {...iconProps}>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21a7 7 0 0 1 14 0" />
      <path d="M16 3.5a4 4 0 0 1 0 9" />
      <path d="M22 21a7 7 0 0 0-4-6.3" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg {...iconProps} width={16} height={16}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg {...iconProps} width={20} height={20}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
