import { BuyBox } from "@/components/buy-box";
import { ProductArt } from "@/components/product-art";
import { ProductGrid } from "@/components/product-card";
import { fetchProduct, fetchProducts } from "@/lib/catalog";
import { relatedProducts, taka } from "@/lib/commerce";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) return { title: "Product" };
  return { title: `${product.name} in Bangladesh`, description: product.blurb };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, products] = await Promise.all([
    fetchProduct(slug),
    fetchProducts(),
  ]);
  if (!product) notFound();
  const related = relatedProducts(products, product);
  const price = product.variants.find(
    (variant) => variant.available && variant.price > 0,
  )?.price;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.blurb,
    image: `${site.url}/covers/${product.category}.jpg`,
    brand: site.name,
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: price ?? 0,
      availability: price
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${site.url}/products/${product.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="text-sm text-muted">
        <Link href="/">Home</Link>
        <span> / </span>
        <Link href={`/collections/${product.category}`}>
          {product.typeLabel}
        </Link>
      </p>
      <div className="mt-6 grid items-start gap-8 lg:grid-cols-2">
        <ProductArt
          slug={product.slug}
          name={product.name}
          category={product.category}
          image={product.image}
          className="aspect-square rounded-2xl border border-line"
        />
        <BuyBox product={product} />
      </div>
      <article className="mt-12 max-w-3xl">
        <h2 className="font-display text-4xl">What you receive</h2>
        {product.paragraphs.map((paragraph) => (
          <p key={paragraph} className="mb-4 leading-7 text-muted">
            {paragraph}
          </p>
        ))}
        <p className="text-sm text-muted">Shop score {product.rating} / 5</p>
        {price ? (
          <p className="mt-2 text-sm text-muted">Listed from {taka(price)}.</p>
        ) : null}
      </article>
      <h2 className="mt-14 font-display text-4xl">You may also like</h2>
      <div className="mt-6">
        <ProductGrid products={related} />
      </div>
    </div>
  );
}
