"use client";

import { useShop } from "@/context/shop";
import { orderWhatsappText, taka } from "@/lib/commerce";
import { whatsappHref } from "@/lib/site";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function SuccessPanel() {
  const params = useSearchParams();
  const shop = useShop();
  const id = params.get("order") ?? "";
  const order = shop.ready ? shop.findOrder(id) : undefined;

  if (!shop.ready) return <p className="text-muted">Loading the order…</p>;
  if (!order) {
    return (
      <div>
        <h1 className="font-display text-5xl">Order not on this device</h1>
        <p className="mt-3 text-muted">If you just checked out in another browser, the receipt stays there. You can still message support with the order ID.</p>
        <Link href="/track" className="mt-5 inline-block text-gold">Track an order</Link>
      </div>
    );
  }

  const text = orderWhatsappText(order);

  return (
    <div className="max-w-2xl">
      <p className="text-xs tracking-[0.2em] text-gold uppercase">Order placed</p>
      <h1 className="mt-2 font-display text-6xl leading-none">{order.id}</h1>
      <p className="mt-4 text-muted">
        Total {taka(order.total)}. If WhatsApp didn&apos;t open, tap the button below and press send — we confirm the order and share details on {order.customer.phone}.
      </p>
      <ul className="mt-6 space-y-2 text-sm">
        {order.lines.map((line) => (
          <li key={`${line.slug}-${line.variantId}`} className="flex justify-between gap-3 border-b border-line py-2">
            <span>{line.name} · {line.variantName} × {line.qty}</span>
            <span>{taka(line.price * line.qty)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={whatsappHref(text)} target="_blank" rel="noreferrer" className="rounded-full bg-ember text-white px-5 py-3 text-sm font-semibold">
          Send order on WhatsApp
        </a>
        <Link href="/collections/all" className="rounded-full border border-line px-5 py-3 text-sm font-semibold">
          Keep shopping
        </Link>
      </div>
    </div>
  );
}
