// Collection pages mirror the backend categories: "all" plus every active
// category from the API. This local map adds storefront copy where a nice
// lede already exists; admin-created categories fall back to generic copy.
export type CollectionCopy = {
  title: string;
  lede: string;
  blurb: string;
};

export const collectionCopy: Record<string, CollectionCopy> = {
  all: {
    title: "All products",
    lede: "Every streaming plan, AI tool, gift card, and software key in the shop.",
    blurb: "The full StreamNest BD catalog.",
  },
  streaming: {
    title: "Streaming & OTT",
    lede: "Netflix, Prime Video, Disney+, HBO Max, Crunchyroll, Hulu, and more.",
    blurb: "Watch more, paid the Bangladesh way.",
  },
  combos: {
    title: "Streaming combos",
    lede: "Netflix paired with Prime Video, Disney+, and HBO Max. Shared plans start at Tk 449 a month.",
    blurb: "One monthly price for more than one app.",
  },
  music: {
    title: "Music subscriptions",
    lede: "Spotify, Apple Music, and YouTube Premium plans.",
    blurb: "Ad-free listening plans.",
  },
  ai: {
    title: "AI tools & subscriptions",
    lede: "ChatGPT Plus, Gemini, Perplexity, Lovable, Canva, and more.",
    blurb: "Writing, research, and builder tools.",
  },
  gaming: {
    title: "Gaming & gift cards",
    lede: "Steam, PlayStation, Xbox, Apple, and Google Play codes, plus game top-ups.",
    blurb: "Top up a wallet you already own.",
  },
  vpn: {
    title: "VPN & utilities",
    lede: "Proton, Surfshark, NordVPN, ExpressVPN, Windows keys, and more.",
    blurb: "A separate purchase from any streaming plan.",
  },
};

export function copyFor(handle: string, fallbackName: string): CollectionCopy {
  return (
    collectionCopy[handle] ?? {
      title: fallbackName,
      lede: `All ${fallbackName} plans in the shop.`,
      blurb: `Browse the ${fallbackName} shelf.`,
    }
  );
}
