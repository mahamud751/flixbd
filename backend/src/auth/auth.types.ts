export type Role = "customer" | "admin";

export type JwtPayload = {
  sub: string; // user id, or "admin" for the static admin
  email: string;
  role: Role;
};

/** Customer fields that are safe to return to clients (never the hash). */
export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} as const;
