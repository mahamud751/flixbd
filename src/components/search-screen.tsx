"use client";

import { ProductGrid } from "@/components/product-card";
import { searchProducts } from "@/lib/commerce";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchScreen() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  return <SearchForm key={initial} initial={initial} />;
}

function SearchForm({ initial }: { initial: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initial);
  const results = initial.trim() ? searchProducts(initial) : [];

  return (
    <div>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          router.push(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search");
        }}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search plans, gift cards, tools"
          className="w-full rounded-full border border-line bg-black/[0.04] px-5 py-3 outline-none focus:border-gold"
        />
        <button type="submit" className="rounded-full bg-ember text-white px-5 py-3 text-sm font-semibold">
          Search
        </button>
      </form>
      <div className="mt-8">
        {initial.trim() ? (
          <>
            <p className="mb-4 text-sm text-muted">{results.length} results for “{initial}”</p>
            <ProductGrid products={results} />
          </>
        ) : (
          <p className="text-muted">Search for Netflix, Prime, iTunes, ChatGPT, Windows, or a combo.</p>
        )}
      </div>
    </div>
  );
}
