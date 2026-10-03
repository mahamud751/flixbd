export type Category =
  | "streaming"
  | "combo"
  | "ai"
  | "productivity"
  | "gift-card"
  | "gaming"
  | "music"
  | "apple"
  | "vpn"
  | "learning"
  | "lifestyle";

export type HomeSection = "picks" | "combos" | "popular" | "ai" | "productivity";

export type Variant = {
  id: string;
  name: string;
  price: number;
  compareAt?: number;
  available: boolean;
};

export type Product = {
  slug: string;
  name: string;
  category: Category;
  collections: string[];
  typeLabel: string;
  blurb: string;
  paragraphs: string[];
  features: string[];
  variants: Variant[];
  rating: number;
  reviewCount: number;
  home?: HomeSection;
  featured?: boolean;
  spotlight?: {
    kicker: string;
    points: string[];
  };
  caution?: string;
};

export type Collection = {
  handle: string;
  title: string;
  lede: string;
  blurb: string;
};

export type CartLine = {
  slug: string;
  variantId: string;
  qty: number;
};

export type PaymentMethod = "bkash" | "nagad" | "rocket" | "card";

export type OrderLine = {
  slug: string;
  name: string;
  variantId: string;
  variantName: string;
  price: number;
  qty: number;
};

export type Customer = {
  name: string;
  phone: string;
  email: string;
  whatsapp: string;
};

export type Order = {
  id: string;
  createdAt: string;
  email: string;
  customer: Customer;
  payment: PaymentMethod;
  trxId: string;
  note: string;
  coupon: string | null;
  discount: number;
  subtotal: number;
  total: number;
  lines: OrderLine[];
  status: "placed";
};

export type Session = {
  name: string;
  email: string;
  phone: string;
};

export type StoredUser = Session & {
  passwordHash: string;
};
