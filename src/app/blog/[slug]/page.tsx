import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BlogBody } from "@/components/BlogBody";
import { ResourceCard } from "@/components/ResourceCard";
import {
  getAgents,
  getAllBlogSlugs,
  getBlogPostBySlug,
  getResources,
} from "@/lib/content";
import { SITE_NAME, absoluteUrl, metaDescription } from "@/lib/seo";
import { formatDate, readingMinutes } from "@/lib/utils";

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Not found", robots: { index: false, follow: false } };
  }

  const description = metaDescription(post.excerpt);
  const url = `/blog/${post.slug}`;

  return {
    title: post.title,
    description,
    keywords: [post.category, ...post.tags],
    alternates: { canonical: url },
    openGraph: {
      title: `${post.title} — ${SITE_NAME}`,
      description,
      url,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} — ${SITE_NAME}`,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const minutes = readingMinutes([
    post.title,
    post.excerpt,
    ...post.body.flatMap((block) => {
      if (block.type === "list") return block.items;
      if (block.type === "code") return [block.code];
      return [block.text];
    }),
  ]);

  const agents = getAgents();
  const relatedResources = getResources().filter((resource) =>
    post.related.includes(resource.slug),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: metaDescription(post.excerpt),
    url: absoluteUrl(`/blog/${post.slug}`),
    datePublished: post.date,
    articleSection: post.category,
    keywords: post.tags.join(", "),
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: SITE_NAME },
    isAccessibleForFree: true,
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Learn AI
      </Link>

      <article className="mt-8">
        <header>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-mono">
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-skill)]"
                aria-hidden="true"
              />
              {post.category}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{formatDate(post.date)}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{minutes} min read</span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        </header>

        <BlogBody blocks={post.body} />
      </article>

      {relatedResources.length > 0 ? (
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="text-sm font-medium">Get started with these</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Drop-in configs from the catalog to put this into practice.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {relatedResources.map((resource) => (
              <ResourceCard
                key={resource.slug}
                resource={resource}
                agents={agents}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
