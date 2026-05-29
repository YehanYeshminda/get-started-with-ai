import Link from "next/link";
import { notFound } from "next/navigation";
import { MetaLine } from "@/components/AgentBadge";
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

type ResourcePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllResourceSlugs().map((slug) => ({ slug }));
}

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
  const supportedAgents = resource.agents.map(
    (agentSlug) => agentMap.get(agentSlug)?.name ?? formatLabel(agentSlug),
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link
        href="/browse"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Browse
      </Link>

      <MetaLine
        items={[resource.type, ...supportedAgents]}
        className="mt-8"
      />

      <h1 className="mt-2 text-2xl font-medium">{resource.name}</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {resource.description}
      </p>

      {copyText ? (
        <div className="mt-8">
          <CopyBlock
            text={copyText}
            label={resource.npxCommand ? "Install" : "Snippet"}
            externalUrl={resource.skillsShUrl}
          />
        </div>
      ) : null}

      {resource.githubUrl ? (
        <p className="mt-4 text-sm">
          <a
            href={resource.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            GitHub repo
          </a>
        </p>
      ) : null}

      {resource.snippet && resource.npxCommand ? (
        <div className="mt-8">
          <CopyBlock text={resource.snippet} label="Config snippet" />
        </div>
      ) : null}

      {relatedResources.length > 0 ? (
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="text-sm font-medium">Related</h2>
          <div className="mt-4 divide-y divide-border">
            {relatedResources.map((related) => (
              <ResourceCard
                key={related.slug}
                resource={related}
                agents={agents}
                compact
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
