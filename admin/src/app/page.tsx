"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, bdt } from "@/lib/api";
import type { Category, Customer, Product } from "@/lib/types";
import { Avatar, Badge, Card, ErrorBanner, PageHeader, StatCard } from "@/components/ui";

export default function DashboardPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newThisWeek, setNewThisWeek] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<Category[]>("/categories"),
      api<Product[]>("/products"),
      api<Customer[]>("/users"),
    ])
      .then(([cats, prods, users]) => {
        setCategories(cats);
        setProducts(prods);
        setCustomers(users);
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        setNewThisWeek(users.filter((c) => new Date(c.createdAt).getTime() >= weekAgo).length);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const packageCount = products.reduce((sum, p) => sum + p.packages.length, 0);
  const activeProducts = products.filter((p) => p.isActive).length;
  const availablePackages = products.reduce(
    (sum, p) => sum + p.packages.filter((k) => k.isAvailable).length,
    0,
  );
  const prices = products.flatMap((p) =>
    p.packages.filter((k) => k.isAvailable).map((k) => k.price),
  );
  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;
  const activeCustomers = customers.filter((c) => c.isActive).length;
  const maxPackagesInCategory = Math.max(
    1,
    ...categories.map((category) =>
      products
        .filter((p) => p.categoryId === category.id)
        .reduce((sum, p) => sum + p.packages.length, 0),
    ),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Packages catalog and customer accounts for StreamNest BD."
        actions={
          <Link
            href="/products/new"
            className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgb(242_27_48/0.8)] transition hover:from-brand-400 hover:to-brand-500"
          >
            + Add product
          </Link>
        }
      />

      {error ? <ErrorBanner message={`API error: ${error}`} /> : null}

      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Products"
              icon="📦"
              value={
                <>
                  {activeProducts}
                  <span className="text-base font-medium text-slate-500"> / {products.length}</span>
                </>
              }
              hint={`active / total · ${categories.length} categories`}
            />
            <StatCard
              label="Packages"
              icon="🏷️"
              value={
                <>
                  {availablePackages}
                  <span className="text-base font-medium text-slate-500"> / {packageCount}</span>
                </>
              }
              hint="available / total"
            />
            <StatCard
              label="Price range"
              icon="৳"
              value={minPrice === null ? "—" : bdt(minPrice)}
              hint={maxPrice === null ? "no available packages" : `up to ${bdt(maxPrice)}`}
            />
            <StatCard
              label="Customers"
              icon="👥"
              value={customers.length}
              hint={`${activeCustomers} active · ${newThisWeek} new this week`}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold">Catalog by category</h2>
                <Link href="/products" className="text-sm font-medium text-brand-400 hover:text-brand-300">
                  Manage products →
                </Link>
              </div>
              <div className="space-y-2">
                {categories.map((category) => {
                  const inCategory = products.filter((p) => p.categoryId === category.id);
                  const packagesInCategory = inCategory.reduce((sum, p) => sum + p.packages.length, 0);
                  return (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.slug}`}
                      className="group block rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-3 text-sm transition hover:border-brand-500/30 hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2.5 font-medium">
                          <span className="text-lg">{category.icon}</span>
                          {category.name}
                          {!category.isActive ? <Badge tone="red">inactive</Badge> : null}
                        </span>
                        <span className="text-xs text-slate-400">
                          {inCategory.length} products · {packagesInCategory} packages
                        </span>
                      </div>
                      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all group-hover:to-orange-300"
                          style={{ width: `${(packagesInCategory / maxPackagesInCategory) * 100}%` }}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>

            <Card>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold">Newest customers</h2>
                <Link href="/users" className="text-sm font-medium text-brand-400 hover:text-brand-300">
                  All customers →
                </Link>
              </div>
              {customers.length === 0 ? (
                <p className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-500">
                  No one has registered yet.
                </p>
              ) : (
                <ul className="space-y-1">
                  {customers.slice(0, 6).map((customer) => (
                    <li key={customer.id}>
                      <Link
                        href={`/users?q=${encodeURIComponent(customer.email)}`}
                        className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/[0.04]"
                      >
                        <Avatar name={customer.name} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{customer.name}</span>
                          <span className="block truncate text-xs text-slate-500">{customer.email}</span>
                        </span>
                        <span className="shrink-0 text-xs text-slate-500">
                          {new Date(customer.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

