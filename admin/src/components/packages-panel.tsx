"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Package, PackagePayload } from "@/lib/types";
import { Badge, Button, Card, Field, inputCx } from "@/components/ui";

type RowState = {
  id: string;
  name: string;
  profileType: string;
  duration: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  sortOrder: string;
  isAvailable: boolean;
};

function toRow(pkg: Package): RowState {
  return {
    id: pkg.id,
    name: pkg.name,
    profileType: pkg.profileType ?? "",
    duration: pkg.duration ?? "",
    price: String(pkg.price),
    compareAtPrice:
      pkg.compareAtPrice != null ? String(pkg.compareAtPrice) : "",
    stock: String(pkg.stock),
    sortOrder: String(pkg.sortOrder),
    isAvailable: pkg.isAvailable,
  };
}

function deriveName(row: {
  name: string;
  profileType: string;
  duration: string;
}): string {
  if (row.name.trim()) return row.name.trim();
  return (
    [row.profileType.trim(), row.duration.trim()].filter(Boolean).join(" · ") ||
    "Standard"
  );
}

function rowPayload(row: RowState): PackagePayload {
  return {
    name: deriveName(row),
    profileType: row.profileType.trim() || null,
    duration: row.duration.trim() || null,
    price: Number(row.price) || 0,
    compareAtPrice: row.compareAtPrice.trim()
      ? Number(row.compareAtPrice)
      : null,
    stock: Number(row.stock) || 0,
    sortOrder: Number(row.sortOrder) || 0,
    isAvailable: row.isAvailable,
  };
}

