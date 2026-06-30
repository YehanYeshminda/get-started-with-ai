import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { TagList, TypeBadge } from "@/components/AgentBadge";
import { CopyBlock } from "@/components/CopyBlock";
import { ResourceCard } from "@/components/ResourceCard";
import {
  getAgents,
  getAllResourceSlugs,
  getResourceBySlug,
  getResources,
} from "@/lib/content";
import { getCopyTextForResource } from "@/lib/search";
import { formatLabel } from "@/lib/utils";
import { SITE_NAME, absoluteUrl, metaDescription } from "@/lib/seo";
import type { Agent, ResourceType } from "@/lib/types";

type ResourcePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllResourceSlugs().map((slug) => ({ slug }));
}

const typeLabels: Record<ResourceType, string> = {
  skill: "Skill",
  rule: "Rule",
  mcp: "MCP server",
  hook: "Hook",
  setting: "Setting",
};

export async function generateMetadata({
  params,
}: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);

  if (!resource) {
    return { title: "Not found", robots: { index: false, follow: false } };
  }

  const description = metaDescription(resource.description);
  const url = `/resource/${resource.slug}`;
  const title = `${resource.name} — ${typeLabels[resource.type]}`;

  return {
    title,
    description,
    keywords: [resource.name, ...resource.tags, ...resource.useCases],
    alternates: { canonical: url },
    openGraph: {
      title: `${resource.name} — ${SITE_NAME}`,
      description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${resource.name} — ${SITE_NAME}`,
      description,
    },
  };
}

const configPathKey: Record<ResourceType, keyof Agent["configPaths"]> = {
  skill: "skills",
  rule: "rules",
  mcp: "mcp",
  hook: "hooks",
  setting: "mcp",
};

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  const agents = getAgents();
  const agentMap = new Map(agents.map((agent) => [agent.slug, agent]));
  const relatedResources = getResources().filter((item) =>
    resource.related.includes(item.slug),
  );
  const copyText = getCopyTextForResource(resource);
  const pathKey = configPathKey[resource.type];
  const supportedAgents = resource.agents
    .map((agentSlug) => agentMap.get(agentSlug))
    .filter((agent): agent is Agent => Boolean(agent));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: `${resource.name} — ${typeLabels[resource.type]}`,
        description: metaDescription(resource.description),
        url: absoluteUrl(`/resource/${resource.slug}`),
        keywords: [...resource.tags, ...resource.useCases].join(", "),
        articleSection: typeLabels[resource.type],
        author: { "@type": "Organization", name: SITE_NAME },
        publisher: { "@type": "Organization", name: SITE_NAME },
        isAccessibleForFree: true,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Browse",
            item: absoluteUrl("/browse"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: resource.name,
            item: absoluteUrl(`/resource/${resource.slug}`),
          },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/browse"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Browse
      </Link>

      <header className="mt-8">
        <TypeBadge type={resource.type} />
        <h1 className="mt-2.5 text-2xl font-semibold tracking-tight">
          {resource.name}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {resource.description}
        </p>
        <TagList tags={resource.tags} className="mt-5" max={12} />
      </header>

      {copyText ? (
        <div className="mt-8">
          <CopyBlock
            text={copyText}
            label={resource.npxCommand ? "Install" : "Snippet"}
            externalUrl={resource.skillsShUrl}
          />
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        {resource.githubUrl ? (
          <a
            href={resource.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub repo
          </a>
        ) : null}
        {resource.skillsShUrl ? (
          <a
            href={resource.skillsShUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            skills.sh
          </a>
        ) : null}
      </div>

      {resource.snippet && resource.npxCommand ? (
        <div className="mt-8">
          <CopyBlock text={resource.snippet} label="Config snippet" />
        </div>
      ) : null}

      {/* Where it installs */}
      <section className="mt-12 rounded-xl border border-border bg-surface p-5">
        <h2 className="text-sm font-medium">Where it installs</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Default config location for each supported agent.
        </p>
        <ul className="mt-4 divide-y divide-border">
          {supportedAgents.map((agent) => (
            <li
              key={agent.slug}
              className="flex items-center justify-between gap-3 py-2.5 text-sm"
            >
              <a
                href={agent.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground transition-colors hover:text-muted-foreground"
              >
                {agent.name}
              </a>
              <code className="truncate font-mono text-xs text-muted-foreground">
                {agent.configPaths[pathKey]}
              </code>
            </li>
          ))}
        </ul>
      </section>

      {resource.useCases.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-sm font-medium">Best for</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {resource.useCases.map((useCase) => (
              <span
                key={useCase}
                className="inline-flex items-center rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground"
              >
                {formatLabel(useCase)}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {relatedResources.length > 0 ? (
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="text-sm font-medium">Related resources</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {relatedResources.map((related) => (
              <ResourceCard
                key={related.slug}
                resource={related}
                agents={agents}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
