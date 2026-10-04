import { BuyBox } from "@/components/buy-box";
import { FaqList } from "@/components/faq-list";
import { Hero } from "@/components/hero";
import { ProductArt } from "@/components/product-art";
import { ProductGrid } from "@/components/product-card";
import { faqs, sampleReviews } from "@/data/content";
import { spotlightCopy } from "@/data/spotlights";
import { fetchProducts } from "@/lib/catalog";
import { sectionProducts, taka } from "@/lib/commerce";
import { whatsappHref } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";

export async function HomePage() {
  const products = await fetchProducts();
  const picks = sectionProducts(products, "picks");
  const combos = sectionProducts(products, "combos");
  const popular = sectionProducts(products, "popular");
  const ai = sectionProducts(products, "ai");
  const productivity = sectionProducts(products, "productivity");
  const featured = products.find((product) => product.featured);
  const spotlights = products.flatMap((product) =>
    spotlightCopy[product.slug]
      ? [{ ...product, spotlight: spotlightCopy[product.slug] }]
      : [],
  );

  return (
    <>
      <Hero />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <Shelf
          title={
            <>
              🍿 Your Top <Mark>Entertainment</Mark> Picks
            </>
          }
        >
          <ProductGrid products={picks} />
        </Shelf>
        <Shelf title={<>🍿 Ultimate Streaming Combos</>}>
          <ProductGrid products={combos} />
        </Shelf>
        <Shelf
          title={
            <>
              🔥 Most <Mark>Popular</Mark> Picks
            </>
          }
        >
          <ProductGrid products={popular} />
        </Shelf>

        {featured ? (
          <section className="grid items-center gap-8 py-14 lg:grid-cols-2">
            <ProductArt
              slug={featured.slug}
              name={featured.name}
              category={featured.category}
              image={featured.image}
              className="aspect-square rounded-2xl border border-line"
            />
            <BuyBox product={featured} />
          </section>
        ) : null}

        <section className="grid gap-4 py-6 md:grid-cols-2">
          {spotlights.map((product) => (
            <article
              key={product.slug}
              className="rounded-2xl border border-line bg-white p-6"
            >
              <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
                {product.spotlight?.kicker}
              </p>
              <h2 className="mt-2 text-3xl font-bold">{product.name}</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {product.spotlight?.points.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-muted">
                Starting at{" "}
                <span className="text-3xl font-bold text-ink">
                  {taka(product.variants[0]?.price ?? 0)}
                </span>
                <span>/mo</span>
              </p>
              <a
                href={whatsappHref(`Hi, I want to order ${product.name}`)}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white"
              >
                Order now
              </a>
            </article>
          ))}
        </section>

        <Shelf
          title={
            <>
              🤖 <Mark>AI</Mark> Collection
            </>
          }
        >
          <ProductGrid products={ai} />
        </Shelf>
        <Shelf
          title={
            <>
              <Mark>Productivity</Mark> Collection
            </>
          }
        >
          <ProductGrid products={productivity} />
        </Shelf>
      </div>

      <section className="bg-ink text-white">
        <div className="relative mx-auto aspect-[21/8] max-w-[1400px]">
          <Image
            src="/banners/payments.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="mx-auto grid max-w-[1100px] gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="text-sm font-semibold text-white/80">
              Easy WhatsApp ordering
            </p>
            <h2 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
              Add to cart, enter your details, and send the full order on
              WhatsApp.
            </h2>
            <Link
              href="/collections/streaming"
              className="mt-6 inline-block rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink"
            >
              Shop now
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-3 text-sm">
            {[
              "Premium Support",
              "Fast Delivery",
              "Reliable Digital Products",
              "Order on WhatsApp",
            ].map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-white/15 px-4 py-6 text-lg font-semibold leading-tight"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          Over 2,000 happy reviews
        </h2>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
          {sampleReviews.map((review) => (
            <figure
              key={review.name}
              className="w-[min(100%,340px)] shrink-0 rounded-[1.6rem] border border-line bg-panel p-5"
            >
              <div className="text-gold">★★★★★</div>
              <blockquote className="mt-3 text-sm leading-6">
                {review.quote}
              </blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold">{review.name}</span>
                <span className="text-muted"> · Buyer</span>
                <Link
                  href={`/products/${review.slug}`}
                  className="mt-2 block text-gold"
                >
                  {review.product}
                </Link>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-8 px-4 pb-8 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-4xl font-bold">
            <em className="text-gold">We&apos;re answerable!</em>
          </h2>
          <p className="mt-3 text-muted">
            Easy WhatsApp ordering and instant access to your favorite premium
            services. Need help? Contact us anytime.
          </p>
          <a
            href={whatsappHref("Hi, I have a question before I order.")}
            className="mt-5 inline-block rounded-full bg-ember px-5 py-3 text-sm font-semibold text-white"
          >
            WhatsApp
          </a>
        </div>
        <FaqList items={faqs.slice(0, 4)} bilingual />
      </section>
    </>
  );
}

function Mark({ children }: { children: React.ReactNode }) {
  return (
    <span className="underline decoration-gold decoration-[3px] underline-offset-[6px]">
      {children}
    </span>
  );
}

function Shelf({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="py-8 sm:py-10">
      <h2 className="mb-6 text-center text-[1.65rem] font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {children}
    </section>
  );
}
