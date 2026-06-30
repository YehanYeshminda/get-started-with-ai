import type { MetadataRoute } from "next";
import { getAllKitSlugs, getAllResourceSlugs } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/browse"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const resourceRoutes: MetadataRoute.Sitemap = getAllResourceSlugs().map(
    (slug) => ({
      url: absoluteUrl(`/resource/${slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const kitRoutes: MetadataRoute.Sitemap = getAllKitSlugs().map((slug) => ({
    url: absoluteUrl(`/kit/${slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...kitRoutes, ...resourceRoutes];
}
