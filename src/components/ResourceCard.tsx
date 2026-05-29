"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { KitBadge, MetaLine } from "@/components/AgentBadge";
import type { Agent, Kit, Resource } from "@/lib/types";
import { getCopyTextForResource } from "@/lib/search";
import { formatLabel } from "@/lib/utils";

type ResourceCardProps = {
  resource: Resource;
  agents: Agent[];
  compact?: boolean;
};

function CompactCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          Copy command
        </>
      )}
    </button>
  );
}

export function ResourceCard({
  resource,
  agents,
  compact = false,
}: ResourceCardProps) {
  const copyText = getCopyTextForResource(resource);
  const agentMap = new Map(agents.map((agent) => [agent.slug, agent]));
  const agentNames = resource.agents
    .slice(0, 3)
    .map((slug) => agentMap.get(slug)?.name ?? formatLabel(slug));

  return (
    <article className="group border-b border-border py-5 last:border-b-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <MetaLine
            items={[
              typeLabelsSafe(resource.type),
              ...agentNames,
              ...(resource.agents.length > 3
                ? [`+${resource.agents.length - 3}`]
                : []),
            ]}
          />
          <h3 className="mt-1 text-base font-medium text-foreground">
            <Link
              href={`/resource/${resource.slug}`}
              className="cursor-pointer hover:underline"
            >
              {resource.name}
            </Link>
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {compact && resource.description.length > 160
              ? `${resource.description.slice(0, 160).trim()}…`
              : resource.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4 text-sm">
          {copyText && resource.npxCommand ? (
            <CompactCopyButton text={resource.npxCommand} />
          ) : null}
          {resource.skillsShUrl ? (
            <a
              href={resource.skillsShUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
            >
              skills.sh
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function typeLabelsSafe(type: Resource["type"]) {
  const labels: Record<Resource["type"], string> = {
    skill: "Skill",
    rule: "Rule",
    mcp: "MCP",
    hook: "Hook",
    setting: "Setting",
  };
  return labels[type];
}

type KitCardProps = {
  kit: Kit;
  agents: Agent[];
  list?: boolean;
};

export function KitCard({ kit, agents, list = false }: KitCardProps) {
  const agentMap = new Map(agents.map((agent) => [agent.slug, agent]));
  const agentNames = kit.agents.map(
    (slug) => agentMap.get(slug)?.name ?? formatLabel(slug),
  );

  if (list) {
    return (
      <article className="border-b border-border py-5 last:border-b-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <MetaLine items={["Kit", ...agentNames, `${kit.steps.length} steps`]} />
            <h3 className="mt-1 text-base font-medium">
              <Link href={`/kit/${kit.slug}`} className="hover:underline">
                {kit.name}
              </Link>
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {kit.description}
            </p>
          </div>
          <Link
            href={`/kit/${kit.slug}`}
            className="shrink-0 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View kit
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-surface p-5">
      <KitBadge />
      <h3 className="mt-3 text-base font-medium">
        <Link href={`/kit/${kit.slug}`} className="hover:underline">
          {kit.name}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {kit.description}
      </p>
      <p className="mt-4 text-xs text-muted-foreground">
        {agentNames.join(", ")} · {kit.steps.length} steps
      </p>
      <Link
        href={`/kit/${kit.slug}`}
        className="mt-4 inline-block text-sm text-foreground underline-offset-4 hover:underline"
      >
        Open kit
      </Link>
    </article>
  );
}
