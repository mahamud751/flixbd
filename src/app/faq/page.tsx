import { FaqList } from "@/components/faq-list";
import { PageIntro, Shell } from "@/components/page-intro";
import { faqs } from "@/data/content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ", description: "Delivery, payment, refunds, and what a profile is." };

export default function Page() {
  return (
    <Shell>
      <PageIntro eyebrow="Support" title="Questions" lede="Bangla answers are on the home page. The full list is here in English." />
      <FaqList items={faqs} />
    </Shell>
  );
}
