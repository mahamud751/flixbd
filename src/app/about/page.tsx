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
        lede="A digital shop for streaming plans, AI tools, gift cards, and software keys, ordered on WhatsApp."
      />
      <div className="max-w-3xl space-y-4 leading-7 text-muted">
        <p>
          Orders are placed on the site, sent to us on WhatsApp, and delivered there. The product page says whether you receive a profile, a redeem code, or a license key.
        </p>
        <p>
          {site.name} is not Netflix, Amazon, Disney, Warner Bros., Apple, Microsoft, or any other brand listed in the catalog. Those names are used so you can tell the services apart.
        </p>
        <p>
          Shop address: {site.address}. Support: {site.hours}, {site.hoursNote}. Email {site.email}. Phone {site.phoneDisplay}.
        </p>
        <p>
          Before launch, replace the WhatsApp number, address, and social links in <span className="text-ink">src/lib/site.ts</span>. Orders arrive on that WhatsApp number.
        </p>
      </div>
    </Shell>
  );
}
