"use client";

import { ProductArt } from "@/components/product-art";
import { useShop } from "@/context/shop";
import {
  compareAtPrice,
  discountPercent,
  inStock,
  priceLabel,
  taka,
} from "@/lib/commerce";
import type { Product } from "@/lib/types";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  const shop = useShop();
  const available = inStock(product);
  const discount = discountPercent(product);
  const compare = compareAtPrice(product);
  const single = product.variants.filter(
    (variant) => variant.available && variant.price > 0,
  );
  const direct = single.length === 1 ? single[0] : null;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-line bg-night transition hover:shadow-[0_8px_24px_rgba(17,20,24,0.08)]">
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden bg-panel">
          <ProductArt
            compact
            slug={product.slug}
            name={product.name}
            category={product.category}
            image={product.image}
            sizes="(min-width: 1280px) 320px, (min-width: 768px) 33vw, 50vw"
            className="h-full transition duration-500 group-hover:scale-[1.03]"
          />
          {discount ? (
            <span className="absolute top-2.5 left-2.5 rounded bg-sale px-2 py-0.5 text-xs font-bold text-white">
              -{discount}%
            </span>
          ) : null}
          {!available ? (
            <span className="absolute top-2.5 right-2.5 rounded bg-ink px-2 py-0.5 text-xs font-semibold text-night">
              Sold out
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col px-3 pt-3">
          <p className="text-[11px] font-medium tracking-wide text-muted uppercase">
            {product.typeLabel}
          </p>
          <h3 className="mt-1 line-clamp-2 text-[15px] leading-snug font-semibold group-hover:underline">
            {product.name}
          </h3>
          <p className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-2 text-sm">
            {available ? (
              <>
                <span className={compare ? "font-bold text-sale" : "font-bold"}>
                  {priceLabel(product)}
                </span>
                {compare ? (
                  <span className="text-muted line-through">
                    {taka(compare)}
                  </span>
                ) : null}
              </>
            ) : (
              <span className="text-muted">Sold out</span>
            )}
          </p>
        </div>
      </Link>
      <div className="p-3">
        {direct ? (
          <button
            type="button"
            onClick={() => shop.add(product.slug, direct.id)}
            className="w-full rounded-md bg-ember px-3 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
          >
            Add to cart
          </button>
        ) : (
          <Link
            href={`/products/${product.slug}`}
            className="block w-full rounded-md bg-[#e9e9e9] px-3 py-2.5 text-center text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
          >
            {available ? "Choose options" : "Sold out"}
          </Link>
        )}
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line px-6 py-16 text-center text-muted">
        Nothing matches those filters.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
