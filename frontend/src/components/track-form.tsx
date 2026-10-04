"use client";

import { useShop } from "@/context/shop";
import { taka } from "@/lib/commerce";
import { whatsappHref } from "@/lib/site";
import Link from "next/link";
import { useState } from "react";

export function TrackForm() {
  const shop = useShop();
  const [id, setId] = useState("");
  const [lookup, setLookup] = useState<string | null>(null);
  const order = lookup ? shop.findOrder(lookup) : undefined;

  return (
    <div className="max-w-xl">
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          setLookup(id);
        }}
      >
        <input value={id} onChange={(event) => setId(event.target.value.toUpperCase())} placeholder="SFX-XXXXXX" className="w-full rounded-full border border-line bg-black/[0.04] px-5 py-3 outline-none" />
        <button type="submit" className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-night">Track</button>
      </form>
      {!shop.ready ? <p className="mt-4 text-sm text-muted">Checking orders saved in this browser…</p> : null}
      {lookup && shop.ready && !order ? (
        <p className="mt-4 text-sm text-muted">No order {lookup} is saved on this device. Orders stay in the browser where checkout was completed.</p>
      ) : null}
      {order ? (
        <article className="mt-6 rounded-[1.4rem] border border-line p-5">
          <p className="text-xs tracking-[0.18em] text-gold uppercase">Placed</p>
          <h2 className="mt-1 font-display text-4xl">{order.id}</h2>
          <p className="mt-2 text-sm text-muted">{new Date(order.createdAt).toLocaleString("en-BD")} · {taka(order.total)}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {order.lines.map((line) => (
              <li key={`${line.slug}-${line.variantId}`}>
                <Link className="text-gold" href={`/products/${line.slug}`}>{line.name}</Link> · {line.variantName} × {line.qty}
              </li>
            ))}
          </ul>
          <a className="mt-5 inline-block text-sm underline" href={whatsappHref(`Hi, this is about order ${order.id}.`)}>
            Message support about this order
          </a>
        </article>
      ) : null}
    </div>
  );
}
