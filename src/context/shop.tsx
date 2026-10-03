"use client";

import {
  applyCoupon,
  resolveLines,
  subtotalOf,
  type ResolvedLine,
} from "@/lib/commerce";
import type {
  CartLine,
  Customer,
  Order,
  PaymentMethod,
  Session,
  StoredUser,
} from "@/lib/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  useState,
} from "react";

const STORAGE_KEY = "savasaachi-flix-bd";

type Panel = "cart" | "search" | "menu" | null;

type Toast = { id: number; message: string };

type Persisted = {
  lines: CartLine[];
  note: string;
  coupon: string;
  session: Session | null;
  users: StoredUser[];
  orders: Order[];
};

type ShopContextValue = {
  ready: boolean;
  panel: Panel;
  setPanel: (panel: Panel) => void;
  lines: CartLine[];
  resolved: ResolvedLine[];
  count: number;
  subtotal: number;
  note: string;
  setNote: (note: string) => void;
  coupon: string;
  setCoupon: (coupon: string) => void;
  discount: number;
  couponLabel: string | null;
  couponMessage: string | null;
  total: number;
  add: (slug: string, variantId: string, qty?: number, open?: boolean) => void;
  setQty: (slug: string, variantId: string, qty: number) => void;
  remove: (slug: string, variantId: string) => void;
  clear: () => void;
  session: Session | null;
  orders: Order[];
  register: (input: { name: string; email: string; phone: string; password: string }) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  placeOrder: (input: { customer: Customer; payment: PaymentMethod; trxId: string }) => Order | string;
  findOrder: (id: string) => Order | undefined;
  toasts: Toast[];
  pushToast: (message: string) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

async function hashPassword(password: string) {
  const data = new TextEncoder().encode(`savasaachi:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function orderId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return `SFX-${[...bytes].map((byte) => alphabet[byte % alphabet.length]).join("")}`;
}

const emptyPersisted: Persisted = {
  lines: [],
  note: "",
  coupon: "",
  session: null,
  users: [],
  orders: [],
};

const storeListeners = new Set<() => void>();

function parsePersisted(raw: string): Persisted {
  if (!raw) return emptyPersisted;
  try {
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return {
      lines: Array.isArray(parsed.lines) ? parsed.lines : [],
      note: parsed.note ?? "",
      coupon: parsed.coupon ?? "",
      session: parsed.session ?? null,
      users: Array.isArray(parsed.users) ? parsed.users : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
    };
  } catch {
    return emptyPersisted;
  }
}

function readRaw() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(STORAGE_KEY) ?? "";
}

function writeRaw(value: Persisted) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  storeListeners.forEach((listener) => listener());
}

function subscribeStore(listener: () => void) {
  storeListeners.add(listener);
  return () => storeListeners.delete(listener);
}

function emptyServerSnapshot() {
  return "";
}

function subscribeHydration() {
  return () => {};
}

function clientReady() {
  return true;
}

function serverReady() {
  return false;
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [panel, setPanel] = useState<Panel>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const raw = useSyncExternalStore(subscribeStore, readRaw, emptyServerSnapshot);
  const persisted = useMemo(() => parsePersisted(raw), [raw]);
  const ready = useSyncExternalStore(subscribeHydration, clientReady, serverReady);

  const update = useCallback((recipe: (current: Persisted) => Persisted) => {
    writeRaw(recipe(parsePersisted(readRaw())));
  }, []);

  useEffect(() => {
    document.body.style.overflow = panel ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [panel]);

  const pushToast = useCallback((message: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2800);
  }, []);

  const resolved = useMemo(() => resolveLines(persisted.lines), [persisted.lines]);
  const subtotal = useMemo(() => subtotalOf(resolved), [resolved]);
  const couponResult = useMemo(
    () => (persisted.coupon ? applyCoupon(persisted.coupon, subtotal, resolved) : null),
    [persisted.coupon, resolved, subtotal],
  );
  const discount = couponResult?.ok ? couponResult.amount : 0;
  const total = Math.max(0, subtotal - discount);

  const add = useCallback((slug: string, variantId: string, qty = 1, open = true) => {
    update((current) => {
      const lines = [...current.lines];
      const index = lines.findIndex((line) => line.slug === slug && line.variantId === variantId);
      if (index >= 0) {
        lines[index] = { ...lines[index], qty: Math.min(10, lines[index].qty + qty) };
      } else {
        lines.push({ slug, variantId, qty: Math.min(10, qty) });
      }
      return { ...current, lines };
    });
    if (open) setPanel("cart");
  }, [update]);

  const setQty = useCallback((slug: string, variantId: string, qty: number) => {
    update((current) => ({
      ...current,
      lines:
        qty <= 0
          ? current.lines.filter((line) => !(line.slug === slug && line.variantId === variantId))
          : current.lines.map((line) =>
              line.slug === slug && line.variantId === variantId
                ? { ...line, qty: Math.min(10, qty) }
                : line,
            ),
    }));
  }, [update]);

  const remove = useCallback((slug: string, variantId: string) => {
    setQty(slug, variantId, 0);
  }, [setQty]);

  const clear = useCallback(() => {
    update((current) => ({ ...current, lines: [], coupon: "", note: "" }));
  }, [update]);

  const setNote = useCallback((note: string) => {
    update((current) => ({ ...current, note }));
  }, [update]);

  const setCoupon = useCallback((coupon: string) => {
    update((current) => ({ ...current, coupon }));
  }, [update]);

  const register = useCallback(
    async (input: { name: string; email: string; phone: string; password: string }) => {
      const email = input.email.trim().toLowerCase();
      if (persisted.users.some((user) => user.email === email)) {
        return "An account with this email is already on this device.";
      }
      const passwordHash = await hashPassword(input.password);
      const session = { name: input.name.trim(), email, phone: input.phone.trim() };
      update((current) => ({
        ...current,
        users: [...current.users, { ...session, passwordHash }],
        session,
      }));
      return null;
    },
    [persisted.users, update],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const normalized = email.trim().toLowerCase();
      const user = persisted.users.find((item) => item.email === normalized);
      if (!user) return "No account with that email is stored on this device.";
      const passwordHash = await hashPassword(password);
      if (passwordHash !== user.passwordHash) return "That password does not match.";
      update((current) => ({
        ...current,
        session: { name: user.name, email: user.email, phone: user.phone },
      }));
      return null;
    },
    [persisted.users, update],
  );

  const logout = useCallback(() => {
    update((current) => ({ ...current, session: null }));
  }, [update]);

  const placeOrder = useCallback(
    (input: { customer: Customer; payment: PaymentMethod; trxId: string }) => {
      if (resolved.length === 0) return "Your cart is empty.";
      const blocked = resolved.find((line) => !line.variant.available || line.variant.price <= 0);
      if (blocked) return `${blocked.product.name} is sold out. Remove it to continue.`;
      const order: Order = {
        id: orderId(),
        createdAt: new Date().toISOString(),
        email: input.customer.email.trim().toLowerCase(),
        customer: input.customer,
        payment: input.payment,
        trxId: input.trxId.trim(),
        note: persisted.note,
        coupon: couponResult?.ok ? couponResult.code : null,
        discount,
        subtotal,
        total,
        lines: resolved.map((line) => ({
          slug: line.slug,
          name: line.product.name,
          variantId: line.variantId,
          variantName: line.variant.name,
          price: line.variant.price,
          qty: line.qty,
        })),
        status: "placed",
      };
      update((current) => ({
        ...current,
        orders: [order, ...current.orders],
        lines: [],
        coupon: "",
        note: "",
      }));
      setPanel(null);
      return order;
    },
    [couponResult, discount, persisted.note, resolved, subtotal, total, update],
  );

  const findOrder = useCallback(
    (id: string) => persisted.orders.find((order) => order.id.toLowerCase() === id.trim().toLowerCase()),
    [persisted.orders],
  );

  const value: ShopContextValue = {
    ready,
    panel,
    setPanel,
    lines: persisted.lines,
    resolved,
    count: persisted.lines.reduce((sum, line) => sum + line.qty, 0),
    subtotal,
    note: persisted.note,
    setNote,
    coupon: persisted.coupon,
    setCoupon,
    discount,
    couponLabel: couponResult?.ok ? couponResult.label : null,
    couponMessage: couponResult && !couponResult.ok ? couponResult.message : null,
    total,
    add,
    setQty,
    remove,
    clear,
    session: persisted.session,
    orders: persisted.orders,
    register,
    login,
    logout,
    placeOrder,
    findOrder,
    toasts,
    pushToast,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used inside ShopProvider");
  return context;
}
