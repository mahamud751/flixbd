import { AccountPanel } from "@/components/account-panel";
import { Shell } from "@/components/page-intro";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Log in" };

export default function Page() {
  return (
    <Shell>
      <AccountPanel mode="login" />
    </Shell>
  );
}
