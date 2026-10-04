"use client";

import { ProductGrid } from "@/components/product-card";
import { fromPrice, inStock } from "@/lib/commerce";
import type { Product } from "@/lib/types";
import { useMemo, useState } from "react";

type Sort = "featured" | "az" | "za" | "low" | "high";

export function CollectionBrowser({ products }: { products: Product[] }) {
  const [stock, setStock] = useState<"all" | "in" | "out">("all");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [open, setOpen] = useState(false);

  const visible = useMemo(() => {
    const minValue = min ? Number(min) : null;
    const maxValue = max ? Number(max) : null;
    const filtered = products.filter((product) => {
      const available = inStock(product);
      if (stock === "in" && !available) return false;
      if (stock === "out" && available) return false;
      const price = fromPrice(product);
      if (minValue != null && (price == null || price < minValue)) return false;
      if (maxValue != null && (price == null || price > maxValue)) return false;
      return true;
    });
    const copy = [...filtered];
    if (sort === "az") copy.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") copy.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === "low") copy.sort((a, b) => (fromPrice(a) ?? 0) - (fromPrice(b) ?? 0));
    if (sort === "high") copy.sort((a, b) => (fromPrice(b) ?? 0) - (fromPrice(a) ?? 0));
    return copy;
  }, [max, min, products, sort, stock]);

  const active = (stock !== "all" ? 1 : 0) + (min || max ? 1 : 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">{visible.length} products</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-full border border-line px-4 py-2 text-sm">
            Filter {active ? `(${active})` : ""}
          </button>
          <label className="rounded-full border border-line px-3 py-2 text-sm">
            <span className="sr-only">Sort</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as Sort)} className="bg-transparent outline-none">
              <option value="featured">Featured</option>
              <option value="az">Alphabetically, A-Z</option>
              <option value="za">Alphabetically, Z-A</option>
              <option value="low">Price, low to high</option>
              <option value="high">Price, high to low</option>
            </select>
          </label>
        </div>
      </div>
      {open ? (
        <form className="mb-6 grid gap-4 rounded-[1.4rem] border border-line p-4 sm:grid-cols-3" onSubmit={(event) => event.preventDefault()}>
          <fieldset>
            <legend className="text-sm text-muted">Availability</legend>
            <label className="mt-2 flex gap-2 text-sm"><input type="radio" name="stock" checked={stock === "all"} onChange={() => setStock("all")} /> All</label>
            <label className="mt-1 flex gap-2 text-sm"><input type="radio" name="stock" checked={stock === "in"} onChange={() => setStock("in")} /> In stock</label>
            <label className="mt-1 flex gap-2 text-sm"><input type="radio" name="stock" checked={stock === "out"} onChange={() => setStock("out")} /> Out of stock</label>
          </fieldset>
          <label className="text-sm text-muted">
            From Tk 
            <input inputMode="numeric" value={min} onChange={(event) => setMin(event.target.value.replace(/[^\d]/g, ""))} className="mt-2 w-full rounded-xl border border-line bg-transparent px-3 py-2 text-ink outline-none" />
          </label>
          <label className="text-sm text-muted">
            To Tk 
            <input inputMode="numeric" value={max} onChange={(event) => setMax(event.target.value.replace(/[^\d]/g, ""))} className="mt-2 w-full rounded-xl border border-line bg-transparent px-3 py-2 text-ink outline-none" />
          </label>
        </form>
      ) : null}
      <ProductGrid products={visible} />
    </div>
  );
}
