import { CartView } from "@/components/cart-view";
import { PageIntro, Shell } from "@/components/page-intro";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cart", description: "Review products, notes, delivery, and coupons." };

export default function Page() {
  return (
    <Shell>
      <PageIntro eyebrow="Cart" title="Your cart" lede="Add a note, estimate digital delivery, or apply SAVA10, WELCOME50, or COMBO100." />
      <CartView mode="page" />
    </Shell>
  );
}
