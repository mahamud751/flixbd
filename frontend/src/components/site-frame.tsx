"use client";

import { CartView } from "@/components/cart-view";
import { ProductArt } from "@/components/product-art";
import { ShopProvider, useShop } from "@/context/shop";
import { popularProducts, priceLabel, searchProducts } from "@/lib/commerce";
import { cx } from "@/lib/cx";
import { site, whatsappHref } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collection" },
  { href: "/collections/streaming", label: "Streaming" },
  { href: "/faq", label: "Support" },
] as const;

const marquee =
  "Instant delivery on Netflix, Prime, Disney+, HBO & ChatGPT — order in one tap on WhatsApp.";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <ShopProvider>
      <Frame>{children}</Frame>
    </ShopProvider>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  const shop = useShop();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (event.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        event.preventDefault();
        shop.setPanel("search");
      }
      if (event.key === "Escape") shop.setPanel(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shop]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-night"
      >
        Skip to content
      </a>
      <div className="ffa text-white">
        <div className="ffa-track">
          {[0, 1].map((copy) => (
            <Link
              key={copy}
              href="/collections/streaming"
              className="flex items-center"
            >
              {Array.from({ length: 3 }, (_, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-3 px-5 py-2.5 text-sm font-semibold whitespace-nowrap"
                >
                  <Bolt />
                  {marquee}
                  <span className="rounded-full bg-white px-4 py-1 text-xs font-black tracking-wide text-gold uppercase">
                    Order now
                  </span>
                  <Star />
                </span>
              ))}
            </Link>
          ))}
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="mx-auto grid max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center lg:hidden"
              aria-label="Open menu"
              onClick={() => shop.setPanel("menu")}
            >
              <MenuIcon />
            </button>
            <Link
              href="/"
              className="block overflow-hidden rounded-lg bg-black"
              aria-label={`${site.name} home`}
            >
              <Image
                src={site.logo}
                alt={site.name}
                width={746}
                height={311}
                priority
                className="h-10 w-auto sm:h-12"
              />
            </Link>
          </div>
          <nav className="hidden items-center justify-center gap-8 text-[13px] font-semibold tracking-[0.12em] uppercase lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => shop.setPanel("search")}
              className="grid h-10 w-10 place-items-center"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
            <Link
              href="/account"
              className="grid h-10 w-10 place-items-center"
              aria-label={shop.session ? shop.session.name : "Log in"}
            >
              <UserIcon />
            </Link>
            <button
              type="button"
              onClick={() => shop.setPanel("cart")}
              className="relative grid h-10 w-10 place-items-center"
              aria-label={`Cart, ${shop.ready ? shop.count : 0} items`}
            >
              <BagIcon />
              <span className="absolute top-1 right-0 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
                {shop.ready ? shop.count : 0}
              </span>
            </button>
          </div>
        </div>
      </header>
      <main id="main" className="min-w-0 flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <SearchDialog />
      <MenuDrawer />
      <a
        href={whatsappHref(`Hi ${site.name}, I want to place an order.`)}
        target="_blank"
        rel="noreferrer"
        className="fixed right-4 bottom-4 z-30 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-[#06210f] shadow-lg"
      >
        WhatsApp
      </a>
      <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col gap-2">
        {shop.toasts.map((toast) => (
          <p
            key={toast.id}
            className="pointer-events-auto rounded-full bg-ink px-4 py-2 text-sm text-night shadow-lg"
          >
            {toast.message}
          </p>
        ))}
      </div>
    </>
  );
}

