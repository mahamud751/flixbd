"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-5xl">Something broke on this page</h1>
      <button type="button" onClick={reset} className="mt-6 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-night">
        Try again
      </button>
    </div>
  );
}
