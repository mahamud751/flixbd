"use client";

import { ProductArt } from "@/components/product-art";
import { useShop } from "@/context/shop";
import { applyCoupon, popularSearches, taka } from "@/lib/commerce";
import { coupons } from "@/lib/commerce";
import Link from "next/link";
import { useState } from "react";

export function CartView({ mode }: { mode: "drawer" | "page" }) {
  const shop = useShop();
  const [draft, setDraft] = useState(shop.coupon);
  const [ship, setShip] = useState<string | null>(null);

  function applyDraft() {
    shop.setCoupon(draft);
    const result = applyCoupon(draft, shop.subtotal, shop.resolved);
    shop.pushToast(result.ok ? `${result.code} applied` : result.message);
  }

  return (
    <div className={mode === "page" ? "grid gap-8 lg:grid-cols-[1.4fr_0.8fr]" : "flex h-full flex-col"}>
      <div className={mode === "drawer" ? "flex-1 space-y-4 overflow-y-auto pr-1" : "space-y-4"}>
        {shop.resolved.length === 0 ? (
          <div className="rounded-[1.4rem] border border-dashed border-line px-5 py-10 text-center">
            <p className="font-display text-3xl">Your cart is empty</p>
            <p className="mt-2 text-sm text-muted">Not sure where to start? Try a popular plan.</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-left">
              {popularSearches.slice(0, 4).map((product) => (
                <Link key={product.slug} href={`/products/${product.slug}`} onClick={() => shop.setPanel(null)} className="rounded-2xl border border-line p-3 text-sm hover:border-gold">
                  {product.name}
                </Link>
              ))}
            </div>
            <Link href="/collections/all" onClick={() => shop.setPanel(null)} className="mt-5 inline-block rounded-full bg-ember text-white px-5 py-3 text-sm font-semibold">
              Continue shopping
            </Link>
          </div>
        ) : (
          shop.resolved.map((line) => {
            const blocked = !line.variant.available || line.variant.price <= 0;
            return (
              <div key={`${line.slug}-${line.variantId}`} className="flex gap-3 rounded-2xl border border-line p-3">
                <Link href={`/products/${line.slug}`} onClick={() => shop.setPanel(null)} className="w-20 shrink-0">
                  <ProductArt compact slug={line.product.slug} name={line.product.name} category={line.product.category} className="aspect-square rounded-xl" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${line.slug}`} onClick={() => shop.setPanel(null)} className="font-medium leading-tight">
                    {line.product.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted">{line.variant.name}</p>
                  {blocked ? <p className="mt-1 text-xs text-ember">Sold out — remove to check out</p> : null}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center rounded-full border border-line text-sm">
                      <button type="button" className="px-2.5 py-1" aria-label={`Decrease quantity for ${line.product.name}`} onClick={() => shop.setQty(line.slug, line.variantId, line.qty - 1)}>−</button>
                      <span className="min-w-5 text-center">{line.qty}</span>
                      <button type="button" className="px-2.5 py-1" aria-label={`Increase quantity for ${line.product.name}`} onClick={() => shop.setQty(line.slug, line.variantId, line.qty + 1)}>+</button>
                    </div>
                    <p className="text-sm">{taka(line.variant.price * line.qty)}</p>
                  </div>
                  <button type="button" onClick={() => shop.remove(line.slug, line.variantId)} className="mt-1 text-xs text-muted underline">
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <aside className={mode === "drawer" ? "space-y-3 border-t border-line pt-4" : "h-fit space-y-3 rounded-[1.4rem] border border-line bg-panel p-5"}>
        <p className="rounded-full bg-leaf/15 px-3 py-2 text-center text-xs text-leaf">
          Digital delivery is free on every order.
        </p>
        <details className="rounded-2xl border border-line px-3 py-2 text-sm">
          <summary className="cursor-pointer">Order note</summary>
          <textarea
            value={shop.note}
            onChange={(event) => shop.setNote(event.target.value)}
            rows={3}
            placeholder="Anything support should know"
            className="mt-2 w-full resize-none rounded-xl border border-line bg-transparent px-3 py-2 outline-none"
          />
        </details>
        <details className="rounded-2xl border border-line px-3 py-2 text-sm">
          <summary className="cursor-pointer">Estimate delivery</summary>
          <p className="mt-2 text-muted">Country is Bangladesh. Products are digital, so there is no courier fee.</p>
          <button type="button" onClick={() => setShip("Delivery charge Tk 0. WhatsApp delivery, usually within 4 hours of support time.")} className="mt-2 rounded-full border border-line px-3 py-1.5">
            Calculate
          </button>
          {ship ? <p className="mt-2 text-leaf">{ship}</p> : null}
        </details>
        <details className="rounded-2xl border border-line px-3 py-2 text-sm" open={mode === "page"}>
          <summary className="cursor-pointer">Coupon</summary>
          <div className="mt-2 flex gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value.toUpperCase())}
              placeholder="SAVA10"
              className="w-full rounded-xl border border-line bg-transparent px-3 py-2 outline-none"
            />
            <button type="button" onClick={applyDraft} className="rounded-xl bg-black/5 px-3">
              Apply
            </button>
          </div>
          <ul className="mt-2 space-y-1 text-xs text-muted">
            {coupons.map((coupon) => (
              <li key={coupon.code}>
                <button type="button" className="text-gold" onClick={() => setDraft(coupon.code)}>
                  {coupon.code}
                </button>{" "}
                — {coupon.detail}
              </li>
            ))}
          </ul>
          {shop.couponLabel ? <p className="mt-2 text-leaf">{shop.couponLabel} applied.</p> : null}
          {shop.couponMessage ? <p className="mt-2 text-ember">{shop.couponMessage}</p> : null}
        </details>
        <div className="flex justify-between text-sm text-muted">
          <span>Subtotal</span>
          <span>{taka(shop.subtotal)}</span>
        </div>
        {shop.discount > 0 ? (
          <div className="flex justify-between text-sm text-leaf">
            <span>Discount</span>
            <span>−{taka(shop.discount)}</span>
          </div>
        ) : null}
        <div className="flex justify-between font-display text-2xl">
          <span>Total</span>
          <span>{taka(shop.total)} BDT</span>
        </div>
        <div className="grid gap-2">
          {mode === "drawer" ? (
            <Link href="/cart" onClick={() => shop.setPanel(null)} className="rounded-full border border-line px-4 py-3 text-center text-sm font-semibold">
              View cart
            </Link>
          ) : null}
          <Link
            href="/checkout"
            aria-disabled={shop.resolved.length === 0}
            onClick={(event) => {
              if (shop.resolved.length === 0) event.preventDefault();
              shop.setPanel(null);
            }}
            className="rounded-full bg-ember text-white px-4 py-3 text-center text-sm font-semibold aria-disabled:opacity-40"
          >
            Check out
          </Link>
        </div>
      </aside>
    </div>
  );
}
