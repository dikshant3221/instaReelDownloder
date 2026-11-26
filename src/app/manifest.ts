import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ViralDarshan — Reel Intelligence",
    short_name: "ViralDarshan",
    description:
      "AI-powered Vrindavan Reel archiver: one approved video per topic, automatic YouTube publishing.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0e17",
    theme_color: "#0a0e17",
    icons: [
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
