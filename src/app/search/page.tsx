import { PageIntro, Shell } from "@/components/page-intro";
import { SearchScreen } from "@/components/search-screen";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Search", description: "Search streaming plans, AI tools, gift cards, and software." };

export default function Page() {
  return (
    <Shell>
      <PageIntro eyebrow="Search" title="Find a plan" />
      <Suspense fallback={<p className="text-muted">Opening search…</p>}>
        <SearchScreen />
      </Suspense>
    </Shell>
  );
}