export default function PackagesPanel({ productId }: { productId: string }) {
  const [rows, setRows] = useState<RowState[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({
    profileType: "",
    duration: "",
    price: "",
    compareAtPrice: "",
    stock: "100",
  });

  useEffect(() => {
    let cancelled = false;
    api<Package[]>(`/packages?productId=${productId}`)
      .then((packages) => {
        if (!cancelled) setRows(packages.map(toRow));
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  function setRow(id: string, patch: Partial<RowState>) {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  }

  async function saveRow(row: RowState) {
    setBusyId(row.id);
    setError("");
    try {
      const updated = await api<Package>(`/packages/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify(rowPayload(row)),
      });
      setRows((prev) =>
        prev.map((r) => (r.id === updated.id ? toRow(updated) : r)),
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  async function removeRow(row: RowState) {
    if (!window.confirm(`Delete package "${row.name}"?`)) return;
    setBusyId(row.id);
    setError("");
    try {
      await api(`/packages/${row.id}`, { method: "DELETE" });
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  async function addPackage(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.price.trim()) {
      setError("Price is required for a new package.");
      return;
    }
    setAdding(true);
    setError("");
    try {
      const payload: PackagePayload = {
        productId,
        name: deriveName({ ...draft, name: "" }),
        profileType: draft.profileType.trim() || null,
        duration: draft.duration.trim() || null,
        price: Number(draft.price) || 0,
        compareAtPrice: draft.compareAtPrice.trim()
          ? Number(draft.compareAtPrice)
          : null,
        stock: Number(draft.stock) || 100,
      };
      const created = await api<Package>("/packages", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setRows((prev) => [...prev, toRow(created)]);
      setDraft({
        profileType: "",
        duration: "",
        price: "",
        compareAtPrice: "",
        stock: "100",
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAdding(false);
    }
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Packages ({rows.length})</h2>
        <p className="text-xs text-slate-500">
          The display name derives from profile type · duration when the name
          field is empty.
        </p>
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      <form
        onSubmit={addPackage}
        className="grid gap-3 rounded-xl border border-white/[0.06] bg-white/[0.015] p-3 md:grid-cols-6"
      >
        <Field label="Profile type">
          <input
            className={inputCx}
            value={draft.profileType}
            onChange={(event) =>
              setDraft({ ...draft, profileType: event.target.value })
            }
            placeholder="Shared Profile"
          />
        </Field>
        <Field label="Duration">
          <input
            className={inputCx}
            value={draft.duration}
            onChange={(event) =>
              setDraft({ ...draft, duration: event.target.value })
            }
            placeholder="1 Month"
          />
        </Field>
        <Field label="Price (৳)">
          <input
            className={inputCx}
            type="number"
            min="0"
            value={draft.price}
            onChange={(event) =>
              setDraft({ ...draft, price: event.target.value })
            }
            placeholder="350"
          />
        </Field>
        <Field label="Compare at (৳)">
          <input
            className={inputCx}
            type="number"
            min="0"
            value={draft.compareAtPrice}
            onChange={(event) =>
              setDraft({ ...draft, compareAtPrice: event.target.value })
            }
            placeholder="450"
          />
        </Field>
        <Field label="Stock">
          <input
            className={inputCx}
            type="number"
            min="0"
            value={draft.stock}
            onChange={(event) =>
              setDraft({ ...draft, stock: event.target.value })
            }
          />
        </Field>
        <div className="flex items-end">
          <Button type="submit" disabled={adding} className="w-full">
            {adding ? "Adding…" : "Add"}
          </Button>
        </div>
      </form>

      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className="grid gap-3 rounded-xl border border-white/[0.06] bg-white/[0.015] p-3 md:grid-cols-12"
          >
            <div className="md:col-span-2">
              <Field label="Profile type">
                <input
                  className={inputCx}
                  value={row.profileType}
                  onChange={(event) =>
                    setRow(row.id, { profileType: event.target.value })
                  }
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Duration">
                <input
                  className={inputCx}
                  value={row.duration}
                  onChange={(event) =>
                    setRow(row.id, { duration: event.target.value })
                  }
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Name">
                <input
                  className={inputCx}
                  value={row.name}
                  onChange={(event) =>
                    setRow(row.id, { name: event.target.value })
                  }
                  placeholder="auto"
                />
              </Field>
            </div>
            <div className="md:col-span-1">
              <Field label="Price">
                <input
                  className={inputCx}
                  type="number"
                  min="0"
                  value={row.price}
                  onChange={(event) =>
                    setRow(row.id, { price: event.target.value })
                  }
                />
              </Field>
            </div>
            <div className="md:col-span-1">
              <Field label="Compare">
                <input
                  className={inputCx}
                  type="number"
                  min="0"
                  value={row.compareAtPrice}
                  onChange={(event) =>
                    setRow(row.id, { compareAtPrice: event.target.value })
                  }
                />
              </Field>
            </div>
            <div className="md:col-span-1">
              <Field label="Stock">
                <input
                  className={inputCx}
                  type="number"
                  min="0"
                  value={row.stock}
                  onChange={(event) =>
                    setRow(row.id, { stock: event.target.value })
                  }
                />
              </Field>
            </div>
            <div className="md:col-span-1">
              <Field label="Sort">
                <input
                  className={inputCx}
                  type="number"
                  min="0"
                  value={row.sortOrder}
                  onChange={(event) =>
                    setRow(row.id, { sortOrder: event.target.value })
                  }
                />
              </Field>
            </div>
            <div className="flex items-end justify-between gap-2 md:col-span-2">
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={row.isAvailable}
                  onChange={(event) =>
                    setRow(row.id, { isAvailable: event.target.checked })
                  }
                  className="size-4 accent-brand-500"
                />
                <Badge tone={row.isAvailable ? "green" : "red"}>
                  {row.isAvailable ? "available" : "hidden"}
                </Badge>
              </label>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  disabled={busyId === row.id}
                  onClick={() => saveRow(row)}
                  className="!px-2 !py-1 text-xs"
                >
                  Save
                </Button>
                <Button
                  variant="danger"
                  disabled={busyId === row.id}
                  onClick={() => removeRow(row)}
                  className="!px-2 !py-1 text-xs"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
        {loaded && !rows.length ? (
          <p className="py-6 text-center text-sm text-slate-500">
            No packages yet — add the first plan above.
          </p>
        ) : null}
      </div>
    </Card>
  );
}
