import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Savasaachi Flix BD",
    short_name: "Savasaachi",
    description: "OTT, AI, and digital subscriptions in Bangladesh",
    start_url: "/",
    display: "standalone",
    background_color: "#09080c",
    theme_color: "#09080c",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
