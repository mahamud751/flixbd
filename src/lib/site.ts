export const site = {
  name: "Savasaachi Flix BD",
  short: "Savasaachi",
  legal: "Savasaachi Flix BD",
  domain: "savasaachiflixbd.com",
  url: "https://savasaachiflixbd.com",
  tagline: "OTT, AI, and digital subscriptions in Bangladesh",
  description:
    "Buy Netflix, Prime Video, Disney+, HBO Max, AI tools, gift cards, and software in Bangladesh. Pay with bKash, Nagad, Rocket, or card. Delivery on WhatsApp.",
  phoneDisplay: "+44 7566 253616",
  phoneE164: "447566253616",
  email: "hello@savasaachiflixbd.com",
  orderEmail: "order@savasaachiflixbd.com",
  address: "House 18, Road 11, Banani, Dhaka 1213, Bangladesh",
  hours: "11:00 AM – 11:30 PM",
  hoursNote: "Bangladesh time, every day",
  wallets: {
    bkash: "01700-000000",
    nagad: "01700-000000",
    rocket: "01700-000000",
  },
  socials: [
    { label: "Facebook", href: "https://facebook.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "X", href: "https://x.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "TikTok", href: "https://tiktok.com" },
  ],
};

export function whatsappHref(text: string) {
  return `https://wa.me/${site.phoneE164}?text=${encodeURIComponent(text)}`;
}
