"use client";

import { useShop } from "@/context/shop";
import { orderWhatsappText, taka } from "@/lib/commerce";
import { whatsappHref } from "@/lib/site";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function validPhone(value: string) {
  return /^(?:\+?88)?01[3-9]\d{8}$/.test(value.replace(/[\s-]/g, ""));
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function CheckoutForm() {
  const shop = useShop();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<{
    name?: string;
    phone?: string;
    address?: string;
    email?: string;
  }>({});
  const customer = {
    name: overrides.name ?? shop.session?.name ?? "",
    phone: overrides.phone ?? shop.session?.phone ?? "",
    address: overrides.address ?? "",
    email: overrides.email ?? shop.session?.email ?? "",
  };

  if (!shop.ready || !shop.productsReady)
    return <p className="text-muted">Loading your cart…</p>;
  if (shop.resolved.length === 0) {
    return (
      <div className="rounded-[1.4rem] border border-dashed border-line px-6 py-16 text-center">
        <p className="font-display text-4xl">Nothing to check out</p>
        <Link
          href="/collections/all"
          className="mt-4 inline-block rounded-full bg-ember text-white px-5 py-3 text-sm font-semibold"
        >
          Browse products
        </Link>
      </div>
    );
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (customer.name.trim().length < 2) return setError("Enter your name.");
    if (!validPhone(customer.phone))
      return setError("Enter a Bangladesh mobile number, like 01XXXXXXXXX.");
    if (customer.address.trim().length < 4)
      return setError("Enter your address.");
    if (customer.email.trim() && !validEmail(customer.email.trim()))
      return setError("Enter a valid email, or leave it blank.");
    const result = shop.placeOrder({
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        email: customer.email.trim(),
      },
    });
    if (typeof result === "string") {
      setError(result);
      return;
    }
    window.open(whatsappHref(orderWhatsappText(result)), "_blank", "noopener");
    router.push(`/checkout/success?order=${result.id}`);
  }

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-4">
        <Field
          label="Full name"
          value={customer.name}
          onChange={(name) => setOverrides({ ...overrides, name })}
          autoComplete="name"
        />
        <Field
          label="Phone number"
          value={customer.phone}
          onChange={(phone) => setOverrides({ ...overrides, phone })}
          placeholder="01XXXXXXXXX"
          type="tel"
          autoComplete="tel"
        />
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">Address</span>
          <textarea
            value={customer.address}
            rows={3}
            autoComplete="street-address"
            placeholder="House, road, area, city"
            onChange={(event) =>
              setOverrides({ ...overrides, address: event.target.value })
            }
            className="w-full rounded-2xl border border-line bg-black/[0.04] px-4 py-3 outline-none focus:border-gold"
          />
        </label>
        <Field
          label="Email (optional)"
          value={customer.email}
          onChange={(email) => setOverrides({ ...overrides, email })}
          type="email"
          autoComplete="email"
        />
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">Order note (optional)</span>
          <input
            value={shop.note}
            onChange={(event) => shop.setNote(event.target.value)}
            className="w-full rounded-2xl border border-line bg-black/[0.04] px-4 py-3 outline-none focus:border-gold"
          />
        </label>
        {error ? <p className="text-sm text-ember">{error}</p> : null}
        <button
          type="submit"
          className="w-full rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-[#06210f] sm:w-auto"
        >
          Place order on WhatsApp · {taka(shop.total)}
        </button>
        <p className="text-xs leading-5 text-muted">
          WhatsApp opens with your cart and details filled in. Press send there
          to confirm the order.
        </p>
      </div>
      <aside className="h-fit rounded-[1.4rem] border border-line bg-panel p-5">
        <h2 className="font-display text-3xl">Order</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {shop.resolved.map((line) => (
            <li
              key={`${line.slug}-${line.variantId}`}
              className="flex justify-between gap-3"
            >
              <span>
                {line.product.name}
                <span className="block text-muted">
                  {line.variant.name} × {line.qty}
                </span>
              </span>
              <span>{taka(line.variant.price * line.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
          <Row label="Subtotal" value={taka(shop.subtotal)} />
          {shop.discount > 0 ? (
            <Row label="Discount" value={`−${taka(shop.discount)}`} />
          ) : null}
          <Row label="Delivery" value="Tk 0" />
          <p className="flex justify-between font-display text-2xl">
            <span>Total</span>
            <span>{taka(shop.total)}</span>
          </p>
        </div>
      </aside>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-muted">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-line bg-black/[0.04] px-4 py-3 outline-none focus:border-gold"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex justify-between text-muted">
      <span>{label}</span>
      <span>{value}</span>
    </p>
  );
}
