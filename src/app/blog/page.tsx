import type { Metadata } from "next";
import { BlogCard } from "@/components/BlogCard";
import { getBlogPosts } from "@/lib/content";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";

const title = "Learn AI";
const description =
  "Plain-English guides on how AI works — language models, tokens, context, and agents — from the team behind Agent Config Hub.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `${title} — ${SITE_NAME}`,
    description,
    url: "/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — ${SITE_NAME}`,
    description,
  },
};

export default function BlogIndexPage() {
  const posts = getBlogPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${title} — ${SITE_NAME}`,
    description,
    url: absoluteUrl("/blog"),
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      url: absoluteUrl(`/blog/${post.slug}`),
      author: { "@type": "Organization", name: post.author },
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-2xl">
        <p className="font-mono text-sm text-muted-foreground">
          <span className="text-muted-foreground">~/</span>learn-ai
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Learn how AI works
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-sm text-muted-foreground">
          No posts yet — check back soon.
        </p>
      )}
    </div>
  );
}
