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

type KitPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllKitSlugs().map((slug) => ({ slug }));
}

export default async function KitPage({ params }: KitPageProps) {
  const { slug } = await params;
  const kit = getKitBySlug(slug);

  if (!kit) {
    notFound();
  }

  const agents = getAgents();
  const resources = getResources();
  const agentMap = new Map(agents.map((agent) => [agent.slug, agent]));
  const agentNames = kit.agents.map(
    (agentSlug) => agentMap.get(agentSlug)?.name ?? formatLabel(agentSlug),
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link
        href="/browse"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Browse
      </Link>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <KitBadge />
        <span className="text-xs text-muted-foreground">
          {agentNames.join(", ")} · {kit.steps.length} steps ·{" "}
          {kit.resources.length} resources
        </span>
      </div>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{kit.name}</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        {kit.description}
      </p>

      <div className="mt-10">
        <KitWizard kit={kit} resources={resources} agents={agents} />
      </div>
    </div>
  );
}
