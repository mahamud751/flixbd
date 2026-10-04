import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs tracking-[0.2em] text-gold uppercase">404</p>
      <h1 className="mt-2 font-display text-6xl">That page is not in the shop</h1>
      <p className="mt-3 text-muted">The product may be gone, or the link was typed wrong.</p>
      <Link href="/collections/all" className="mt-6 inline-block rounded-full bg-ember text-white px-5 py-3 text-sm font-semibold">
        Browse products
      </Link>
    </div>
  );
}
