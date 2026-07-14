import type { MetadataRoute } from "next";
import {
  getAllBlogSlugs,
  getAllKitSlugs,
  getAllResourceSlugs,
} from "@/lib/content";
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
    {
      url: absoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
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

  const blogRoutes: MetadataRoute.Sitemap = getAllBlogSlugs().map((slug) => ({
    url: absoluteUrl(`/blog/${slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes, ...kitRoutes, ...resourceRoutes];
}

export const dynamic = "force-static";
