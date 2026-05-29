import Link from "next/link";
import { notFound } from "next/navigation";
import { MetaLine } from "@/components/AgentBadge";
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
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link
        href="/browse"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Browse
      </Link>

      <MetaLine
        items={["Kit", ...agentNames, `${kit.steps.length} steps`]}
        className="mt-8"
      />

      <h1 className="mt-2 text-2xl font-medium">{kit.name}</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {kit.description}
      </p>

      <div className="mt-10">
        <KitWizard kit={kit} resources={resources} agents={agents} />
      </div>
    </div>
  );
}
