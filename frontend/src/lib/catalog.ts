import type { Product, Variant } from "@/lib/types";

// The packages API (NestJS backend). Server components and the browser cart
// both call this — the URL must therefore be a NEXT_PUBLIC_ variable.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type ApiCategory = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  isActive: boolean;
  _count?: { products: number };
};

export type ApiPackage = {
  id: string;
  name: string;
  profileType: string | null;
  duration: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isAvailable: boolean;
  sortOrder: number;
};

export type ApiProduct = {
  id: string;
  slug: string;
  name: string;
  typeLabel: string | null;
  blurb: string | null;
  paragraphs: string[];
  features: string[];
  image: string | null;
  rating: number;
  reviewCount: number;
  homeSection: string | null;
  isFeatured: boolean;
  isActive: boolean;
  caution: string | null;
  category: ApiCategory;
  packages: ApiPackage[];
};

export type CatalogCategory = {
  slug: string;
  name: string;
  icon: string | null;
  productCount: number;
};

const HOME_SECTIONS = ["picks", "combos", "popular", "ai", "productivity"];

/** Maps a backend package to the storefront's variant shape. */
function toVariant(pkg: ApiPackage): Variant {
  return {
    id: pkg.id,
    name: pkg.name,
    ...(pkg.profileType ? { profileType: pkg.profileType } : {}),
    ...(pkg.duration ? { duration: pkg.duration } : {}),
    price: pkg.price,
    ...(pkg.compareAtPrice && pkg.compareAtPrice > pkg.price
      ? { compareAt: pkg.compareAtPrice }
      : {}),
    stock: pkg.stock,
    available: pkg.isAvailable && pkg.stock > 0,
  };
}

/** Maps a backend product (with nested packages) to the storefront's Product shape. */
export function toProduct(api: ApiProduct): Product {
  const home =
    api.homeSection && HOME_SECTIONS.includes(api.homeSection)
      ? api.homeSection
      : undefined;
  return {
    slug: api.slug,
    name: api.name,
    category: api.category.slug,
    typeLabel: api.typeLabel ?? api.category.name,
    blurb: api.blurb ?? "",
    paragraphs: api.paragraphs,
    features: api.features,
    image: api.image ?? undefined,
    variants: api.packages.map(toVariant),
    rating: api.rating,
    reviewCount: api.reviewCount,
    ...(home ? { home: home as Product["home"] } : {}),
    ...(api.isFeatured ? { featured: true } : {}),
    ...(api.caution ? { caution: api.caution } : {}),
  };
}

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}/api${path}`, { cache: "no-store" });
  if (!response.ok)
    throw new Error(`API ${path} failed with ${response.status}`);
  return (await response.json()) as T;
}

/** A product is on the storefront only when it has a priced, available package. */
function isListed(product: Product) {
  return product.variants.some(
    (variant) => variant.available && variant.price > 0,
  );
}

/** Active products with their packages. Optional server-side filters. */
export async function fetchProducts(
  filters: { search?: string; category?: string; featured?: boolean } = {},
): Promise<Product[]> {
  const params = new URLSearchParams({ active: "true" });
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.featured) params.set("featured", "true");
  const raw = await apiGet<ApiProduct[]>(`/products?${params.toString()}`);
  return raw.map(toProduct).filter(isListed);
}

/** One active product by slug (or id); null when missing, inactive, or unpriced. */
export async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    const raw = await apiGet<ApiProduct>(
      `/products/${encodeURIComponent(slug)}`,
    );
    if (!raw.isActive) return null;
    const product = toProduct(raw);
    return isListed(product) ? product : null;
  } catch {
    return null;
  }
}

/** Active categories with product counts, for the storefront collection pages. */
export async function fetchCategories(): Promise<CatalogCategory[]> {
  const raw = await apiGet<ApiCategory[]>("/categories");
  return raw
    .filter((category) => category.isActive)
    .map((category) => ({
      slug: category.slug,
      name: category.name,
      icon: category.icon,
      productCount: category._count?.products ?? 0,
    }));
}
