"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Category, Product, ProductPayload } from "@/lib/types";
import ProductForm from "@/components/product-form";
import { Card, ErrorBanner } from "@/components/ui";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Category[]>("/categories")
      .then(setCategories)
      .catch((err: Error) => setError(err.message));
  }, []);

  async function handleCreate(payload: ProductPayload) {
    const created = await api<Product>("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    router.push(`/products/${created.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/products" className="text-sm text-slate-400 hover:text-slate-200">
          ← Products
        </Link>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Add product</h1>
      </div>

      {error ? <ErrorBanner message={error} /> : null}

      <Card>
        <ProductForm
          product={null}
          categories={categories}
          submitLabel="Create product"
          onSubmit={handleCreate}
        />
      </Card>
    </div>
  );
}
