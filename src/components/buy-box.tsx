"use client";

import { useShop } from "@/context/shop";
import { stockCount, taka } from "@/lib/commerce";
import { cx } from "@/lib/cx";
import { site, whatsappHref } from "@/lib/site";
import type { Product } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export function BuyBox({ product }: { product: Product }) {
  const shop = useShop();
  const router = useRouter();
  const first = product.variants.find((variant) => variant.available && variant.price > 0) ?? product.variants[0];
  const [variantId, setVariantId] = useState(first.id);
  const [qty, setQty] = useState(1);
  const variant = useMemo(
    () => product.variants.find((item) => item.id === variantId) ?? first,
    [first, product.variants, variantId],
  );
  const purchasable = variant.available && variant.price > 0;
  const stock = stockCount(product);

  function add(open: boolean) {
    if (!purchasable) return;
    shop.add(product.slug, variant.id, qty, open);
    if (!open) router.push("/checkout");
  }

  const whatsapp = whatsappHref(
    `Hi ${site.name}, I want to order ${product.name} (${variant.name})${purchasable ? ` — ${taka(variant.price)}` : ""}.`,
  );

  return (
    <div className="rounded-[1.6rem] border border-line bg-panel/80 p-5 sm:p-6">
      <p className="text-xs tracking-[0.2em] text-gold uppercase">{product.typeLabel}</p>
      <h1 className="mt-2 font-display text-4xl leading-[0.95] tracking-tight sm:text-5xl">{product.name}</h1>
      <p className="mt-3 text-muted">{product.blurb}</p>
      <div className="mt-4 flex items-end gap-3">
        <p className="font-display text-4xl">{purchasable ? taka(variant.price) : "Sold out"}</p>
        {variant.compareAt && variant.compareAt > variant.price ? (
          <p className="mb-1 text-muted line-through">{taka(variant.compareAt)}</p>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-leaf">
        {purchasable ? `${stock.toLocaleString("en-US")} in stock` : "Out of stock"}
        <span className="text-muted"> · Free digital delivery</span>
      </p>

      <fieldset className="mt-6">
        <legend className="text-sm text-muted">Select option</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.variants.map((item) => {
            const on = item.id === variant.id;
            const off = !item.available || item.price <= 0;
            return (
              <button
                key={item.id}
                type="button"
                disabled={off}
                onClick={() => setVariantId(item.id)}
                className={cx(
                  "rounded-full border px-3 py-2 text-left text-sm transition",
                  on ? "border-gold bg-gold text-night" : "border-line hover:border-black/30",
                  off && "cursor-not-allowed opacity-40 line-through",
                )}
              >
                {item.name}
                {item.price > 0 ? <span className="ml-2 opacity-70">{taka(item.price)}</span> : null}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 flex items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-line">
          <button type="button" className="px-3 py-2" aria-label={`Decrease quantity for ${product.name}`} onClick={() => setQty((value) => Math.max(1, value - 1))}>−</button>
          <span className="min-w-6 text-center text-sm">{qty}</span>
          <button type="button" className="px-3 py-2" aria-label={`Increase quantity for ${product.name}`} onClick={() => setQty((value) => Math.min(10, value + 1))}>+</button>
        </div>
        <p className="text-sm text-muted">Up to 10</p>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <button type="button" disabled={!purchasable} onClick={() => add(true)} className="rounded-full bg-ember text-white px-4 py-3 text-sm font-semibold disabled:opacity-40">
          Add to cart
        </button>
        <button type="button" disabled={!purchasable} onClick={() => add(false)} className="rounded-full bg-gold px-4 py-3 text-sm font-semibold text-night disabled:opacity-40">
          Buy now
        </button>
      </div>
      <a href={whatsapp} target="_blank" rel="noreferrer" className="mt-2 block rounded-full border border-line px-4 py-3 text-center text-sm font-semibold">
        Order on WhatsApp
      </a>
      {product.caution ? <p className="mt-4 text-sm leading-6 text-gold/90">{product.caution}</p> : null}
      <ul className="mt-5 space-y-2 text-sm text-muted">
        {product.features.map((feature) => (
          <li key={feature} className="flex gap-2">
            <span className="text-gold">▸</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
