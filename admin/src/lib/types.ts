export type Category = {
  id: string;
  slug: string;
  name: string;
  icon?: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: { products: number };
};

export type Package = {
  id: string;
  name: string;
  profileType?: string | null;
  duration?: string | null;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  isAvailable: boolean;
  sortOrder: number;
  productId: string;
  product?: { id: string; name: string; slug: string } | null;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  typeLabel?: string | null;
  blurb?: string | null;
  paragraphs: string[];
  features: string[];
  image?: string | null;
  rating: number;
  reviewCount: number;
  homeSection?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  caution?: string | null;
  categoryId: string;
  category?: Category | null;
  packages: Package[];
};

export type ProductPayload = {
  name: string;
  slug?: string;
  categoryId: string;
  typeLabel?: string;
  blurb?: string;
  features?: string[];
  paragraphs?: string[];
  image?: string;
  rating?: number;
  reviewCount?: number;
  homeSection?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  caution?: string;
};

export type PackagePayload = {
  productId?: string;
  name?: string;
  profileType?: string | null;
  duration?: string | null;
  price?: number;
  compareAtPrice?: number | null;
  stock?: number;
  isAvailable?: boolean;
  sortOrder?: number;
};

export type CategoryPayload = {
  name?: string;
  slug?: string;
  icon?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminLoginResponse = {
  token: string;
  admin: { email: string; role: "admin" };
};
