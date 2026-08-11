import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const routes = [
  "",
  "/about",
  "/skills",
  "/experience",
  "/projects",
  "/certificates",
  "/contact"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ehtesham-aalam.dev";

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7
  }));
}
