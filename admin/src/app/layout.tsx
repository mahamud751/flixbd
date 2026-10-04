import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AdminShell } from "@/components/admin-shell";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: { default: "StreamNest Admin", template: "%s · StreamNest Admin" },
  description: "Admin panel for the StreamNest BD packages catalog",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen font-sans text-slate-100 antialiased" suppressHydrationWarning>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
