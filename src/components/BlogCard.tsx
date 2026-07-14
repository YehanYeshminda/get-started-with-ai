import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { formatDate, readingMinutes } from "@/lib/utils";

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  const minutes = readingMinutes([
    post.title,
    post.excerpt,
    ...post.body.flatMap((block) => {
      if (block.type === "list") return block.items;
      if (block.type === "code") return [block.code];
      return [block.text];
    }),
  ]);

  return (
    <article className="group relative flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-strong">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 font-mono">
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-skill)]"
            aria-hidden="true"
          />
          {post.category}
        </span>
        <span aria-hidden="true">·</span>
        <span className="font-mono">{minutes} min read</span>
      </div>

      <h3 className="mt-2.5 text-base font-medium text-foreground">
        <Link href={`/blog/${post.slug}`} className="hover:underline">
          <span className="absolute inset-0" aria-hidden="true" />
          {post.title}
        </Link>
      </h3>

      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
        {post.excerpt}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
        <p className="min-w-0 truncate font-mono text-xs text-muted-foreground">
          {formatDate(post.date)}
        </p>
        <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground">
          Read →
        </span>
      </div>
    </article>
  );
}
