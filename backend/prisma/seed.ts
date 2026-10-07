/**
 * StreamNest BD — seed script
 *
 * Seeds the full packages catalog: categories → products → packages,
 * plus a demo storefront customer (demo@streamnestbd.com / demo1234).
 * Safe to re-run: it wipes the catalog tables and re-creates them.
 *
 * Run with: npm run prisma:seed   (prisma db seed → tsx prisma/seed.ts)
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// ---------------------------------------------------------------- types ----

type SeedPackage = {
  name?: string; // explicit display name; derived from profileType · duration when omitted
  profileType?: string;
  duration?: string;
  price: number; // BDT
  compareAtPrice?: number;
  isAvailable?: boolean;
};

type SeedProduct = {
  slug: string;
  name: string;
  typeLabel: string;
  blurb: string;
  image?: string;
  homeSection?: string;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  caution?: string;
  packages: SeedPackage[];
};

type SeedCategory = {
  slug: string;
  name: string;
  icon: string;
  sortOrder: number;
  products: SeedProduct[];
};

/** Shorthand: profileType + duration + price → package with a derived name. */
const P = (
  profileType: string | undefined,
  duration: string | undefined,
  price: number,
  extra?: Partial<SeedPackage>,
): SeedPackage => ({
  profileType,
  duration,
  price,
  ...extra,
  name:
    extra?.name ??
    ([profileType, duration].filter(Boolean).join(" · ") || undefined),
});

/** Gift-card face value. The product name carries the region. */
const D = (name: string, price: number): SeedPackage =>
  P(undefined, undefined, price, { name });

// ----------------------------------------------------------------- data ----

const SHARED = "Shared Profile";
const PRIVATE = "Private Profile";
const PERSONAL = "Personal";

