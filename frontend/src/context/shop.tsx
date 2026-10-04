"use client";

import { fetchMe, loginAccount, registerAccount } from "@/lib/auth";
import { fetchProducts } from "@/lib/catalog";
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
  Product,
  Session,
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
  token: string | null; // customer JWT from the API
  orders: Order[];
};

type ShopContextValue = {
  ready: boolean;
  panel: Panel;
  setPanel: (panel: Panel) => void;
  lines: CartLine[];
  resolved: ResolvedLine[];
  products: Product[];
  productsReady: boolean;
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
  register: (input: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  placeOrder: (input: { customer: Customer }) => Order | string;
  findOrder: (id: string) => Order | undefined;
  toasts: Toast[];
  pushToast: (message: string) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

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
  token: null,
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
      // Sessions from the old device-only accounts have no token; drop them.
      session: parsed.token ? (parsed.session ?? null) : null,
      token: parsed.token ?? null,
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
  const raw = useSyncExternalStore(
    subscribeStore,
    readRaw,
    emptyServerSnapshot,
  );
  const persisted = useMemo(() => parsePersisted(raw), [raw]);
  const ready = useSyncExternalStore(
    subscribeHydration,
    clientReady,
    serverReady,
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [productsReady, setProductsReady] = useState(false);

  // Live catalog from the packages API — the cart resolves against this copy,
  // so admin price/stock edits show up in the shop without a rebuild.
  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .catch(() => [])
      .then((list) => {
        if (cancelled) return;
        setProducts(list);
        setProductsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  const resolved = useMemo(
    () => resolveLines(persisted.lines, products),
    [persisted.lines, products],
  );
  const subtotal = useMemo(() => subtotalOf(resolved), [resolved]);
  const couponResult = useMemo(
    () =>
      persisted.coupon
        ? applyCoupon(persisted.coupon, subtotal, resolved)
        : null,
    [persisted.coupon, resolved, subtotal],
  );
  const discount = couponResult?.ok ? couponResult.amount : 0;
  const total = Math.max(0, subtotal - discount);

  const add = useCallback(
    (slug: string, variantId: string, qty = 1, open = true) => {
      update((current) => {
        const lines = [...current.lines];
        const index = lines.findIndex(
          (line) => line.slug === slug && line.variantId === variantId,
        );
        if (index >= 0) {
          lines[index] = {
            ...lines[index],
            qty: Math.min(10, lines[index].qty + qty),
          };
        } else {
          lines.push({ slug, variantId, qty: Math.min(10, qty) });
        }
        return { ...current, lines };
      });
      if (open) setPanel("cart");
    },
    [update],
  );

  const setQty = useCallback(
    (slug: string, variantId: string, qty: number) => {
      update((current) => ({
        ...current,
        lines:
          qty <= 0
            ? current.lines.filter(
                (line) => !(line.slug === slug && line.variantId === variantId),
              )
            : current.lines.map((line) =>
                line.slug === slug && line.variantId === variantId
                  ? { ...line, qty: Math.min(10, qty) }
                  : line,
              ),
      }));
    },
    [update],
  );

  const remove = useCallback(
    (slug: string, variantId: string) => {
      setQty(slug, variantId, 0);
    },
    [setQty],
  );

  const clear = useCallback(() => {
    update((current) => ({ ...current, lines: [], coupon: "", note: "" }));
  }, [update]);

  const setNote = useCallback(
    (note: string) => {
      update((current) => ({ ...current, note }));
    },
    [update],
  );

  const setCoupon = useCallback(
    (coupon: string) => {
      update((current) => ({ ...current, coupon }));
    },
    [update],
  );

  // Re-check a stored token once per load; drop the session if the API rejects it.
  const token = persisted.token;
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetchMe(token)
      .then((session) => {
        if (cancelled) return;
        update((current) =>
          current.token !== token
            ? current
            : session
              ? { ...current, session }
              : { ...current, session: null, token: null },
        );
      })
      .catch(() => {}); // offline: keep the cached session
    return () => {
      cancelled = true;
    };
  }, [token, update]);

  const register = useCallback(
    async (input: {
      name: string;
      email: string;
      phone: string;
      password: string;
    }) => {
      try {
        const { token, session } = await registerAccount({
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          phone: input.phone.trim(),
          password: input.password,
        });
        update((current) => ({ ...current, token, session }));
        return null;
      } catch (error) {
        return (error as Error).message;
      }
    },
    [update],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { token, session } = await loginAccount(
          email.trim().toLowerCase(),
          password,
        );
        update((current) => ({ ...current, token, session }));
        return null;
      } catch (error) {
        return (error as Error).message;
      }
    },
    [update],
  );

  const logout = useCallback(() => {
    update((current) => ({ ...current, session: null, token: null }));
  }, [update]);

  const placeOrder = useCallback(
    (input: { customer: Customer }) => {
      if (resolved.length === 0) return "Your cart is empty.";
      const blocked = resolved.find(
        (line) => !line.variant.available || line.variant.price <= 0,
      );
      if (blocked)
        return `${blocked.product.name} is sold out. Remove it to continue.`;
      const order: Order = {
        id: orderId(),
        createdAt: new Date().toISOString(),
        email: input.customer.email.trim().toLowerCase(),
        customer: input.customer,
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
    (id: string) =>
      persisted.orders.find(
        (order) => order.id.toLowerCase() === id.trim().toLowerCase(),
      ),
    [persisted.orders],
  );

  const value: ShopContextValue = {
    ready,
    panel,
    setPanel,
    lines: persisted.lines,
    resolved,
    products,
    productsReady,
    count: persisted.lines.reduce((sum, line) => sum + line.qty, 0),
    subtotal,
    note: persisted.note,
    setNote,
    coupon: persisted.coupon,
    setCoupon,
    discount,
    couponLabel: couponResult?.ok ? couponResult.label : null,
    couponMessage:
      couponResult && !couponResult.ok ? couponResult.message : null,
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
