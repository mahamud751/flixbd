"use client";

import { useShop } from "@/context/shop";
import { stockCount, taka } from "@/lib/commerce";
import { cx } from "@/lib/cx";
import { site, whatsappHref } from "@/lib/site";
import type { Product, Variant } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";

function unique(values: Array<string | undefined>) {
  const seen: string[] = [];
  for (const value of values) {
    if (value && !seen.includes(value)) seen.push(value);
  }
  return seen;
}

/** "Shared Profile" → "Shared". Keeps the VPN note when there is one. */
function profileLabel(value: string) {
  return value.replace(/ Profile(?= \(|$)/, "");
}

function groupTitle(variants: Variant[], profiles: string[], durations: string[]) {
  if (profiles.length && durations.length) return "";
  if (durations.length) return "Duration";
  if (profiles.length) {
    if (profiles.some((item) => /edition/i.test(item))) return "Edition";
    return "Profile type";
  }
  if (variants.some((item) => /\d/.test(item.name) && /USD|EUR|GBP|AUD|CAD|AED|₹/.test(item.name)))
    return "Amount";
  return "Select option";
}

export function BuyBox({ product }: { product: Product }) {
  const shop = useShop();
  const router = useRouter();
  const first = product.variants.find((variant) => variant.available && variant.price > 0) ?? product.variants[0];
  const [variantId, setVariantId] = useState(first?.id ?? "");
  const [qty, setQty] = useState(1);
  const variant = useMemo(
    () => product.variants.find((item) => item.id === variantId) ?? first,
    [first, product.variants, variantId],
  );
  const listed = product.variants.filter((item) => item.available && item.price > 0);
  const profiles = unique(listed.map((item) => item.profileType));
  const durationsForProfile = unique(
    listed
      .filter((item) => !variant?.profileType || item.profileType === variant.profileType)
      .map((item) => item.duration),
  );
  const split = profiles.length > 0 && durationsForProfile.length > 0;
  const purchasable = Boolean(variant && variant.available && variant.price > 0);
  const stock = stockCount(product);

  function chooseProfile(profile: string) {
    const kept = product.variants.find(
      (item) =>
        item.profileType === profile &&
        item.duration === variant?.duration &&
        item.available &&
        item.price > 0,
    );
    const next =
      kept ??
      product.variants.find(
        (item) => item.profileType === profile && item.available && item.price > 0,
      );
    if (next) setVariantId(next.id);
  }

  function chooseDuration(duration: string) {
    const next = product.variants.find(
      (item) =>
        item.profileType === variant?.profileType &&
        item.duration === duration &&
        item.available &&
        item.price > 0,
    );
    if (next) setVariantId(next.id);
  }

  function add(open: boolean) {
    if (!purchasable || !variant) return;
    shop.add(product.slug, variant.id, qty, open);
    if (!open) router.push("/checkout");
  }

  const whatsapp = whatsappHref(
    `Hi ${site.name}, I want to order ${product.name}${variant ? ` (${variant.name})` : ""}${purchasable && variant ? ` — ${taka(variant.price)}` : ""}.`,
  );

  return (
    <div className="rounded-[1.6rem] border border-line bg-panel/80 p-5 sm:p-6">
      <p className="text-xs tracking-[0.2em] text-gold uppercase">{product.typeLabel}</p>
      <h1 className="mt-2 font-display text-4xl leading-[0.95] tracking-tight sm:text-5xl">{product.name}</h1>
      <p className="mt-3 text-muted">{product.blurb}</p>
      <div className="mt-4 flex items-end gap-3">
        <p className="font-display text-4xl">{purchasable && variant ? taka(variant.price) : "Sold out"}</p>
        {variant?.compareAt && variant.compareAt > variant.price ? (
          <p className="mb-1 text-muted line-through">{taka(variant.compareAt)}</p>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-leaf">
        {purchasable ? `${stock.toLocaleString("en-US")} in stock` : "Out of stock"}
        <span className="text-muted"> · Free digital delivery</span>
      </p>

      {variant && (profiles.length > 0 || durationsForProfile.length > 0 || listed.length > 0) ? (
        split ? (
          <div className="mt-6 space-y-5">
            {profiles.length > 0 ? (
              <OptionGroup label="Profile type">
                {profiles.map((profile) => (
                  <OptionChip
                    key={profile}
                    label={profileLabel(profile)}
                    pressed={variant.profileType === profile}
                    onClick={() => chooseProfile(profile)}
                  />
                ))}
              </OptionGroup>
            ) : null}
            {durationsForProfile.length > 0 ? (
              <OptionGroup label="Duration">
                {durationsForProfile.map((duration) => (
                  <OptionChip
                    key={duration}
                    label={duration}
                    pressed={variant.duration === duration}
                    onClick={() => chooseDuration(duration)}
                  />
                ))}
              </OptionGroup>
            ) : null}
          </div>
        ) : (
          <OptionGroup
            label={groupTitle(listed, profiles, durationsForProfile)}
            className="mt-6"
          >
            {listed.map((item) => {
              const label = item.duration ?? (item.profileType ? profileLabel(item.profileType) : item.name);
              return (
                <OptionChip
                  key={item.id}
                  label={label}
                  pressed={item.id === variant.id}
                  onClick={() => setVariantId(item.id)}
                />
              );
            })}
          </OptionGroup>
        )
      ) : null}

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

function OptionGroup({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className={className}>
      <legend className="text-sm text-muted">{label}</legend>
      <div className="mt-2 grid grid-cols-2 gap-2.5">{children}</div>
    </fieldset>
  );
}

function OptionChip({
  label,
  pressed,
  onClick,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cx(
        "min-h-14 rounded-2xl border-2 px-3 py-3 text-center text-sm leading-snug transition",
        pressed
          ? "border-gold bg-[#fff1f0] font-semibold text-ink"
          : "border-line bg-white font-medium text-ink hover:border-black/25",
      )}
    >
      {label}
    </button>
  );
}
