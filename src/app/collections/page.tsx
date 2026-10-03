import { PageIntro, Shell } from "@/components/page-intro";
import { collections } from "@/data/collections";
import { productsIn } from "@/lib/commerce";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Collections",
  description: "Streaming, combos, AI tools, software, gift cards, gaming, music, Apple, and VPN plans.",
};

export default function Page() {
  return (
    <Shell>
      <PageIntro eyebrow="Catalog" title="Collections" lede="The same shelves as a Bangladesh OTT shop: streaming, combos, AI, software, and gift cards." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Link key={collection.handle} href={`/collections/${collection.handle}`} className="rounded-[1.5rem] border border-line bg-panel p-5 transition hover:border-gold">
            <p className="text-xs text-muted">{productsIn(collection.handle).length} products</p>
            <h2 className="mt-2 font-display text-3xl leading-none">{collection.title}</h2>
            <p className="mt-3 text-sm text-muted">{collection.blurb}</p>
          </Link>
        ))}
      </div>
    </Shell>
  );
}
