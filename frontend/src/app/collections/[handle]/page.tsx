import { CollectionBrowser } from "@/components/collection-browser";
import { PageIntro, Shell } from "@/components/page-intro";
import { copyFor } from "@/data/collections";
import { fetchCategories, fetchProducts } from "@/lib/catalog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

/** "all" plus every active backend category is a valid collection handle. */
async function resolveCollection(handle: string) {
  if (handle === "all") return { name: "All products" };
  const categories = await fetchCategories();
  const category = categories.find((item) => item.slug === handle);
  return category ? { name: category.name } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const collection = await resolveCollection(handle);
  if (!collection) return { title: "Collection" };
  const copy = copyFor(handle, collection.name);
  return { title: copy.title, description: copy.lede };
}

export default async function Page({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await resolveCollection(handle);
  if (!collection) notFound();
  const products = await fetchProducts(
    handle === "all" ? {} : { category: handle },
  );
  const copy = copyFor(handle, collection.name);

  return (
    <Shell>
      <PageIntro eyebrow="Collection" title={copy.title} lede={copy.lede} />
      <CollectionBrowser products={products} />
    </Shell>
  );
}
