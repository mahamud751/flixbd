"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Category, CategoryPayload } from "@/lib/types";
import { Badge, Button, Card, ErrorBanner, Field, inputCx, PageHeader } from "@/components/ui";

type RowState = {
  id: string;
  name: string;
  icon: string;
  slug: string;
  sortOrder: string;
  isActive: boolean;
  productCount: number;
  busy: boolean;
};

export default function CategoriesPage() {
  const [rows, setRows] = useState<RowState[]>([]);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ name: "", icon: "", sortOrder: "0" });

  useEffect(() => {
    api<Category[]>("/categories")
      .then((categories) =>
        setRows(
          categories.map((category) => ({
            id: category.id,
            name: category.name,
            icon: category.icon ?? "",
            slug: category.slug,
            sortOrder: String(category.sortOrder),
            isActive: category.isActive,
            productCount: category._count?.products ?? 0,
            busy: false,
          })),
        ),
      )
      .catch((err: Error) => setError(err.message));
  }, []);

  function setRow(id: string, patch: Partial<RowState>) {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  async function createCategory(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.name.trim()) return;
    setCreating(true);
    setError("");
    try {
      const created = await api<Category>("/categories", {
        method: "POST",
        body: JSON.stringify({
          name: draft.name.trim(),
          icon: draft.icon.trim() || undefined,
          sortOrder: Number(draft.sortOrder) || 0,
        }),
      });
      setRows((prev) => [
        ...prev,
        {
          id: created.id,
          name: created.name,
          icon: created.icon ?? "",
          slug: created.slug,
          sortOrder: String(created.sortOrder),
          isActive: created.isActive,
          productCount: 0,
          busy: false,
        },
      ]);
      setDraft({ name: "", icon: "", sortOrder: "0" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCreating(false);
    }
  }

  async function saveRow(row: RowState) {
    setRow(row.id, { busy: true });
    setError("");
    try {
      const payload: CategoryPayload = {
        name: row.name.trim(),
        icon: row.icon.trim() || null,
        sortOrder: Number(row.sortOrder) || 0,
        isActive: row.isActive,
      };
      const updated = await api<Category>(`/categories/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setRow(row.id, {
        name: updated.name,
        icon: updated.icon ?? "",
        slug: updated.slug,
        sortOrder: String(updated.sortOrder),
        isActive: updated.isActive,
        busy: false,
      });
    } catch (err) {
      setError((err as Error).message);
      setRow(row.id, { busy: false });
    }
  }

  async function removeRow(row: RowState) {
    if (!window.confirm(`Delete category "${row.name}"?`)) return;
    setRow(row.id, { busy: true });
    setError("");
    try {
      await api(`/categories/${row.id}`, { method: "DELETE" });
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (err) {
      setError((err as Error).message);
      setRow(row.id, { busy: false });
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Catalog"
        title="Categories"
        description="Categories group the catalog, e.g. OTT & Entertainment, AI & Productivity."
      />

      {error ? <ErrorBanner message={error} /> : null}

      <Card>
        <form onSubmit={createCategory} className="grid items-end gap-3 md:grid-cols-4">
          <Field label="Name">
            <input
              className={inputCx}
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              placeholder="OTT & Entertainment"
            />
          </Field>
          <Field label="Icon">
            <input
              className={inputCx}
              value={draft.icon}
              onChange={(event) => setDraft({ ...draft, icon: event.target.value })}
              placeholder="🎬"
            />
          </Field>
          <Field label="Sort order">
            <input
              className={inputCx}
              type="number"
              min="0"
              value={draft.sortOrder}
              onChange={(event) => setDraft({ ...draft, sortOrder: event.target.value })}
            />
          </Field>
          <Button type="submit" disabled={creating}>
            {creating ? "Adding…" : "Add category"}
          </Button>
        </form>
      </Card>

      <div className="space-y-3">
        {rows.map((row) => (
          <Card key={row.id} className="grid items-end gap-3 md:grid-cols-12">
            <div className="md:col-span-1">
              <Field label="Icon">
                <input
                  className={inputCx}
                  value={row.icon}
                  onChange={(event) => setRow(row.id, { icon: event.target.value })}
                />
              </Field>
            </div>
            <div className="md:col-span-4">
              <Field label="Name">
                <input
                  className={inputCx}
                  value={row.name}
                  onChange={(event) => setRow(row.id, { name: event.target.value })}
                />
              </Field>
            </div>
            <div className="md:col-span-3">
              <Field label="Slug">
                <input className={`${inputCx} text-slate-400`} value={row.slug} readOnly />
              </Field>
            </div>
            <div className="md:col-span-1">
              <Field label="Sort">
                <input
                  className={inputCx}
                  type="number"
                  min="0"
                  value={row.sortOrder}
                  onChange={(event) => setRow(row.id, { sortOrder: event.target.value })}
                />
              </Field>
            </div>
            <div className="flex items-center gap-3 md:col-span-3">
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={row.isActive}
                  onChange={(event) => setRow(row.id, { isActive: event.target.checked })}
                  className="size-4 accent-brand-500"
                />
                <Badge tone={row.isActive ? "green" : "red"}>
                  {row.isActive ? "active" : "inactive"}
                </Badge>
              </label>
              <span className="text-xs text-slate-500">{row.productCount} products</span>
              <div className="ml-auto flex gap-2">
                <Button
                  variant="ghost"
                  disabled={row.busy}
                  onClick={() => saveRow(row)}
                  className="!px-2 !py-1 text-xs"
                >
                  Save
                </Button>
                <Button
                  variant="danger"
                  disabled={row.busy || row.productCount > 0}
                  onClick={() => removeRow(row)}
                  className="!px-2 !py-1 text-xs"
                  title={row.productCount > 0 ? "Remove its products first" : "Delete category"}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
