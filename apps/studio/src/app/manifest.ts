import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CuteCode",
    short_name: "CuteCode",
    description: "Create beautiful images of your code.",
    start_url: "/",
    display: "standalone",
    background_color: "#16120d",
    theme_color: "#16120d",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/favicon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
