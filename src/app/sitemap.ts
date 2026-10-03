import { collections } from "@/data/collections";
import { posts, policies } from "@/data/content";
import { products } from "@/data/products";
import { site } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
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
    ...collections.map((collection) => `/collections/${collection.handle}`),
    ...products.map((product) => `/products/${product.slug}`),
    ...posts.map((post) => `/blog/${post.slug}`),
    ...policies.map((policy) => `/policies/${policy.slug}`),
  ];
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
  }));
}
