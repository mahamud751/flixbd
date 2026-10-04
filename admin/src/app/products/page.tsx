"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api, bdt } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import { Badge, Button, ErrorBanner, inputCx, PageHeader } from "@/components/ui";

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [categorySlug, setCategorySlug] = useState("all");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api<Category[]>("/categories"), api<Product[]>("/products")])
      .then(([cats, prods]) => {
        setCategories(cats);
        setProducts(prods);
        const fromUrl = new URLSearchParams(window.location.search).get("category");
        if (fromUrl) setCategorySlug(fromUrl);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !q || product.name.toLowerCase().includes(q) || product.slug.toLowerCase().includes(q);
      const matchesCategory =
        categorySlug === "all" || product.category?.slug === categorySlug;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categorySlug]);

  async function toggleActive(product: Product) {
    setBusy(product.id);
    try {
      const updated = await api<Product>(`/products/${product.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function remove(product: Product) {
    if (!window.confirm(`Delete "${product.name}" and all of its packages?`)) return;
    setBusy(product.id);
    try {
      await api(`/products/${product.id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catalog"
        title="Products & Packages"
        description={`${filtered.length} products · ${filtered.reduce((sum, p) => sum + p.packages.length, 0)} packages`}
        actions={
          <Link href="/products/new">
            <Button>+ Add product</Button>
          </Link>
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name or slug…"
          className={`${inputCx} max-w-xs`}
        />
        <select
          value={categorySlug}
          onChange={(event) => setCategorySlug(event.target.value)}
          className={`${inputCx} max-w-xs`}
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.icon ? `${category.icon} ` : ""}
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-ink-900/60">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.02] text-left text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Packages</th>
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {filtered.map((product) => {
              const prices = product.packages.map((k) => k.price);
              return (
                <tr key={product.id} className="transition hover:bg-white/[0.025]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/products/${product.id}`}
                      className="font-medium text-slate-100 hover:text-brand-300"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-slate-500">{product.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {product.category?.icon} {product.category?.name}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{product.packages.length}</td>
                  <td className="px-4 py-3 text-slate-300">
                    {prices.length ? bdt(Math.min(...prices)) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(product)} disabled={busy === product.id}>
                      <Badge tone={product.isActive ? "green" : "red"}>
                        {product.isActive ? "active" : "inactive"}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link
                      href={`/products/${product.id}`}
                      className="mr-2 text-slate-300 hover:text-white"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => remove(product)}
                      disabled={busy === product.id}
                      className="text-rose-400 hover:text-rose-300 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {!filtered.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No products match the current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
