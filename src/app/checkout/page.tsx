import { CheckoutForm } from "@/components/checkout-form";
import { PageIntro, Shell } from "@/components/page-intro";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Pay with bKash, Nagad, Rocket, or a simulated card and place the order.",
};

export default function Page() {
  return (
    <Shell>
      <PageIntro eyebrow="Checkout" title="Payment" lede="Wallet payments need a transaction ID. The order is saved in this browser and confirmed on the next screen." />
      <CheckoutForm />
    </Shell>
  );
}
