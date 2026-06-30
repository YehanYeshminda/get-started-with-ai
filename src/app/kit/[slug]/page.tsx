import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { KitBadge } from "@/components/AgentBadge";
import { KitWizard } from "@/components/KitWizard";
import {
  getAgents,
  getAllKitSlugs,
  getKitBySlug,
  getResources,
} from "@/lib/content";
import { formatLabel } from "@/lib/utils";
import { SITE_NAME, absoluteUrl, metaDescription } from "@/lib/seo";

type KitPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllKitSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: KitPageProps): Promise<Metadata> {
  const { slug } = await params;
  const kit = getKitBySlug(slug);

  if (!kit) {
    return { title: "Not found", robots: { index: false, follow: false } };
  }

  const description = metaDescription(kit.description);
  const url = `/kit/${kit.slug}`;
  const title = `${kit.name} — Starter kit`;

  return {
    title,
    description,
    keywords: [kit.name, "starter kit", ...kit.useCases, ...kit.agents],
    alternates: { canonical: url },
    openGraph: {
      title: `${kit.name} — ${SITE_NAME}`,
      description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${kit.name} — ${SITE_NAME}`,
      description,
    },
  };
}

export default async function KitPage({ params }: KitPageProps) {
  const { slug } = await params;
  const kit = getKitBySlug(slug);

  if (!kit) {
    notFound();
  }

  const agents = getAgents();
  const resources = getResources();
  const resourceMap = new Map(resources.map((item) => [item.slug, item]));
  const agentMap = new Map(agents.map((agent) => [agent.slug, agent]));
  const agentNames = kit.agents.map(
    (agentSlug) => agentMap.get(agentSlug)?.name ?? formatLabel(agentSlug),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        name: kit.name,
        description: metaDescription(kit.description),
        url: absoluteUrl(`/kit/${kit.slug}`),
        totalTime: "PT10M",
        step: kit.steps.map((step, index) => {
          const resource = resourceMap.get(step.resourceSlug);
          return {
            "@type": "HowToStep",
            position: index + 1,
            name: step.title,
            text: resource
              ? metaDescription(resource.description, 120)
              : step.title,
            url: resource
              ? absoluteUrl(`/resource/${resource.slug}`)
              : undefined,
          };
        }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          {
            "@type": "ListItem",
            position: 2,
            name: "Browse",
            item: absoluteUrl("/browse"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: kit.name,
            item: absoluteUrl(`/kit/${kit.slug}`),
          },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
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

      <div className="mt-8 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <KitBadge />
          <span className="text-xs text-muted-foreground">
            {agentNames.join(", ")} · {kit.steps.length} steps ·{" "}
            {kit.resources.length} resources
          </span>
        </div>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {kit.name}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
          {kit.description}
        </p>
      </div>

      <div className="mt-8">
        <KitWizard kit={kit} resources={resources} agents={agents} />
      </div>
    </div>
  );
}
