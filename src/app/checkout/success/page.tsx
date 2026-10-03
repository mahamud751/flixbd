import { Shell } from "@/components/page-intro";
import { SuccessPanel } from "@/components/success-panel";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Order placed" };

export default function Page() {
  return (
    <Shell>
      <Suspense fallback={<p className="text-muted">Loading the receipt…</p>}>
        <SuccessPanel />
      </Suspense>
    </Shell>
  );
}
