import { PageIntro, Shell } from "@/components/page-intro";
import { copyFor } from "@/data/collections";
import { fetchCategories, fetchProducts } from "@/lib/catalog";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Collections",
  description: "Streaming, music, AI tools, gaming, gift cards, and VPN plans.",
};

export default async function Page() {
  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ]);
  const shelves = [
    {
      handle: "all",
      count: products.length,
      ...copyFor("all", "All products"),
    },
    ...categories.map((category) => ({
      handle: category.slug,
      count: category.productCount,
      ...copyFor(category.slug, category.name),
    })),
  ];

  return (
    <Shell>
      <PageIntro
        eyebrow="Catalog"
        title="Collections"
        lede="The same shelves as a Bangladesh OTT shop — streaming, music, AI, gaming, and utilities, live from the catalog."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shelves.map((shelf) => (
          <Link
            key={shelf.handle}
            href={`/collections/${shelf.handle}`}
            className="rounded-[1.5rem] border border-line bg-panel p-5 transition hover:border-gold"
          >
            <p className="text-xs text-muted">{shelf.count} products</p>
            <h2 className="mt-2 font-display text-3xl leading-none">
              {shelf.title}
            </h2>
            <p className="mt-3 text-sm text-muted">{shelf.blurb}</p>
          </Link>
        ))}
      </div>
    </Shell>
  );
}
