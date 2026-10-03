import { PageIntro, Shell } from "@/components/page-intro";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Savasaachi Flix BD sells digital subscriptions and gift cards in Bangladesh.",
};

export default function Page() {
  return (
    <Shell>
      <PageIntro
        eyebrow="Company"
        title="Savasaachi Flix BD"
        lede="A digital shop for streaming plans, AI tools, gift cards, and software keys, paid with Bangladesh wallets."
      />
      <div className="max-w-3xl space-y-4 leading-7 text-muted">
        <p>
          Orders are placed on the site, paid with bKash, Nagad, Rocket, or card, and delivered on WhatsApp. The product page says whether you receive a profile, a redeem code, or a license key.
        </p>
        <p>
          {site.name} is not Netflix, Amazon, Disney, Warner Bros., Apple, Microsoft, or any other brand listed in the catalog. Those names are used so you can tell the services apart.
        </p>
        <p>
          Shop address: {site.address}. Support: {site.hours}, {site.hoursNote}. Email {site.email}. Phone {site.phoneDisplay}.
        </p>
        <p>
          Before you take real payments, replace the phone, wallet numbers, address, and social links in <span className="text-ink">src/lib/site.ts</span>, and connect a payment gateway. This build records checkout in the browser so the full flow can be reviewed.
        </p>
      </div>
    </Shell>
  );
}
