import { CheckoutForm } from "@/components/checkout-form";
import { PageIntro, Shell } from "@/components/page-intro";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter your name, phone, and address, then send the order on WhatsApp.",
};

export default function Page() {
  return (
    <Shell>
      <PageIntro eyebrow="Checkout" title="Your details" lede="Fill in your details and place the order. WhatsApp opens with your full order so you can send it to us." />
      <CheckoutForm />
    </Shell>
  );
}
