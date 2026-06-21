"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { CopyBlock } from "@/components/CopyBlock";
import {
  getAllCommandsForKit,
  getCopyTextForResource,
} from "@/lib/search";
import type { Agent, Kit, Resource } from "@/lib/types";
import { cn, formatLabel } from "@/lib/utils";

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
    <div className="space-y-8">
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {completedSteps.length} of {visibleSteps.length} steps done (
            {progress}%)
          </p>
          <button
          type="button"
          onClick={copyAllCommands}
          disabled={!allCommands}
          className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
            {copiedAll ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" />
                Copied all
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" aria-hidden="true" />
                Copy all commands
              </>
            )}
          </button>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-[var(--color-kit)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {kit.agents.length > 1 ? (
        <div>
          <p className="mb-2 text-xs text-muted-foreground">Agent</p>
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
                    "cursor-pointer rounded-md border px-2.5 py-1 text-xs transition-colors",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {agent?.name ?? formatLabel(slug)}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <ol className="space-y-8">
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

          return (
            <li key={stepKey} className="border-b border-border pb-8 last:border-b-0">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-1 text-base font-medium">{step.title}</h3>
                  {kitResource?.note ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {kitResource.note}
                    </p>
                  ) : null}
                </div>

                <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={isComplete}
                    onChange={() => toggleStep(stepKey)}
                    className="h-4 w-4 rounded border-border"
                  />
                  Done
                </label>
              </div>

              {copyText ? (
                <CopyBlock
                  text={copyText}
                  externalUrl={resource.skillsShUrl}
                />
              ) : resource.snippet ? (
                <CopyBlock text={resource.snippet} label="Snippet" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
