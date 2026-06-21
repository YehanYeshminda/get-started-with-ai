"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, Layers } from "lucide-react";
import { KitBadge, TagList, TypeBadge } from "@/components/AgentBadge";
import type { Agent, Kit, Resource } from "@/lib/types";
import { getCopyTextForResource } from "@/lib/search";
import { cn, formatLabel } from "@/lib/utils";

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
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs transition-colors",
        copied
          ? "text-[var(--color-mcp)]"
          : "text-muted-foreground hover:border-border-strong hover:text-foreground",
      )}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          Copy
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

  if (compact) {
    return (
      <article className="group flex items-center gap-4 border-b border-border py-4 last:border-b-0">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <TypeBadge type={resource.type} />
            <h3 className="truncate text-sm font-medium text-foreground">
              <Link
                href={`/resource/${resource.slug}`}
                className="cursor-pointer hover:underline"
              >
                {resource.name}
              </Link>
            </h3>
          </div>
          <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {resource.description}
          </p>
        </div>
        {copyText && resource.npxCommand ? (
          <CompactCopyButton text={resource.npxCommand} />
        ) : (
          <Link
            href={`/resource/${resource.slug}`}
            className="shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
            aria-label={`Open ${resource.name}`}
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-strong">
      <TypeBadge type={resource.type} />

      <h3 className="mt-2.5 text-base font-medium text-foreground">
        <Link
          href={`/resource/${resource.slug}`}
          className="cursor-pointer hover:underline"
        >
          {resource.name}
        </Link>
      </h3>

      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
        {resource.description.length > 150
          ? `${resource.description.slice(0, 150).trim()}…`
          : resource.description}
      </p>

      <TagList tags={resource.tags} className="mt-4" max={3} />

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
        <p className="truncate text-xs text-muted-foreground">
          {agentNames.join(", ")}
          {resource.agents.length > 3 ? ` +${resource.agents.length - 3}` : ""}
        </p>
        {copyText && resource.npxCommand ? (
          <CompactCopyButton text={resource.npxCommand} />
        ) : (
          <Link
            href={`/resource/${resource.slug}`}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Details
          </Link>
        )}
      </div>
    </article>
  );
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
      <article className="group flex items-center gap-4 border-b border-border py-4 last:border-b-0">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <KitBadge />
            <h3 className="truncate text-sm font-medium">
              <Link href={`/kit/${kit.slug}`} className="hover:underline">
                {kit.name}
              </Link>
            </h3>
            <span className="text-xs text-muted-foreground">
              {kit.steps.length} steps
            </span>
          </div>
          <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {kit.description}
          </p>
        </div>
        <Link
          href={`/kit/${kit.slug}`}
          className="shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
          aria-label={`Open ${kit.name}`}
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-strong">
      <div className="flex items-center justify-between">
        <KitBadge />
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Layers className="h-3.5 w-3.5" aria-hidden="true" />
          {kit.resources.length} resources
        </span>
      </div>

      <h3 className="mt-2.5 text-base font-medium">
        <Link href={`/kit/${kit.slug}`} className="hover:underline">
          <span className="absolute inset-0" aria-hidden="true" />
          {kit.name}
        </Link>
      </h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
        {kit.description}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
        <p className="truncate text-xs text-muted-foreground">
          {agentNames.join(", ")} · {kit.steps.length} steps
        </p>
        <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground">
          Open →
        </span>
      </div>
    </article>
  );
}