const catalog: SeedCategory[] = [
  {
    slug: "streaming",
    name: "OTT & Entertainment",
    icon: "🎬",
    sortOrder: 1,
    products: [
      {
        slug: "netflix-premium",
        name: "Netflix Premium",
        typeLabel: "Streaming",
        blurb:
          "Netflix premium profiles for phone, tablet, laptop, PC, and TV.",
        image: "/shop/netflix-subscription-bangladesh.png",
        homeSection: "picks",
        isFeatured: true,
        rating: 4.8,
        reviewCount: 591,
        caution:
          "This is profile access arranged by StreamNest BD. It is not an official Netflix gift card, and Netflix household rules still apply to the underlying account.",
        packages: [
          P(SHARED, "1 Month", 350),
          P(SHARED, "3 Months", 1030),
          P(SHARED, "6 Months", 2050),
          P(SHARED, "12 Months", 4080),
          P(PRIVATE, "1 Month", 380),
          P(PRIVATE, "3 Months", 1120),
          P(PRIVATE, "6 Months", 2220),
          P(PRIVATE, "12 Months", 4400),
        ],
      },
      {
        slug: "amazon-prime-video",
        name: "Amazon Prime Video",
        typeLabel: "Streaming",
        blurb:
          "Prime Video for shows and movies, with shared and private profile plans.",
        image: "/shop/amazon-prime-video-subscription-bangladesh.jpg",
        rating: 4.6,
        reviewCount: 587,
        packages: [
          P(SHARED, "1 Month", 150),
          P(SHARED, "3 Months", 440),
          P(SHARED, "6 Months", 870),
          P(SHARED, "12 Months", 1720),
          P(PRIVATE, "1 Month", 250),
          P(PRIVATE, "3 Months", 740),
          P(PRIVATE, "6 Months", 1470),
          P(PRIVATE, "12 Months", 2900),
        ],
      },
      {
        slug: "disney-plus",
        name: "Disney+ Premium",
        typeLabel: "Streaming",
        blurb:
          "Disney+ for films, series, and family titles, with or without VPN options.",
        image: "/shop/buy-disneyplus-premium-subscription-in-bangladesh.png",
        homeSection: "picks",
        rating: 4.7,
        reviewCount: 799,
        packages: [
          P("Shared Profile (Without VPN)", "1 Month", 399),
          P("Shared Profile (Without VPN)", "3 Months", 1180),
          P("Shared Profile (Without VPN)", "6 Months", 2350),
          P("Shared Profile (Without VPN)", "12 Months", 4650),
          P("Private Profile (With VPN)", "1 Month", 499),
          P("Private Profile (With VPN)", "3 Months", 1480),
          P("Private Profile (With VPN)", "6 Months", 2950),
          P("Private Profile (With VPN)", "12 Months", 5850),
        ],
      },
      {
        slug: "hbo-max",
        name: "HBO Max Subscription",
        typeLabel: "Streaming",
        blurb:
          "HBO Max originals, films, and series with shared and private profile plans.",
        image: "/shop/hbo-max-subscriptions-price-bangladesh.jpg",
        homeSection: "picks",
        rating: 4.9,
        reviewCount: 768,
        packages: [
          P(SHARED, "1 Month", 350),
          P(SHARED, "3 Months", 1030),
          P(SHARED, "6 Months", 2050),
          P(SHARED, "12 Months", 4080),
          P(PRIVATE, "1 Month", 499),
          P(PRIVATE, "3 Months", 1480),
          P(PRIVATE, "6 Months", 2950),
          P(PRIVATE, "12 Months", 5850),
        ],
      },
      {
        slug: "crunchyroll-premium",
        name: "Crunchyroll Premium",
        typeLabel: "Anime",
        blurb:
          "Ad-free anime, simulcasts, and the back catalog on Crunchyroll.",
        rating: 4.7,
        reviewCount: 78,
        packages: [
          P(SHARED, "1 Month", 199),
          P(SHARED, "3 Months", 590),
          P(SHARED, "6 Months", 1170),
          P(SHARED, "12 Months", 2320),
          P(PRIVATE, "1 Month", 299),
          P(PRIVATE, "3 Months", 880),
          P(PRIVATE, "6 Months", 1750),
          P(PRIVATE, "12 Months", 3480),
        ],
      },
      {
        slug: "hulu",
        name: "Hulu Subscription",
        typeLabel: "Streaming",
        homeSection: "picks",
        blurb:
          "Hulu access for 1 or 3 months. A VPN is required outside Hulu's regions.",
        image: "/shop/hulu-subscription-price-bangladesh.jpg",
        rating: 4.8,
        reviewCount: 775,
        caution:
          "Hulu does not officially stream in Bangladesh. You need your own VPN. This product does not include a VPN subscription.",
        packages: [
          P(SHARED, "1 Month · VPN required", 440),
          P(SHARED, "3 Months · VPN required", 1300),
        ],
      },
      {
        slug: "hoichoi",
        name: "Hoichoi Subscription",
        typeLabel: "Streaming",
        blurb: "Hoichoi for Bengali films, web series, and originals.",
        packages: [],
      },
      {
        slug: "chorki",
        name: "Chorki Subscription",
        typeLabel: "Streaming",
        blurb: "Chorki for Bangladeshi films, web series, and originals.",
        packages: [],
      },
      {
        slug: "bongo",
        name: "Bongo Subscription",
        typeLabel: "Streaming",
        blurb: "Bongo for Bangla movies, music videos, and shows.",
        packages: [],
      },
    ],
  },
  {
    slug: "music",
    name: "Music Streaming",
    icon: "🎵",
    sortOrder: 3,
    products: [
      {
        slug: "spotify-premium",
        name: "Spotify Premium",
        typeLabel: "Music",
        blurb: "Spotify Premium individual plan with ad-free listening.",
        image: "/shop/spotify-premium-subscription.jpg",
        rating: 4.6,
        reviewCount: 825,
        packages: [
          P("Individual", "1 Month", 249),
          P("Individual", "3 Months", 730),
          P("Individual", "6 Months", 1450),
          P("Individual", "12 Months", 2880),
        ],
      },
      {
        slug: "apple-music",
        name: "Apple Music",
        typeLabel: "Music",
        blurb: "Apple Music individual plan for your Apple Account.",
        image: "/shop/apple-music-premium.png",
        rating: 4.6,
        reviewCount: 242,
        packages: [
          P("Individual", "1 Month", 199),
          P("Individual", "3 Months", 570),
          P("Individual", "5 Months", 899),
          P("Individual", "12 Months", 2099),
        ],
      },
      {
        slug: "youtube-premium",
        name: "YouTube Premium",
        typeLabel: "Premium",
        blurb: "Ad-free YouTube with YouTube Music included.",
        image: "/shop/youtube-premium-price-in-bangladesh.jpg",
        homeSection: "popular",
        rating: 4.9,
        reviewCount: 371,
        packages: [
          P(undefined, "1 Month", 250),
          P(undefined, "3 Months", 700),
          P(undefined, "6 Months", 1350),
          P(undefined, "12 Months", 2700),
        ],
      },
      {
        slug: "youtube-music-premium",
        name: "YouTube Music Premium",
        typeLabel: "Music",
        blurb: "YouTube Music Premium for ad-free music and background play.",
        packages: [],
      },
    ],
  },
  {
    slug: "ai",
    name: "AI & Productivity",
    icon: "🤖",
    sortOrder: 4,
    products: [
      {
        slug: "chatgpt-plus",
        name: "ChatGPT Plus",
        typeLabel: "AI",
        blurb: "ChatGPT Plus with full warranty on a personal account.",
        homeSection: "ai",
        rating: 4.6,
        reviewCount: 392,
        packages: [P("Personal (Full Warranty)", "1 Month", 2299)],
      },
      {
        slug: "chatgpt-plus-non-warranty",
        name: "ChatGPT Plus (Non-Warranty)",
        typeLabel: "AI",
        blurb: "ChatGPT Plus on a personal account without warranty.",
        packages: [P(PERSONAL, "1 Month", 1399)],
      },
      {
        slug: "gemini-pro",
        name: "Gemini Pro",
        typeLabel: "AI",
        blurb:
          "Gemini Pro (AI Pro plan) for advanced models and longer context.",
        image: "/shop/gemini-advance.png",
        homeSection: "ai",
        rating: 4.6,
        reviewCount: 439,
        packages: [P(PERSONAL, "18 Months", 999)],
      },
      {
        slug: "perplexity-pro",
        name: "Perplexity Pro",
        typeLabel: "AI",
        blurb: "Perplexity Pro for AI-powered search and research.",
        image: "/shop/perplexity-premium-subscription-price-in-bangladesh.png",
        homeSection: "ai",
        rating: 4.8,
        reviewCount: 425,
        packages: [P(PERSONAL, "12 Months", 6499)],
      },
      {
        slug: "lovable-pro",
        name: "Lovable Pro",
        typeLabel: "AI",
        blurb: "Lovable Pro for AI app building.",
        image: "/shop/lovable-pro-subscription.png",
        rating: 4.7,
        reviewCount: 436,
        packages: [P(PERSONAL, "1 Month", 1199)],
      },
      {
        slug: "lovable-lite",
        name: "Lovable Lite",
        typeLabel: "AI",
        blurb: "Lovable Lite annual plan for light usage.",
        packages: [P(PERSONAL, "12 Months", 1999)],
      },
      {
        slug: "grammarly-premium",
        name: "Grammarly Premium",
        typeLabel: "AI",
        blurb: "Grammarly Premium for advanced writing and grammar checks.",
        packages: [P(PERSONAL, "10 Days", 299)],
      },
      {
        slug: "quillbot-premium",
        name: "QuillBot Premium",
        typeLabel: "AI",
        blurb: "QuillBot Premium for paraphrasing and writing assistance.",
        image: "/shop/quillbot-premium-subscription-price-in-bangladesh.jpg",
        homeSection: "ai",
        rating: 4.6,
        reviewCount: 704,
        packages: [P(PERSONAL, "1 Month", 499)],
      },
      {
        slug: "coursera",
        name: "Coursera",
        typeLabel: "Learning",
        blurb: "Coursera annual access for courses and certificates.",
        packages: [P(PERSONAL, "12 Months", 699)],
      },
      {
        slug: "canva-pro",
        name: "Canva Pro",
        typeLabel: "Design",
        blurb: "Canva Pro on a personal account.",
        packages: [P(PERSONAL, "1 Month", 499)],
      },
      {
        slug: "canva-business",
        name: "Canva Business",
        typeLabel: "Design",
        blurb: "Canva Business team member seat.",
        packages: [P("Team Member", "1 Month", 499)],
      },
      {
        slug: "canva-pro-edu",
        name: "Canva Pro (EDU)",
        typeLabel: "Design",
        blurb: "Canva Pro EDU plans for 1 to 3 years.",
        packages: [
          P(PERSONAL, "1 Year", 699),
          P(PERSONAL, "2 Years", 1199),
          P(PERSONAL, "3 Years", 1699),
        ],
      },
      {
        slug: "capcut-pro",
        name: "CapCut Pro",
        typeLabel: "Video",
        blurb: "CapCut Pro for video editing on a private account.",
        image: "/shop/capcut-premium.png",
        rating: 4.6,
        reviewCount: 251,
        packages: [P(PERSONAL, "7 Days", 149), P(PERSONAL, "1 Month", 499)],
      },
      {
        slug: "adobe-creative-cloud",
        name: "Adobe Creative Cloud",
        typeLabel: "Design",
        blurb: "Adobe Creative Cloud apps on a personal plan.",
        image: "/shop/adobe-creative-cloud-subscription-bd.jpg",
        homeSection: "productivity",
        rating: 4.6,
        reviewCount: 55,
        packages: [P(PERSONAL, "4 Months", 1499)],
      },
      {
        slug: "elevenlabs",
        name: "ElevenLabs",
        typeLabel: "AI",
        blurb: "ElevenLabs for AI voice generation and dubbing.",
        packages: [P(PERSONAL, "1 Month", 999)],
      },
      {
        slug: "microsoft-365",
        name: "Microsoft 365",
        typeLabel: "Productivity",
        blurb:
          "Microsoft 365 Personal for Word, Excel, PowerPoint, and Outlook.",
        image: "/shop/microsoft-office-365-subscription.png",
        homeSection: "productivity",
        rating: 4.6,
        reviewCount: 77,
        packages: [P(PERSONAL, "12 Months", 1999)],
      },
      {
        slug: "figma-pro-edu",
        name: "Figma Pro (EDU)",
        typeLabel: "Design",
        blurb: "Figma Pro EDU plan for design work.",
        packages: [P(PERSONAL, "2 Years", 2499)],
      },
      {
        slug: "ilovepdf-premium",
        name: "ILovePDF Premium",
        typeLabel: "Productivity",
        blurb: "ILovePDF Premium for document tools.",
        packages: [P(PERSONAL, "12 Months", 699)],
      },
      {
        slug: "linkedin-career",
        name: "LinkedIn Career",
        typeLabel: "Career",
        blurb: "LinkedIn Premium Career plan for job seekers.",
        image: "/shop/linkedin-premium-subscription-price-in-bangladesh.jpg",
        rating: 4.8,
        reviewCount: 513,
        packages: [P(PERSONAL, "3 Months", 599)],
      },
      {
        slug: "zoom-pro",
        name: "Zoom Pro",
        typeLabel: "Productivity",
        blurb: "Zoom Pro for meetings and webinars.",
        packages: [P(PERSONAL, "1 Month", 599)],
      },
      {
        slug: "wink-vip",
        name: "Wink VIP",
        typeLabel: "Video",
        blurb: "Wink VIP for AI video retouching and editing.",
        packages: [P(PERSONAL, "1 Month", 799)],
      },
      {
        slug: "scribd-premium",
        name: "Scribd Premium",
        typeLabel: "Books",
        blurb: "Scribd for books, audiobooks, and documents.",
        packages: [P(PERSONAL, "1 Month", 449)],
      },
    ],
  },
  {
    slug: "gaming",
    name: "Gaming Services",
    icon: "🎮",
    sortOrder: 5,
    products: [
      {
        slug: "pubg-mobile-uc",
        name: "PUBG Mobile UC",
        typeLabel: "Game credit",
        blurb: "PUBG Mobile UC top-up for your own account.",
        image: "/shop/pubg-mobile-uc.png",
        rating: 4.6,
        reviewCount: 819,
        packages: [],
      },
      {
        slug: "free-fire-top-up",
        name: "Free Fire Top-Up",
        typeLabel: "Game credit",
        blurb: "Free Fire diamond top-up for your own account.",
        packages: [],
      },
      {
        slug: "steam-wallet-usa",
        name: "Steam Wallet (USA)",
        typeLabel: "Gift card",
        homeSection: "popular",
        blurb: "USA Steam Wallet codes redeemed on a US Steam account.",
        image: "/shop/steam-wallet-giftcard.png",
        rating: 4.7,
        reviewCount: 842,
        caution:
          "This code is for a USA Steam account. A revealed code cannot be returned.",
        packages: [
          D("5 USD", 949),
          D("10 USD", 1849),
          D("20 USD", 3649),
          D("25 USD", 4599),
          D("30 USD", 5299),
          D("50 USD", 8699),
          D("100 USD", 17199),
        ],
      },
      {
        slug: "steam-wallet-europe",
        name: "Steam Wallet (Europe)",
        typeLabel: "Gift card",
        blurb: "EUR Steam Wallet codes for a European Steam account.",
        image: "/shop/steam-wallet-giftcard.png",
        caution:
          "This code is for a European Steam account. A revealed code cannot be returned.",
        packages: [
          D("5 EUR", 1099),
          D("10 EUR", 2099),
          D("20 EUR", 4099),
          D("30 EUR", 6099),
        ],
      },
      {
        slug: "steam-wallet-india",
        name: "Steam Wallet (India)",
        typeLabel: "Gift card",
        blurb: "INR Steam Wallet codes for an Indian Steam account.",
        image: "/shop/steam-wallet-giftcard.png",
        caution:
          "This code is for an India Steam account. A revealed code cannot be returned.",
        packages: [
          D("₹130", 249),
          D("₹250", 469),
          D("₹500", 929),
          D("₹1000", 1799),
          D("₹2500", 4499),
        ],
      },
      {
        slug: "google-play-gift-card",
        name: "Google Play Gift Card",
        typeLabel: "Gift card",
        blurb: "Google Play credit for apps, games, and in-app purchases.",
        packages: [],
      },
      {
        slug: "xbox-gift-card-usa",
        name: "Xbox Gift Card (USA)",
        typeLabel: "Gift card",
        blurb: "USA Xbox and Microsoft Store credit.",
        caution:
          "Redeem on a USA Microsoft account. A revealed code cannot be returned.",
        packages: [
          D("5 USD", 849),
          D("10 USD", 1649),
          D("15 USD", 2399),
          D("20 USD", 3199),
          D("25 USD", 3949),
          D("50 USD", 7799),
          D("100 USD", 15299),
        ],
      },
      {
        slug: "ea-gift-card-usa",
        name: "EA Gift Card (USA)",
        typeLabel: "Gift card",
        blurb: "USA EA credit for the EA app.",
        caution:
          "Redeem on a USA EA account. A revealed code cannot be returned.",
        packages: [D("15 USD", 2349), D("25 USD", 3899)],
      },
      {
        slug: "playstation-gift-card-usa",
        name: "PlayStation Gift Card (USA)",
        typeLabel: "Gift card",
        blurb: "USA PSN wallet codes for the PlayStation Store.",
        image: "/shop/playstation-psn-gift-cards.png",
        rating: 4.9,
        reviewCount: 451,
        caution:
          "Redeem on a USA PlayStation account. A revealed code cannot be returned.",
        packages: [
          D("2 USD", 499),
          D("3 USD", 699),
          D("4 USD", 899),
          D("10 USD", 1649),
          D("25 USD", 3899),
          D("50 USD", 7749),
          D("75 USD", 11499),
          D("100 USD", 15299),
          D("150 USD", 23299),
          D("200 USD", 30999),
          D("250 USD", 38699),
        ],
      },
      {
        slug: "playstation-gift-card-uk",
        name: "PlayStation Gift Card (UK)",
        typeLabel: "Gift card",
        blurb: "UK PSN wallet codes for the PlayStation Store.",
        image: "/shop/playstation-psn-gift-cards.png",
        caution:
          "Redeem on a UK PlayStation account. A revealed code cannot be returned.",
        packages: [
          D("10 GBP", 2199),
          D("20 GBP", 4299),
          D("40 GBP", 8499),
          D("50 GBP", 10699),
          D("100 GBP", 21299),
        ],
      },
      {
        slug: "apple-gift-card",
        name: "Apple Gift Card (USA)",
        typeLabel: "Gift card",
        blurb: "USA Apple Gift Card amounts for an Apple Account you own.",
        image: "/shop/apple-itunes-giftcard-price-in-bangladesh.png",
        isFeatured: true,
        rating: 4.8,
        reviewCount: 468,
        caution:
          "Redeem on a USA Apple Account you own. A revealed code cannot be returned.",
        packages: [
          D("2 USD", 349),
          D("3 USD", 499),
          D("4 USD", 679),
          D("5 USD", 849),
          D("10 USD", 1649),
          D("15 USD", 2449),
          D("20 USD", 3249),
          D("25 USD", 4049),
          D("30 USD", 4849),
          D("40 USD", 6449),
          D("50 USD", 7999),
          D("60 USD", 9599),
          D("100 USD", 15999),
        ],
      },
      {
        slug: "apple-gift-card-australia",
        name: "Apple Gift Card (Australia)",
        typeLabel: "Gift card",
        blurb: "Australia Apple Gift Card amounts.",
        image: "/shop/apple-itunes-giftcard-price-in-bangladesh.png",
        caution:
          "Redeem on an Australia Apple Account. A revealed code cannot be returned.",
        packages: [
          D("2 AUD", 279),
          D("3 AUD", 399),
          D("4 AUD", 529),
          D("5 AUD", 649),
          D("10 AUD", 1299),
          D("15 AUD", 1899),
          D("20 AUD", 2549),
          D("25 AUD", 3149),
          D("30 AUD", 3699),
          D("50 AUD", 6099),
          D("100 AUD", 11999),
        ],
      },
      {
        slug: "apple-gift-card-canada",
        name: "Apple Gift Card (Canada)",
        typeLabel: "Gift card",
        blurb: "Canada Apple Gift Card amounts.",
        image: "/shop/apple-itunes-giftcard-price-in-bangladesh.png",
        caution:
          "Redeem on a Canada Apple Account. A revealed code cannot be returned.",
        packages: [
          D("5 CAD", 629),
          D("10 CAD", 1229),
          D("15 CAD", 1829),
          D("25 CAD", 2999),
          D("50 CAD", 5899),
          D("100 CAD", 11699),
          D("200 CAD", 23299),
          D("300 CAD", 35499),
        ],
      },
      {
        slug: "apple-gift-card-uae",
        name: "Apple Gift Card (UAE)",
        typeLabel: "Gift card",
        blurb: "UAE Apple Gift Card amounts.",
        image: "/shop/apple-itunes-giftcard-price-in-bangladesh.png",
        caution:
          "Redeem on a UAE Apple Account. A revealed code cannot be returned.",
        packages: [
          D("50 AED", 2299),
          D("100 AED", 4549),
          D("250 AED", 11199),
          D("300 AED", 13599),
          D("350 AED", 15799),
          D("400 AED", 17999),
          D("450 AED", 20199),
          D("500 AED", 22399),
          D("550 AED", 24299),
          D("600 AED", 26999),
        ],
      },
      {
        slug: "apple-gift-card-uk",
        name: "Apple Gift Card (UK)",
        typeLabel: "Gift card",
        blurb: "UK Apple Gift Card amounts.",
        image: "/shop/apple-itunes-giftcard-price-in-bangladesh.png",
        caution:
          "Redeem on a UK Apple Account. A revealed code cannot be returned.",
        packages: [
          D("5 GBP", 1199),
          D("10 GBP", 2299),
          D("15 GBP", 3399),
          D("20 GBP", 4499),
          D("25 GBP", 5599),
          D("50 GBP", 11299),
        ],
      },
      {
        slug: "discord-nitro",
        name: "Discord Nitro",
        typeLabel: "Gaming",
        blurb: "Discord Nitro with boosted perks.",
        packages: [P(undefined, "3 Months", 699)],
      },
      {
        slug: "xbox-game-pass-usa",
        name: "Xbox Game Pass (USA)",
        typeLabel: "Gaming",
        blurb: "USA Xbox Game Pass and EA Access plans.",
        caution: "These are USA Xbox Game Pass plans.",
        packages: [
          P("Essential", "1 Month", 1599),
          P("Premium", "1 Month", 2349),
          P("Ultimate", "1 Month", 3599),
          P("Essential", "3 Months", 3899),
          P("Essential", "6 Months", 6199),
          P("Premium", "3 Months", 6899),
          P("Ultimate", "3 Months", 10699),
          P("EA Access", "12 Months", 4499),
        ],
      },
      {
        slug: "red-dead-redemption-2",
        name: "Red Dead Redemption 2",
        typeLabel: "Game",
        blurb: "Red Dead Redemption 2 for Rockstar Launcher, Global.",
        packages: [
          P("Standard Edition", undefined, 2449),
          P("Ultimate Edition", undefined, 3499),
        ],
      },
      {
        slug: "ea-sports-fc-26",
        name: "EA Sports FC 26",
        typeLabel: "Game",
        blurb: "EA Sports FC 26 for the EA app, USA.",
        packages: [
          P("Standard Edition", undefined, 5499),
          P("TOTY Edition", undefined, 5799),
          P("Ultimate Edition", undefined, 12499),
        ],
      },
      {
        slug: "forza-horizon-6",
        name: "Forza Horizon 6",
        typeLabel: "Game",
        blurb: "Forza Horizon 6, Global.",
        packages: [
          P("Standard Edition", undefined, 9299),
          P("Deluxe Edition", undefined, 13299),
          P("Premium Edition", undefined, 15699),
        ],
      },
      {
        slug: "minecraft-pc",
        name: "Minecraft PC",
        typeLabel: "Game",
        blurb: "Minecraft PC editions, Global.",
        packages: [
          P("Bedrock Edition", undefined, 3099),
          P("Java & Bedrock Deluxe", undefined, 4299),
          P("Java Edition", undefined, 4999),
        ],
      },
    ],
  },
  {
    slug: "combos",
    name: "Combo Offers",
    icon: "🔥",
    sortOrder: 2,
    products: [
      {
        slug: "netflix-prime-combo",
        name: "Netflix + Amazon Prime Video",
        typeLabel: "Combo",
        blurb: "Netflix and Prime Video together, billed per month.",
        image: "/shop/netflix-prime-combo-subscription-bangladesh.png",
        homeSection: "combos",
        rating: 4.8,
        reviewCount: 210,
        caution:
          "This is profile access arranged by StreamNest BD, not an official bundle from Netflix or Amazon.",
        packages: [
          P(SHARED, "1 Month", 449),
          P(PRIVATE, "1 Month", 599),
        ],
      },
      {
        slug: "netflix-hbo-combo",
        name: "Netflix + HBO Max",
        typeLabel: "Combo",
        blurb: "Netflix and HBO Max together, billed per month.",
        image: "/shop/netflix-hbo-max-combo-subscription-bangladesh.png",
        homeSection: "combos",
        caution:
          "This is profile access arranged by StreamNest BD, not an official bundle.",
        packages: [
          P(SHARED, "1 Month", 649),
          P(PRIVATE, "1 Month", 849),
        ],
      },
      {
        slug: "netflix-disney-combo",
        name: "Netflix + Disney+",
        typeLabel: "Combo",
        blurb: "Netflix and Disney+ together, billed per month.",
        image: "/shop/netflix-disneyplus-subscription-bangladesh.png",
        homeSection: "combos",
        caution:
          "This is profile access arranged by StreamNest BD, not an official bundle.",
        packages: [
          P(SHARED, "1 Month", 699),
          P(PRIVATE, "1 Month", 849),
        ],
      },
      {
        slug: "netflix-prime-disney-combo",
        name: "Netflix + Amazon Prime Video + Disney+",
        typeLabel: "Combo",
        blurb: "Netflix, Prime Video, and Disney+ together, billed per month.",
        image:
          "/shop/netflix-prime-disney-plus-combo-subscription-bangladesh.png",
        homeSection: "combos",
        caution:
          "This is profile access arranged by StreamNest BD, not an official bundle.",
        packages: [
          P(SHARED, "1 Month", 829),
          P(PRIVATE, "1 Month", 1049),
        ],
      },
      {
        slug: "ultimate-entertainment-pack",
        name: "Ultimate Entertainment Pack",
        typeLabel: "Combo",
        blurb: "Netflix, Prime Video, HBO Max, and Disney+ together, billed per month.",
        image:
          "/shop/netflix-prime-disney-hbo-max-combo-subscription-bangladesh.png",
        homeSection: "combos",
        isFeatured: true,
        rating: 4.9,
        reviewCount: 164,
        caution:
          "This is profile access arranged by StreamNest BD, not an official bundle. The pack includes Netflix, Amazon Prime Video, HBO Max, and Disney+.",
        packages: [
          P(SHARED, "1 Month", 1149),
          P(PRIVATE, "1 Month", 1499),
        ],
      },
    ],
  },
  {
    slug: "vpn",
    name: "VPN & Utilities",
    icon: "🔒",
    sortOrder: 6,
    products: [
      {
        slug: "proton-vpn",
        name: "Proton VPN",
        typeLabel: "VPN",
        blurb: "Proton VPN plans for privacy on all your devices.",
        packages: [
          P(PERSONAL, "1 Month", 499),
          P(PERSONAL, "3 Months", 1450),
          P(PERSONAL, "6 Months", 2850),
          P(PERSONAL, "12 Months", 5650),
        ],
      },
      {
        slug: "surfshark-vpn",
        name: "Surfshark VPN",
        typeLabel: "VPN",
        homeSection: "popular",
        blurb: "Surfshark VPN with unlimited devices.",
        image: "/shop/surfshark-vpn-bangladesh.jpg",
        rating: 4.6,
        reviewCount: 749,
        packages: [
          P(PERSONAL, "2 Months", 599),
          P(PERSONAL, "6 Months", 1690),
          P(PERSONAL, "12 Months", 3290),
        ],
      },
      {
        slug: "nordvpn",
        name: "NordVPN",
        typeLabel: "VPN",
        blurb: "NordVPN for fast, private browsing.",
        packages: [
          P(PERSONAL, "3 Months", 799),
          P(PERSONAL, "6 Months", 1550),
          P(PERSONAL, "12 Months", 2999),
        ],
      },
      {
        slug: "expressvpn",
        name: "ExpressVPN",
        typeLabel: "VPN",
        homeSection: "popular",
        blurb: "ExpressVPN for phone, PC, and Mac.",
        image: "/shop/express-vpn-subscription-bangladesh.jpg",
        rating: 4.9,
        reviewCount: 340,
        packages: [
          P(PERSONAL, "1 Month", 499),
          P(PERSONAL, "3 Months", 1450),
          P(PERSONAL, "6 Months", 2850),
          P(PERSONAL, "12 Months", 5650),
        ],
      },
      {
        slug: "truecaller-premium",
        name: "Truecaller Premium",
        typeLabel: "Utility",
        blurb: "Truecaller Premium for caller ID and spam blocking.",
        packages: [],
      },
      {
        slug: "windows-10-pro",
        name: "Windows 10 Pro",
        typeLabel: "License key",
        blurb: "Windows 10 Pro lifetime retail key.",
        image: "/shop/windows-10-11-activation-key.jpg",
        homeSection: "productivity",
        rating: 4.7,
        reviewCount: 830,
        caution:
          "You receive a product key only. Download Windows from Microsoft. We do not send modified installers.",
        packages: [P("Lifetime License", undefined, 999)],
      },
      {
        slug: "windows-11-pro",
        name: "Windows 11 Pro",
        typeLabel: "License key",
        blurb: "Windows 11 Pro lifetime retail key.",
        image: "/shop/windows-10-11-activation-key.jpg",
        homeSection: "productivity",
        rating: 4.7,
        reviewCount: 830,
        caution:
          "You receive a product key only. Download Windows from Microsoft. We do not send modified installers.",
        packages: [P("Lifetime License", undefined, 999)],
      },
    ],
  },
];

