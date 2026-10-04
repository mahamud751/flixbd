import { posts, policies } from "@/data/content";
import { fetchCategories, fetchProducts } from "@/lib/catalog";
import { site } from "@/lib/site";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const paths = [
    "",
    "/collections",
    "/blog",
    "/about",
    "/contact",
    "/faq",
    "/cart",
    "/checkout",
    "/account",
    "/login",
    "/register",
    "/track",
    "/search",
    ...posts.map((post) => `/blog/${post.slug}`),
    ...policies.map((policy) => `/policies/${policy.slug}`),
  ];
  try {
    const [categories, products] = await Promise.all([
      fetchCategories(),
      fetchProducts(),
    ]);
    paths.push(
      ...categories.map((category) => `/collections/${category.slug}`),
      ...products.map((product) => `/products/${product.slug}`),
    );
  } catch {
    // Packages API unreachable — ship the static paths only.
  }
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
  }));
}
