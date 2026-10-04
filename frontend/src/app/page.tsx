import { HomePage } from "@/components/home";

// The homepage shelves are built from the live packages API — render on
// request so admin edits show up without a rebuild.
export const dynamic = "force-dynamic";

export default function Page() {
  return <HomePage />;
}