// -------------------------------------------------------------- helpers ----

function packageDisplayName(pkg: SeedPackage): string {
  if (pkg.name) return pkg.name;
  return (
    [pkg.profileType, pkg.duration].filter(Boolean).join(" · ") || "Standard"
  );
}

function paragraphsFor(product: SeedProduct): string[] {
  return [
    product.blurb,
    `Order ${product.name} here and send the order on WhatsApp. After the order is confirmed, activation details are sent on WhatsApp during support hours — usually within 30 minutes, and within 4 hours.`,
    "Read the option name before you pay. Some options are a profile our team delivers. Others are a redeem code or license key for an account you already own.",
  ];
}

function featuresFor(product: SeedProduct): string[] {
  const features: string[] = [];
  const profileTypes = [
    ...new Set(product.packages.map((p) => p.profileType).filter(Boolean)),
  ] as string[];
  if (profileTypes.length)
    features.push(`${profileTypes.join(" and ")} options`);
  if (product.packages.length > 1) {
    const hasDuration = product.packages.some((pkg) => pkg.duration);
    features.push(hasDuration ? "Multiple duration options" : "Multiple amount options");
  }
  if (product.packages.length)
    features.push("Delivered on WhatsApp after payment");
  if (!product.packages.length)
    features.push("Ask support on WhatsApp for current pricing");
  return features;
}

