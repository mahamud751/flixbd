import { PageIntro, Shell } from "@/components/page-intro";
import { TrackForm } from "@/components/track-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Track order", description: "Look up an order saved in this browser." };

export default function Page() {
  return (
    <Shell>
      <PageIntro eyebrow="Orders" title="Track an order" lede="Enter the SFX order ID from the receipt. Lookup uses orders saved on this device." />
      <TrackForm />
    </Shell>
  );
}
