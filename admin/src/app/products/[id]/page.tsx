"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Category, Product, ProductPayload } from "@/lib/types";
import ProductForm from "@/components/product-form";
import PackagesPanel from "@/components/packages-panel";
import { Badge, Card, ErrorBanner } from "@/components/ui";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api<Product>(`/products/${id}`),
      api<Category[]>("/categories"),
    ])
      .then(([prod, cats]) => {
        setProduct(prod);
        setCategories(cats);
      })
      .catch((err: Error) => setError(err.message));
  }, [id]);

  async function handleUpdate(payload: ProductPayload) {
    if (!product) return;
    const updated = await api<Product>(`/products/${product.id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    setProduct(updated);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          href="/products"
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          ← Products
        </Link>
        <ErrorBanner message={error} />
      </div>
    );
  }

  if (!product) {
    return <p className="text-sm text-slate-400">Loading product…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/products"
            className="text-sm text-slate-400 hover:text-slate-200"
          >
            ← Products
          </Link>
          <h1 className="mt-1 flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
            {product.name}
            <Badge tone={product.isActive ? "green" : "red"}>
              {product.isActive ? "active" : "inactive"}
            </Badge>
          </h1>
          <p className="text-sm text-slate-500">
            /products/{product.slug} · {product.category?.name}
          </p>
        </div>
        {saved ? <Badge tone="green">Saved</Badge> : null}
      </div>

      <Card>
        <h2 className="mb-4 font-semibold">Product details</h2>
        <ProductForm
          product={product}
          categories={categories}
          submitLabel="Save product"
          onSubmit={handleUpdate}
        />
      </Card>

      <PackagesPanel productId={product.id} />
    </div>
  );
}