// ----------------------------------------------------------------- main ----

async function main() {
  console.log("Seeding StreamNest BD catalog…");

  // Wipe in FK-safe order (packages → products → categories).
  await prisma.package.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  let productCount = 0;
  let packageCount = 0;

  for (const seedCategory of catalog) {
    const category = await prisma.category.create({
      data: {
        slug: seedCategory.slug,
        name: seedCategory.name,
        icon: seedCategory.icon,
        sortOrder: seedCategory.sortOrder,
        isActive: true,
      },
    });

    let productOrder = 0;
    for (const seedProduct of seedCategory.products) {
      const product = await prisma.product.create({
        data: {
          slug: seedProduct.slug,
          name: seedProduct.name,
          categoryId: category.id,
          typeLabel: seedProduct.typeLabel,
          blurb: seedProduct.blurb,
          paragraphs: paragraphsFor(seedProduct),
          features: featuresFor(seedProduct),
          image: seedProduct.image,
          rating: seedProduct.rating ?? 4.7,
          reviewCount: seedProduct.reviewCount ?? 0,
          homeSection: seedProduct.homeSection,
          isFeatured: seedProduct.isFeatured ?? false,
          isActive: true,
          sortOrder: productOrder++,
          caution: seedProduct.caution,
        },
      });
      productCount++;

      let packageOrder = 0;
      for (const seedPackage of seedProduct.packages) {
        await prisma.package.create({
          data: {
            productId: product.id,
            name: packageDisplayName(seedPackage),
            profileType: seedPackage.profileType,
            duration: seedPackage.duration,
            price: seedPackage.price,
            compareAtPrice: seedPackage.compareAtPrice,
            stock: 100,
            isAvailable: seedPackage.isAvailable ?? true,
            sortOrder: packageOrder++,
          },
        });
        packageCount++;
      }
    }

    console.log(
      `  ${seedCategory.icon} ${seedCategory.name}: ${seedCategory.products.length} products`,
    );
  }

  // Demo customer for the storefront login. Upserted, so real accounts are never wiped.
  await prisma.user.upsert({
    where: { email: "demo@streamnestbd.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "demo@streamnestbd.com",
      phone: "01700000000",
      passwordHash: await bcrypt.hash("demo1234", 10),
    },
  });
  console.log("  👤 Demo customer: demo@streamnestbd.com / demo1234");

  console.log(
    `Done — ${catalog.length} categories, ${productCount} products, ${packageCount} packages.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