function CartDrawer() {
  const shop = useShop();
  const open = shop.panel === "cart";
  return (
    <div
      className={cx("fixed inset-0 z-50", open ? "" : "pointer-events-none")}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close cart"
        className={cx(
          "absolute inset-0 bg-black/60 transition",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={() => shop.setPanel(null)}
      />
      <aside
        role="dialog"
        aria-label="Your cart"
        className={cx(
          "absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-night p-5 shadow-2xl transition duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-3xl">Your cart {shop.count}</h2>
          <button
            type="button"
            onClick={() => shop.setPanel(null)}
            className="rounded-full border border-line px-3 py-1 text-sm"
          >
            Close
          </button>
        </div>
        <CartView mode="drawer" />
      </aside>
    </div>
  );
}

function SearchDialog() {
  const shop = useShop();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const open = shop.panel === "search";
  const results = useMemo(
    () =>
      query.trim()
        ? searchProducts(shop.products, query).slice(0, 8)
        : popularProducts(shop.products),
    [query, shop.products],
  );

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function go(event: React.FormEvent) {
    event.preventDefault();
    shop.setPanel(null);
    router.push(
      query.trim()
        ? `/search?q=${encodeURIComponent(query.trim())}`
        : "/search",
    );
  }

  return (
    <div
      className={cx("fixed inset-0 z-50", open ? "" : "pointer-events-none")}
    >
      <button
        type="button"
        aria-label="Close search"
        className={cx(
          "absolute inset-0 bg-black/70",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={() => shop.setPanel(null)}
      />
      <div
        className={cx(
          "absolute top-20 left-1/2 w-[min(720px,calc(100%-2rem))] -translate-x-1/2 rounded-[1.6rem] border border-line bg-night p-5 transition",
          open ? "opacity-100" : "opacity-0",
        )}
      >
        <form onSubmit={go}>
          <label className="block text-sm text-muted" htmlFor="site-search">
            Search the catalog
          </label>
          <input
            id="site-search"
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Netflix, iTunes, ChatGPT…"
            className="mt-2 w-full rounded-2xl border border-line bg-black/[0.04] px-4 py-3 outline-none focus:border-gold"
          />
        </form>
        <p className="mt-4 text-xs tracking-[0.18em] text-gold uppercase">
          {query.trim() ? "Matches" : "Most searched"}
        </p>
        <ul className="mt-3 max-h-[50vh] space-y-2 overflow-y-auto">
          {results.map((product) => (
            <li key={product.slug}>
              <Link
                href={`/products/${product.slug}`}
                onClick={() => shop.setPanel(null)}
                className="flex items-center gap-3 rounded-2xl p-2 hover:bg-black/[0.04]"
              >
                <ProductArt
                  compact
                  slug={product.slug}
                  name={product.name}
                  category={product.category}
                  image={product.image}
                  className="h-14 w-14 shrink-0 rounded-xl"
                />
                <span>
                  <span className="block font-medium">{product.name}</span>
                  <span className="text-sm text-muted">
                    {product.typeLabel} · {priceLabel(product)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
          {query.trim() && results.length === 0 ? (
            <li className="text-sm text-muted">
              No products match that search.
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}

function MenuDrawer() {
  const shop = useShop();
  const open = shop.panel === "menu";
  return (
    <div
      className={cx(
        "fixed inset-0 z-50 lg:hidden",
        open ? "" : "pointer-events-none",
      )}
    >
      <button
        type="button"
        aria-label="Close menu"
        className={cx(
          "absolute inset-0 bg-black/70",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={() => shop.setPanel(null)}
      />
      <aside
        className={cx(
          "absolute top-0 left-0 h-full w-[min(360px,86vw)] bg-night p-6 transition",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <p className="font-display text-3xl">Browse</p>
          <button
            type="button"
            onClick={() => shop.setPanel(null)}
            className="text-sm text-muted"
          >
            Close
          </button>
        </div>
        <nav className="mt-6 grid gap-2 text-lg">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => shop.setPanel(null)}
              className="rounded-2xl px-2 py-2 hover:bg-black/[0.04]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/account"
            onClick={() => shop.setPanel(null)}
            className="rounded-2xl px-2 py-2 hover:bg-black/[0.04]"
          >
            Account
          </Link>
          <Link
            href="/track"
            onClick={() => shop.setPanel(null)}
            className="rounded-2xl px-2 py-2 hover:bg-black/[0.04]"
          >
            Track order
          </Link>
          <Link
            href="/faq"
            onClick={() => shop.setPanel(null)}
            className="rounded-2xl px-2 py-2 hover:bg-black/[0.04]"
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            onClick={() => shop.setPanel(null)}
            className="rounded-2xl px-2 py-2 hover:bg-black/[0.04]"
          >
            Contact
          </Link>
        </nav>
      </aside>
    </div>
  );
}

const policyLinks = [
  { href: "/policies/refund", label: "Refund & exchange" },
  { href: "/policies/terms", label: "Terms & conditions" },
  { href: "/policies/privacy", label: "Privacy policy" },
  { href: "/policies/delivery", label: "Order & delivery" },
  { href: "/contact", label: "Contact information" },
] as const;

function Bolt() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden="true">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  );
}

function Star() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 fill-white/80"
      aria-hidden="true"
    >
      <path d="m12 2 2.7 6.6L22 9.2l-5 4.5 1.5 6.8L12 17.3 5.5 20.5 7 13.7 2 9.2l7.3-.6L12 2z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19c1.4-3 3.8-4.5 7-4.5S17.6 16 19 19" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white/80">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link
            href="/"
            className="inline-block"
            aria-label={`${site.name} home`}
          >
            <Image
              src={site.logo}
              alt={site.name}
              width={746}
              height={311}
              className="h-16 w-auto"
            />
          </Link>
          <p className="mt-3 text-sm leading-6">
            A trusted digital subscription shop for Bangladesh — streaming, AI
            tools, software, and gift cards, paid locally and delivered on
            WhatsApp.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {site.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 px-3 py-1 text-xs hover:border-white hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
        <FooterColumn title="Policies" links={policyLinks} />
        <FooterColumn
          title="Shop"
          links={[
            ...nav.filter((item) => item.href.startsWith("/collections")),
            { href: "/collections/all", label: "All products" },
          ]}
        />
        <div>
          <p className="text-sm font-semibold tracking-wide text-white uppercase">
            Contact
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>{site.address}</li>
            <li>
              {site.hours} · {site.hoursNote}
            </li>
            <li>
              <a
                className="hover:text-white"
                href={whatsappHref("Hi, I need help with an order.")}
              >
                WhatsApp {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="hover:text-white" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              <Link className="hover:text-white" href="/track">
                Track an order
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-[1240px] px-4 py-5 pr-28 text-xs leading-5 text-white/60 sm:px-6">
          Copyright © {new Date().getFullYear()} | {site.legal} | All rights
          reserved. | Developed by Savasaachi Developers.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-semibold tracking-wide text-white uppercase">
        {title}
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((item) => (
          <li key={item.href}>
            <Link className="hover:text-white" href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
