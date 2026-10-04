"use client";

import { useState } from "react";
import type { Category, Product, ProductPayload } from "@/lib/types";
import { Button, Field, inputCx } from "@/components/ui";

const HOME_SECTIONS = ["", "picks", "combos", "popular", "ai", "productivity"];

type FormState = {
  name: string;
  slug: string;
  categoryId: string;
  typeLabel: string;
  blurb: string;
  image: string;
  rating: string;
  reviewCount: string;
  homeSection: string;
  sortOrder: string;
  caution: string;
  featuresText: string;
  paragraphsText: string;
  isActive: boolean;
  isFeatured: boolean;
};

function initialState(
  product: Product | null,
  categories: Category[],
): FormState {
  return {
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    categoryId: product?.categoryId ?? categories[0]?.id ?? "",
    typeLabel: product?.typeLabel ?? "",
    blurb: product?.blurb ?? "",
    image: product?.image ?? "",
    rating: product ? String(product.rating) : "4.7",
    reviewCount: product ? String(product.reviewCount) : "0",
    homeSection: product?.homeSection ?? "",
    sortOrder: product ? String(product.sortOrder) : "0",
    caution: product?.caution ?? "",
    featuresText: (product?.features ?? []).join("\n"),
    paragraphsText: (product?.paragraphs ?? []).join("\n\n"),
    isActive: product ? product.isActive : true,
    isFeatured: product ? product.isFeatured : false,
  };
}

function toPayload(state: FormState): ProductPayload {
  const features = state.featuresText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const paragraphs = state.paragraphsText
    .split(/\n{2,}/)
    .map((line) => line.trim())
    .filter(Boolean);
  return {
    name: state.name.trim(),
    slug: state.slug.trim() || undefined,
    categoryId: state.categoryId,
    typeLabel: state.typeLabel.trim() || undefined,
    blurb: state.blurb.trim() || undefined,
    image: state.image.trim() || undefined,
    rating: Number(state.rating) || 4.7,
    reviewCount: Number(state.reviewCount) || 0,
    homeSection: state.homeSection || undefined,
    sortOrder: Number(state.sortOrder) || 0,
    caution: state.caution.trim() || undefined,
    features,
    paragraphs,
    isActive: state.isActive,
    isFeatured: state.isFeatured,
  };
}

export default function ProductForm({
  product,
  categories,
  submitLabel,
  onSubmit,
}: {
  product: Product | null;
  categories: Category[];
  submitLabel: string;
  onSubmit: (payload: ProductPayload) => Promise<void>;
}) {
  const [state, setState] = useState<FormState>(() =>
    initialState(product, categories),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!state.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!state.categoryId) {
      setError("Pick a category (create one first if none exist).");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit(toPayload(state));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name">
          <input
            className={inputCx}
            value={state.name}
            onChange={(event) => set("name", event.target.value)}
            placeholder="Netflix Premium"
          />
        </Field>
        <Field label="Slug" hint="Leave empty to derive it from the name.">
          <input
            className={inputCx}
            value={state.slug}
            onChange={(event) => set("slug", event.target.value)}
            placeholder="netflix-premium"
          />
        </Field>
        <Field label="Category">
          <select
            className={inputCx}
            value={state.categoryId}
            onChange={(event) => set("categoryId", event.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon ? `${category.icon} ` : ""}
                {category.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Type label">
          <input
            className={inputCx}
            value={state.typeLabel}
            onChange={(event) => set("typeLabel", event.target.value)}
            placeholder="Streaming"
          />
        </Field>
        <Field label="Image path / URL">
          <input
            className={inputCx}
            value={state.image}
            onChange={(event) => set("image", event.target.value)}
            placeholder="/shop/netflix-subscription-bangladesh.png"
          />
        </Field>
        <Field label="Home section">
          <select
            className={inputCx}
            value={state.homeSection}
            onChange={(event) => set("homeSection", event.target.value)}
          >
            {HOME_SECTIONS.map((section) => (
              <option key={section} value={section}>
                {section || "none"}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Rating (0–5)">
          <input
            className={inputCx}
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={state.rating}
            onChange={(event) => set("rating", event.target.value)}
          />
        </Field>
        <Field label="Review count">
          <input
            className={inputCx}
            type="number"
            min="0"
            value={state.reviewCount}
            onChange={(event) => set("reviewCount", event.target.value)}
          />
        </Field>
        <Field label="Sort order" hint="Lower sorts first.">
          <input
            className={inputCx}
            type="number"
            min="0"
            value={state.sortOrder}
            onChange={(event) => set("sortOrder", event.target.value)}
          />
        </Field>
      </div>

      <Field label="Blurb">
        <textarea
          className={`${inputCx} min-h-16`}
          value={state.blurb}
          onChange={(event) => set("blurb", event.target.value)}
          placeholder="One-line description shown on cards."
        />
      </Field>

      <Field label="Features" hint="One per line.">
        <textarea
          className={`${inputCx} min-h-24`}
          value={state.featuresText}
          onChange={(event) => set("featuresText", event.target.value)}
        />
      </Field>

      <Field
        label="Description paragraphs"
        hint="Separate paragraphs with a blank line."
      >
        <textarea
          className={`${inputCx} min-h-32`}
          value={state.paragraphsText}
          onChange={(event) => set("paragraphsText", event.target.value)}
        />
      </Field>

      <Field label="Caution" hint="Optional warning shown to buyers.">
        <textarea
          className={`${inputCx} min-h-16`}
          value={state.caution}
          onChange={(event) => set("caution", event.target.value)}
        />
      </Field>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={state.isActive}
            onChange={(event) => set("isActive", event.target.checked)}
            className="size-4 accent-brand-500"
          />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={state.isFeatured}
            onChange={(event) => set("isFeatured", event.target.checked)}
            className="size-4 accent-brand-500"
          />
          Featured
        </label>
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
