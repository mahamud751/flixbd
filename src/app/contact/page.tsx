import { ContactForm } from "@/components/contact-form";
import { PageIntro, Shell } from "@/components/page-intro";
import { site, whatsappHref } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact", description: `Message ${site.name} on WhatsApp or email.` };

export default function Page() {
  return (
    <Shell>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <PageIntro eyebrow="Support" title="Contact" lede={`Office hours ${site.hours}. ${site.hoursNote}.`} />
          <ul className="space-y-2 text-sm text-muted">
            <li>WhatsApp {site.phoneDisplay}</li>
            <li>Email {site.email}</li>
            <li>{site.address}</li>
          </ul>
          <a href={whatsappHref("Hi, I need help with an order.")} className="mt-5 inline-block rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#06210f]">
            Open WhatsApp
          </a>
        </div>
        <ContactForm />
      </div>
    </Shell>
  );
}
