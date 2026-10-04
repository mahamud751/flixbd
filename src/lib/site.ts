export const site = {
  name: "StreamNest BD",
  short: "StreamNest",
  legal: "StreamNest BD",
  domain: "streamnestbd.com",
  url: "https://streamnestbd.com",
  tagline: "OTT, AI, and digital subscriptions in Bangladesh",
  description:
    "Buy Netflix, Prime Video, Disney+, HBO Max, AI tools, gift cards, and software in Bangladesh. Order online and confirm on WhatsApp.",
  phoneDisplay: "+880 1789-408369",
  phoneE164: "8801789408369",
  email: "streamnestbd@gmail.com",
  address: "House 18, Road 11, Banani, Dhaka 1213, Bangladesh",
  hours: "11:00 AM – 11:30 PM",
  hoursNote: "Bangladesh time, every day",
  logo: "/logo.png",
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/streamnestbangladesh/" },
    { label: "Instagram", href: "https://www.instagram.com/streamnestbd" },
    { label: "TikTok", href: "https://www.tiktok.com/@streamnestbd" },
  ],
};

export function whatsappHref(text: string) {
  return `https://wa.me/${site.phoneE164}?text=${encodeURIComponent(text)}`;
}
