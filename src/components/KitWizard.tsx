"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { CopyBlock } from "@/components/CopyBlock";
import {
  getAllCommandsForKit,
  getCopyTextForResource,
} from "@/lib/search";
import type { Agent, Kit, Resource } from "@/lib/types";
import { cn, formatLabel, getTypeStyle } from "@/lib/utils";

type KitWizardProps = {
  kit: Kit;
  resources: Resource[];
  agents: Agent[];
};

export function KitWizard({ kit, resources, agents }: KitWizardProps) {
  const [selectedAgent, setSelectedAgent] = useState(kit.agents[0] ?? "");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);

  const resourceMap = useMemo(
    () => new Map(resources.map((resource) => [resource.slug, resource])),
    [resources],
  );

  const visibleSteps = kit.steps.filter((step) => {
    const resource = resourceMap.get(step.resourceSlug);
    if (!resource) {
      return false;
    }

    return selectedAgent ? resource.agents.includes(selectedAgent) : true;
  });

  const allCommands = getAllCommandsForKit(kit, resources, selectedAgent);

  useEffect(() => {
    const stored = window.localStorage.getItem(`kit-progress:${kit.slug}`);
    if (stored) {
      setCompletedSteps(JSON.parse(stored) as string[]);
    }
  }, [kit.slug]);

  useEffect(() => {
    window.localStorage.setItem(
      `kit-progress:${kit.slug}`,
      JSON.stringify(completedSteps),
    );
  }, [completedSteps, kit.slug]);

  async function copyAllCommands() {
    if (!allCommands) {
      return;
    }

    await navigator.clipboard.writeText(allCommands);
    setCopiedAll(true);
    window.setTimeout(() => setCopiedAll(false), 2000);
  }

  function toggleStep(stepKey: string) {
    setCompletedSteps((current) =>
      current.includes(stepKey)
        ? current.filter((item) => item !== stepKey)
        : [...current, stepKey],
    );
  }

  const progress =
    visibleSteps.length === 0
      ? 0
      : Math.round((completedSteps.length / visibleSteps.length) * 100);

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12">
      {/* Sidebar */}
      <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-medium text-foreground">Progress</p>
            <p className="font-mono text-sm text-muted-foreground">
              {completedSteps.length}/{visibleSteps.length}
            </p>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-[var(--color-kit)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <button
            type="button"
            onClick={copyAllCommands}
            disabled={!allCommands}
            className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-foreground transition-colors hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copiedAll ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" />
                Copied all commands
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" aria-hidden="true" />
                Copy all commands
              </>
            )}
          </button>
        </div>

        {kit.agents.length > 1 ? (
          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Agent
            </p>
            <div className="flex flex-wrap gap-2">
              {kit.agents.map((slug) => {
                const agent = agents.find((item) => item.slug === slug);
                const active = selectedAgent === slug;

                return (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => setSelectedAgent(slug)}
                    className={cn(
                      "cursor-pointer rounded-md border px-3 py-1.5 text-xs transition-colors",
                      active
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
                    )}
                  >
                    {agent?.name ?? formatLabel(slug)}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
            What&apos;s included
          </p>
          <ul className="divide-y divide-border rounded-xl border border-border">
            {kit.resources.map((kitResource) => {
              const resource = resourceMap.get(kitResource.slug);
              if (!resource) {
                return null;
              }
              const style = getTypeStyle(resource.type);
              return (
                <li key={kitResource.slug}>
                  <Link
                    href={`/resource/${resource.slug}`}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-secondary/40"
                  >
                    <span
                      className={cn("h-2 w-2 shrink-0 rounded-full", style.dot)}
                      aria-hidden="true"
                    />
                    <span className="truncate text-foreground">
                      {resource.name}
                    </span>
                    <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                      {style.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Steps timeline */}
      <ol className="relative ml-3 border-l border-border">
        {visibleSteps.map((step, index) => {
          const resource = resourceMap.get(step.resourceSlug);
          if (!resource) {
            return null;
          }

          const copyText = getCopyTextForResource(resource);
          const stepKey = `${step.resourceSlug}-${index}`;
          const isComplete = completedSteps.includes(stepKey);
          const kitResource = kit.resources.find(
            (item) => item.slug === step.resourceSlug,
          );
          const style = getTypeStyle(resource.type);

          return (
            <li key={stepKey} className="relative pb-10 pl-8 last:pb-0">
              <span
                className={cn(
                  "absolute -left-[15px] top-0 flex h-7 w-7 items-center justify-center rounded-full border bg-background text-xs font-medium transition-colors",
                  isComplete
                    ? "border-[var(--color-kit)] text-[var(--color-kit)]"
                    : "border-border-strong text-muted-foreground",
                )}
                aria-hidden="true"
              >
                {isComplete ? <Check className="h-4 w-4" /> : index + 1}
              </span>

              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn("h-2 w-2 rounded-full", style.dot)}
                      aria-hidden="true"
                    />
                    <span className="text-xs text-muted-foreground">
                      {style.label}
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-medium text-foreground">
                    {step.title}
                  </h3>
                  {kitResource?.note ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {kitResource.note}
                    </p>
                  ) : null}
                </div>

                <label className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={isComplete}
                    onChange={() => toggleStep(stepKey)}
                    className="h-3.5 w-3.5 rounded border-border"
                  />
                  {isComplete ? "Done" : "Mark done"}
                </label>
              </div>

              {copyText ? (
                <div className="mt-4">
                  <CopyBlock text={copyText} externalUrl={resource.skillsShUrl} />
                </div>
              ) : resource.snippet ? (
                <div className="mt-4">
                  <CopyBlock text={resource.snippet} label="Snippet" />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
