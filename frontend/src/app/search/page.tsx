import { PageIntro, Shell } from "@/components/page-intro";
import { SearchScreen } from "@/components/search-screen";
import { fetchProducts } from "@/lib/catalog";
import type { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  description: "Search streaming plans, AI tools, gift cards, and software.",
};

export default async function Page() {
  const products = await fetchProducts();
  return (
    <Shell>
      <PageIntro eyebrow="Search" title="Find a plan" />
      <Suspense fallback={<p className="text-muted">Opening search…</p>}>
        <SearchScreen products={products} />
      </Suspense>
    </Shell>
  );
}
