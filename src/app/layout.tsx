import { SiteFrame } from "@/components/site-frame";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import { DM_Sans, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const grotesk = DM_Sans({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

const bangla = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — OTT subscriptions in Bangladesh`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "en_BD",
    type: "website",
  },
  icons: { icon: "/icon.svg" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  name: site.name,
  url: site.url,
  email: site.email,
  telephone: `+${site.phoneE164}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "House 18, Road 11, Banani",
    addressLocality: "Dhaka",
    postalCode: "1213",
    addressCountry: "BD",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${grotesk.variable} ${bangla.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
