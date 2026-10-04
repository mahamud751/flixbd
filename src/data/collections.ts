import type { Collection } from "@/lib/types";

export const collections: Collection[] = [
  {
    handle: "all",
    title: "All products",
    lede: "Every streaming plan, combo, AI tool, gift card, and software key in the shop.",
    blurb: "The full StreamNest BD catalog.",
  },
  {
    handle: "streaming",
    title: "Streaming & OTT",
    lede: "Netflix, Prime Video, Disney+, HBO Max, Hulu, iQIYI, Zee5, SonyLIV, and Crunchyroll.",
    blurb: "Watch more, paid the Bangladesh way.",
  },
  {
    handle: "netflix",
    title: "Netflix subscription Bangladesh",
    lede: "Mobile, laptop, PC, and TV profile plans, plus the elite 3-month option.",
    blurb: "Compare device access and duration before you order.",
  },
  {
    handle: "combos",
    title: "OTT combo plans",
    lede: "Netflix with Prime, Disney+, or HBO Max — and bundles that leave Netflix out.",
    blurb: "One checkout, more than one app.",
  },
  {
    handle: "ai",
    title: "AI tools & subscriptions",
    lede: "ChatGPT Plus, Claude, Gemini, Grok, QuillBot, and builder tools.",
    blurb: "Writing, research, and image tools.",
  },
  {
    handle: "software",
    title: "Software & productivity",
    lede: "Microsoft 365, Windows keys, iCloud, IDM, CapCut, LinkedIn, and VPNs.",
    blurb: "Tools for work and study.",
  },
  {
    handle: "gift-cards",
    title: "Digital gift cards",
    lede: "Apple, PlayStation, and Steam codes, redeemed on an account you own.",
    blurb: "Codes are sent after your order is confirmed.",
  },
  {
    handle: "gaming",
    title: "Gaming gift cards",
    lede: "PlayStation, Steam, and other game credit when the listing is in stock.",
    blurb: "Top up a wallet you already own.",
  },
  {
    handle: "music",
    title: "Music subscriptions",
    lede: "YouTube Premium, Spotify, and Apple Music when those plans are in stock.",
    blurb: "Ad-free listening plans.",
  },
  {
    handle: "apple",
    title: "Apple services",
    lede: "Gift cards, iCloud+, Apple Music, Apple TV+, and Apple One.",
    blurb: "For an Apple Account you control.",
  },
  {
    handle: "vpn",
    title: "VPN subscriptions",
    lede: "ExpressVPN and Surfshark plans for phone and computer.",
    blurb: "A separate purchase from any streaming plan.",
  },
];

export function getCollection(handle: string) {
  return collections.find((collection) => collection.handle === handle);
}
