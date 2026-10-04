import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StreamNest BD",
    short_name: "StreamNest",
    description: "OTT, AI, and digital subscriptions in Bangladesh",
    start_url: "/",
    display: "standalone",
    background_color: "#09080c",
    theme_color: "#09080c",
    icons: [{ src: "/icon-512.png", sizes: "512x512", type: "image/png" }],
  };
}
