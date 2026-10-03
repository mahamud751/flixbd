import { CollectionBrowser } from "@/components/collection-browser";
import { PageIntro, Shell } from "@/components/page-intro";
import { collections, getCollection } from "@/data/collections";
import { productsIn } from "@/lib/commerce";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((collection) => ({ handle: collection.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const collection = getCollection(handle);
  if (!collection) return { title: "Collection" };
  return { title: collection.title, description: collection.lede };
}

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const collection = getCollection(handle);
  if (!collection) notFound();
  const products = productsIn(handle);

  return (
    <Shell>
      <PageIntro eyebrow="Collection" title={collection.title} lede={collection.lede} />
      <CollectionBrowser products={products} />
    </Shell>
  );
}
