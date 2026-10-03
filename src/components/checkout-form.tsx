"use client";

import { useShop } from "@/context/shop";
import { taka } from "@/lib/commerce";
import { cx } from "@/lib/cx";
import { site } from "@/lib/site";
import type { PaymentMethod } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const methods: { id: PaymentMethod; label: string; hint: string }[] = [
  { id: "bkash", label: "bKash", hint: `Send money to ${site.wallets.bkash}` },
  { id: "nagad", label: "Nagad", hint: `Send money to ${site.wallets.nagad}` },
  { id: "rocket", label: "Rocket", hint: `Send money to ${site.wallets.rocket}` },
  { id: "card", label: "Visa / Mastercard", hint: "Simulated approval. No card number is collected." },
];

function validPhone(value: string) {
  return /^(?:\+?88)?01[3-9]\d{8}$/.test(value.replace(/[\s-]/g, ""));
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function CheckoutForm() {
  const shop = useShop();
  const router = useRouter();
  const [payment, setPayment] = useState<PaymentMethod>("bkash");
  const [error, setError] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<{ name?: string; phone?: string; email?: string; whatsapp?: string }>({});
  const [trxId, setTrxId] = useState("");
  const customer = {
    name: overrides.name ?? shop.session?.name ?? "",
    phone: overrides.phone ?? shop.session?.phone ?? "",
    email: overrides.email ?? shop.session?.email ?? "",
    whatsapp: overrides.whatsapp ?? shop.session?.phone ?? "",
  };

  if (!shop.ready) return <p className="text-muted">Loading your cart…</p>;
  if (shop.resolved.length === 0) {
    return (
      <div className="rounded-[1.4rem] border border-dashed border-line px-6 py-16 text-center">
        <p className="font-display text-4xl">Nothing to check out</p>
        <Link href="/collections/all" className="mt-4 inline-block rounded-full bg-ember text-white px-5 py-3 text-sm font-semibold">
          Browse products
        </Link>
      </div>
    );
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (customer.name.trim().length < 2) return setError("Enter the name for this order.");
    if (!validPhone(customer.phone)) return setError("Enter a Bangladesh mobile number.");
    if (!validEmail(customer.email)) return setError("Enter a valid email.");
    if (customer.whatsapp && !validPhone(customer.whatsapp)) return setError("WhatsApp number should be a Bangladesh mobile number.");
    if (payment !== "card" && trxId.trim().length < 4) return setError("Paste the transaction ID from your wallet app.");
    const result = shop.placeOrder({
      customer: {
        ...customer,
        whatsapp: customer.whatsapp || customer.phone,
      },
      payment,
      trxId: payment === "card" ? "CARD-SIMULATED" : trxId,
    });
    if (typeof result === "string") {
      setError(result);
      return;
    }
    router.push(`/checkout/success?order=${result.id}`);
  }

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-4">
        <Field label="Full name" value={customer.name} onChange={(name) => setOverrides({ ...overrides, name })} />
        <Field label="Mobile number" value={customer.phone} onChange={(phone) => setOverrides({ ...overrides, phone })} placeholder="01XXXXXXXXX" />
        <Field label="Email" value={customer.email} onChange={(email) => setOverrides({ ...overrides, email })} type="email" />
        <Field label="WhatsApp number" value={customer.whatsapp} onChange={(whatsapp) => setOverrides({ ...overrides, whatsapp })} placeholder="Same as mobile if blank" />
        <fieldset>
          <legend className="text-sm text-muted">Payment</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {methods.map((method) => (
              <label key={method.id} className={cx("cursor-pointer rounded-2xl border p-4", payment === method.id ? "border-gold bg-gold/10" : "border-line")}>
                <input className="sr-only" type="radio" name="payment" checked={payment === method.id} onChange={() => setPayment(method.id)} />
                <span className="block font-semibold">{method.label}</span>
                <span className="mt-1 block text-sm text-muted">{method.hint}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {payment !== "card" ? (
          <Field label="Transaction ID" value={trxId} onChange={setTrxId} placeholder="From the wallet SMS or app" />
        ) : (
          <p className="rounded-2xl border border-line px-4 py-3 text-sm text-muted">
            Card payment is simulated in this project. Placing the order does not charge a card. Connect SSLCommerz or another gateway before you take real card payments.
          </p>
        )}
        {shop.note ? <p className="text-sm text-muted">Order note: {shop.note}</p> : null}
        {error ? <p className="text-sm text-ember">{error}</p> : null}
        <button type="submit" className="rounded-full bg-ember text-white px-6 py-3 text-sm font-semibold">
          Place order · {taka(shop.total)}
        </button>
        <p className="text-xs leading-5 text-muted">
          Wallet orders are recorded in this browser together with the transaction ID you paste. Replace the wallet numbers in site settings before accepting real payments.
        </p>
      </div>
      <aside className="h-fit rounded-[1.4rem] border border-line bg-panel p-5">
        <h2 className="font-display text-3xl">Order</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {shop.resolved.map((line) => (
            <li key={`${line.slug}-${line.variantId}`} className="flex justify-between gap-3">
              <span>
                {line.product.name}
                <span className="block text-muted">{line.variant.name} × {line.qty}</span>
              </span>
              <span>{taka(line.variant.price * line.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
          <Row label="Subtotal" value={taka(shop.subtotal)} />
          {shop.discount > 0 ? <Row label="Discount" value={`−${taka(shop.discount)}`} /> : null}
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-muted">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
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
