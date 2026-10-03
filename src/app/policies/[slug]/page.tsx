import { policies } from "@/data/content";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return policies.map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = policies.find((item) => item.slug === slug);
  if (!policy) return { title: "Policy" };
  return { title: policy.title, description: `${policy.title} for ${site.name}.` };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = policies.find((item) => item.slug === slug);
  if (!policy) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs tracking-[0.2em] text-gold uppercase">Updated {policy.updated}</p>
      <h1 className="mt-3 font-display text-5xl leading-none">{policy.title}</h1>
      <div className="mt-8 space-y-8">
        {policy.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-3xl">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 leading-7 text-muted">{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
      <p className="mt-10 text-sm text-muted">
        Questions go to <Link className="text-gold" href="/contact">contact</Link> or {site.email}.
      </p>
    </article>
  );
}
