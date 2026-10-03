import { shopImage } from "@/data/images";
import { cx } from "@/lib/cx";
import type { Category } from "@/lib/types";
import Image from "next/image";

const covers: Record<Category, string> = {
  streaming: "/covers/streaming.jpg",
  combo: "/covers/combo.jpg",
  ai: "/covers/ai.jpg",
  productivity: "/covers/productivity.jpg",
  "gift-card": "/covers/gift-card.jpg",
  gaming: "/covers/gaming.jpg",
  music: "/covers/music.jpg",
  apple: "/covers/apple.jpg",
  vpn: "/covers/vpn.jpg",
  learning: "/covers/learning.jpg",
  lifestyle: "/covers/lifestyle.jpg",
};

export function ProductArt({
  slug,
  name,
  category,
  className,
  compact = false,
  sizes,
}: {
  slug?: string;
  name: string;
  category: Category;
  className?: string;
  compact?: boolean;
  sizes?: string;
}) {
  const src = (slug && shopImage(slug)) || covers[category];
  return (
    <div className={cx("relative isolate overflow-hidden bg-[#111]", className)}>
      <Image
        src={src}
        alt={compact ? "" : name}
        fill
        sizes={sizes ?? (compact ? "80px" : "(min-width: 1024px) 560px, 90vw")}
        className="object-cover"
      />
    </div>
  );
}
