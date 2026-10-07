import type { CartLine, Order, Product, Variant } from "@/lib/types";

export function taka(amount: number) {
  return `Tk ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function orderWhatsappText(order: Order) {
  const lines = order.lines.map(
    (line, index) =>
      `${index + 1}. ${line.name} (${line.variantName}) × ${line.qty} = ${taka(line.price * line.qty)}`,
  );
  return [
    `New order ${order.id}`,
    "",
    ...lines,
    "",
    `Subtotal: ${taka(order.subtotal)}`,
    ...(order.discount > 0
      ? [
          `Discount${order.coupon ? ` (${order.coupon})` : ""}: -${taka(order.discount)}`,
        ]
      : []),
    `Total: ${taka(order.total)}`,
    "",
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Address: ${order.customer.address}`,
    ...(order.customer.email ? [`Email: ${order.customer.email}`] : []),
    ...(order.note ? [`Note: ${order.note}`] : []),
  ].join("\n");
}

// ---- Catalog lookups -------------------------------------------------------
// These operate on a product list fetched from the packages API — server
// components pass their own list, the shop context passes its live copy.

export function getProduct(products: Product[], slug: string) {
  return products.find((product) => product.slug === slug);
}

export function productsInCategory(products: Product[], handle: string) {
  if (handle === "all") return products;
  return products.filter((product) => product.category === handle);
}

export function searchProducts(products: Product[], query: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return products.filter((product) => {
    const haystack = [
      product.name,
      product.blurb,
      product.typeLabel,
      product.category,
      ...product.features,
      ...product.variants.map((variant) => variant.name),
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

export function relatedProducts(
  products: Product[],
  product: Product,
  count = 4,
) {
  const siblings = products.filter(
    (other) =>
      other.slug !== product.slug && other.category === product.category,
  );
  const rest = products.filter(
    (other) =>
      other.slug !== product.slug && other.category !== product.category,
  );
  return [...siblings, ...rest].slice(0, count);
}

export function sectionProducts(
  products: Product[],
  section: NonNullable<Product["home"]>,
) {
  return products.filter((product) => product.home === section);
}

/** Suggestions for the empty cart and the search dialog. */
export function popularProducts(products: Product[], limit = 8) {
  const popular = products.filter((product) => product.home === "popular");
  const rest = products.filter((product) => product.home !== "popular");
  return [...popular, ...rest].slice(0, limit);
}

// ---- Pricing ----------------------------------------------------------------

export function inStock(product: Product) {
  return product.variants.some(
    (variant) => variant.available && variant.price > 0,
  );
}

export function fromPrice(product: Product) {
  const priced = product.variants.filter((variant) => variant.price > 0);
  const available = priced.filter((variant) => variant.available);
  const list = available.length > 0 ? available : priced;
  if (list.length === 0) return null;
  return Math.min(...list.map((variant) => variant.price));
}

export function compareAtPrice(product: Product) {
  const price = fromPrice(product);
  if (price == null) return null;
  const variant = product.variants.find(
    (item) =>
      item.available &&
      item.price === price &&
      item.compareAt &&
      item.compareAt > item.price,
  );
  return variant?.compareAt ?? null;
}

export function discountPercent(product: Product) {
  const price = fromPrice(product);
  const compare = compareAtPrice(product);
  if (price == null || compare == null || compare <= price) return null;
  return Math.round((1 - price / compare) * 100);
}

export function priceLabel(product: Product) {
  if (!inStock(product)) return "Sold out";
  const price = fromPrice(product);
  if (price == null) return "Unavailable";
  const prices = new Set(
    product.variants
      .filter((variant) => variant.available && variant.price > 0)
      .map((variant) => variant.price),
  );
  return `${prices.size > 1 ? "From " : ""}${taka(price)}`;
}

/** Live stock from the backend packages. */
export function stockCount(product: Product) {
  return product.variants.reduce(
    (sum, variant) => sum + (variant.available ? (variant.stock ?? 0) : 0),
    0,
  );
}

export function getVariant(product: Product, variantId: string) {
  return product.variants.find((variant) => variant.id === variantId);
}

export function defaultVariant(product: Product) {
  return (
    product.variants.find(
      (variant) => variant.available && variant.price > 0,
    ) ?? product.variants[0]
  );
}

// ---- Cart / checkout --------------------------------------------------------

export type ResolvedLine = {
  slug: string;
  variantId: string;
  qty: number;
  product: Product;
  variant: Variant;
};

export function resolveLines(
  lines: CartLine[],
  products: Product[],
): ResolvedLine[] {
  return lines.flatMap((line) => {
    const product = getProduct(products, line.slug);
    const variant = product ? getVariant(product, line.variantId) : undefined;
    if (!product || !variant) return [];
    return [{ ...line, product, variant }];
  });
}

export function subtotalOf(lines: ResolvedLine[]) {
  return lines.reduce((sum, line) => sum + line.variant.price * line.qty, 0);
}

export type CouponResult =
  | { ok: true; code: string; amount: number; label: string }
  | { ok: false; message: string };

export function applyCoupon(
  code: string,
  subtotal: number,
  lines: ResolvedLine[],
): CouponResult {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { ok: false, message: "Enter a coupon code." };
  if (subtotal <= 0)
    return { ok: false, message: "Add a product before using a coupon." };
  if (normalized === "SAVA10") {
    return {
      ok: true,
      code: normalized,
      amount: Math.round(subtotal * 0.1),
      label: "10% off",
    };
  }
  if (normalized === "WELCOME50") {
    if (subtotal < 300)
      return {
        ok: false,
        message: "WELCOME50 needs a subtotal of Tk 300 or more.",
      };
    return { ok: true, code: normalized, amount: 50, label: "Tk 50 off" };
  }
  if (normalized === "COMBO100") {
    const hasCombo = lines.some((line) => line.product.category === "combos");
    if (!hasCombo)
      return {
        ok: false,
        message: "COMBO100 only applies when the cart has a combo.",
      };
    return {
      ok: true,
      code: normalized,
      amount: Math.min(100, subtotal),
      label: "Tk 100 off combos",
    };
  }
  return { ok: false, message: "That coupon is not active." };
}

export const coupons = [
  { code: "SAVA10", detail: "10% off any order" },
  { code: "WELCOME50", detail: "Tk 50 off orders of Tk 300 or more" },
  { code: "COMBO100", detail: "Tk 100 off when a combo is in the cart" },
];
