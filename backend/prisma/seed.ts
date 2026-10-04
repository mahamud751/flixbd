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
        homeSection: "popular",
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
        homeSection: "popular",
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
        homeSection: "popular",
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
    sortOrder: 2,
    products: [
      {
        slug: "spotify-premium",
        name: "Spotify Premium",
        typeLabel: "Music",
        blurb: "Spotify Premium individual plan with ad-free listening.",
        image: "/shop/spotify-premium-subscription.jpg",
        homeSection: "popular",
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
    sortOrder: 3,
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
    sortOrder: 4,
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
        slug: "steam-wallet-gift-card",
        name: "Steam Wallet Gift Card",
        typeLabel: "Gift card",
        blurb: "Steam Wallet codes redeemed on your own Steam account.",
        image: "/shop/steam-wallet-giftcard.png",
        rating: 4.7,
        reviewCount: 842,
        caution:
          "Wallet region must match your Steam account. A revealed code cannot be returned.",
        packages: [
          P(undefined, undefined, 1600, { name: "$10" }),
          P(undefined, undefined, 3050, { name: "$20" }),
          P(undefined, undefined, 3750, { name: "$25" }),
          P(undefined, undefined, 7350, { name: "$50" }),
          P(undefined, undefined, 14200, { name: "$100" }),
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
        slug: "xbox-gift-card",
        name: "Xbox Gift Card",
        typeLabel: "Gift card",
        blurb: "Xbox and Microsoft Store credit.",
        packages: [],
      },
      {
        slug: "playstation-gift-card",
        name: "PlayStation Gift Card",
        typeLabel: "Gift card",
        blurb: "PSN wallet codes for the PlayStation Store.",
        image: "/shop/playstation-psn-gift-cards.png",
        rating: 4.9,
        reviewCount: 451,
        caution:
          "Match the code region to your PlayStation account. A revealed code cannot be returned.",
        packages: [
          P(undefined, undefined, 3500, { name: "$25" }),
          P(undefined, undefined, 6980, { name: "$50" }),
          P(undefined, undefined, 13800, { name: "$100" }),
        ],
      },
      {
        slug: "apple-gift-card",
        name: "Apple Gift Card (iTunes)",
        typeLabel: "Gift card",
        blurb: "Apple Gift Card amounts redeemed on an Apple Account you own.",
        image: "/shop/apple-itunes-giftcard-price-in-bangladesh.png",
        isFeatured: true,
        rating: 4.8,
        reviewCount: 468,
        caution:
          "Redeem codes only on an Apple Account you own. A revealed code cannot be returned.",
        packages: [
          P(undefined, undefined, 340, { name: "$2" }),
          P(undefined, undefined, 780, { name: "$5" }),
          P(undefined, undefined, 1500, { name: "$10" }),
          P(undefined, undefined, 2235, { name: "$15" }),
          P(undefined, undefined, 2980, { name: "$20" }),
          P(undefined, undefined, 3680, { name: "$25" }),
          P(undefined, undefined, 4400, { name: "$30" }),
          P(undefined, undefined, 7250, { name: "$50" }),
          P(undefined, undefined, 14300, { name: "$100" }),
          P(undefined, undefined, 28000, { name: "$200" }),
        ],
      },
      {
        slug: "discord-nitro",
        name: "Discord Nitro",
        typeLabel: "Gaming",
        blurb: "Discord Nitro with boosted perks.",
        packages: [P(undefined, "3 Months", 699)],
      },
    ],
  },
  {
    slug: "vpn",
    name: "VPN & Utilities",
    icon: "🔒",
    sortOrder: 5,
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
  if (product.packages.length > 1) features.push("Multiple duration options");
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
