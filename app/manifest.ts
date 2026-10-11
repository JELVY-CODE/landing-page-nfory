import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NFory",
    short_name: "NFory",
    description: "Ingeniería de IA & Automatización de Procesos",
    start_url: "/",
    display: "browser",
    background_color: "#09090B",
    theme_color: "#09090B",
    icons: [
      { src: "/images/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/images/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/images/favicon-nfory.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
