"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Customer } from "@/lib/types";
import { Avatar, Badge, Button, Card, ErrorBanner, inputCx, PageHeader, StatCard } from "@/components/ui";

const dateTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export default function UsersPage() {
  return (
    <Suspense>
      <UsersView />
    </Suspense>
  );
}

function UsersView() {
  // ?q= from the dashboard pre-fills the search box.
  const params = useSearchParams();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState(() => params.get("q") ?? "");
  const [status, setStatus] = useState<"all" | "active" | "disabled">("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [selected, setSelected] = useState<Customer | null>(null);

  const load = useCallback((term: string) => {
    const query = term.trim() ? `?search=${encodeURIComponent(term.trim())}` : "";
    return api<Customer[]>(`/users${query}`)
      .then((list) => {
        setCustomers(list);
        setError("");
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Server-side search, debounced while typing.
  useEffect(() => {
    const timer = window.setTimeout(() => void load(search), 250);
    return () => window.clearTimeout(timer);
  }, [search, load]);

  async function toggleActive(customer: Customer) {
    setBusy(customer.id);
    try {
      const updated = await api<Customer>(`/users/${customer.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !customer.isActive }),
      });
      setCustomers((list) => list.map((c) => (c.id === updated.id ? updated : c)));
      setSelected((current) => (current?.id === updated.id ? updated : current));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function remove(customer: Customer) {
    if (!window.confirm(`Delete ${customer.name} (${customer.email})? This cannot be undone.`)) return;
    setBusy(customer.id);
    try {
      await api(`/users/${customer.id}`, { method: "DELETE" });
      setCustomers((list) => list.filter((c) => c.id !== customer.id));
      setSelected((current) => (current?.id === customer.id ? null : current));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  const visible = customers.filter((c) =>
    status === "all" ? true : status === "active" ? c.isActive : !c.isActive,
  );
  const activeCount = customers.filter((c) => c.isActive).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Accounts"
        title="Customers"
        description="People who registered on the storefront with email and password."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label={search ? "Matching" : "Registered"} icon="👥" value={customers.length} />
        <StatCard label="Active" icon="✅" value={activeCount} hint="can log in" />
        <StatCard label="Disabled" icon="⛔" value={customers.length - activeCount} hint="login blocked" />
      </div>

      {error ? <ErrorBanner message={error} /> : null}

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, email or phone…"
          className={`${inputCx} max-w-sm`}
        />
        <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1 text-sm">
          {(["all", "active", "disabled"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatus(value)}
              className={`cursor-pointer rounded-lg px-3 py-1.5 font-medium capitalize transition ${
                status === value ? "bg-brand-500/20 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-ink-900/60">
          <table className="w-full min-w-[44rem] text-sm">
            <thead className="bg-white/[0.02] text-left text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    Loading customers…
                  </td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    {search || status !== "all" ? "No customers match." : "No one has registered yet."}
                  </td>
                </tr>
              ) : (
                visible.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => setSelected(customer)}
                    className={`cursor-pointer transition hover:bg-white/[0.025] ${
                      selected?.id === customer.id ? "bg-brand-500/[0.06]" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={customer.name} />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{customer.name}</p>
                          <p className="truncate text-xs text-slate-500">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{customer.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge tone={customer.isActive ? "green" : "red"}>
                        {customer.isActive ? "active" : "disabled"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(customer.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2" onClick={(event) => event.stopPropagation()}>
                        <Button
                          variant="ghost"
                          disabled={busy === customer.id}
                          onClick={() => toggleActive(customer)}
                        >
                          {customer.isActive ? "Disable" : "Enable"}
                        </Button>
                        <Button variant="danger" disabled={busy === customer.id} onClick={() => remove(customer)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Card className="h-fit xl:sticky xl:top-10">
          {selected ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Avatar name={selected.name} />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{selected.name}</p>
                  <Badge tone={selected.isActive ? "green" : "red"}>
                    {selected.isActive ? "active" : "disabled"}
                  </Badge>
                </div>
              </div>
              <dl className="space-y-3 text-sm">
                {[
                  ["Email", selected.email],
                  ["Mobile", selected.phone || "—"],
                  ["Joined", dateTime(selected.createdAt)],
                  ["Last login", dateTime(selected.lastLoginAt)],
                  ["Customer ID", selected.id],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">{label}</dt>
                    <dd className="mt-0.5 break-all text-slate-200">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex gap-2">
                {selected.phone ? (
                  <a
                    href={`https://wa.me/${selected.phone.replace(/^\+?(?:88)?/, "88")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                  >
                    WhatsApp
                  </a>
                ) : null}
                <a
                  href={`mailto:${selected.email}`}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-center text-sm font-semibold text-slate-200 transition hover:bg-white/[0.06]"
                >
                  Email
                </a>
              </div>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-slate-500">Select a customer to see their details.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
