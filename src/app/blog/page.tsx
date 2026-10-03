import { PageIntro, Shell } from "@/components/page-intro";
import { posts } from "@/data/content";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guides",
  description: "How to pay with bKash, compare Netflix plans, and tell a gift card from a profile.",
};

export default function Page() {
  return (
    <Shell>
      <PageIntro eyebrow="Journal" title="Guides" lede="Short notes on paying locally and choosing the right option." />
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-[1.5rem] border border-line p-5 hover:border-gold">
            <p className="text-xs text-muted">{post.date} · {post.minutes} min</p>
            <h2 className="mt-2 font-display text-3xl leading-none">{post.title}</h2>
            <p className="mt-3 text-sm text-muted">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </Shell>
  );
}
