import { cn, formatLabel } from "@/lib/utils";
import type { ResourceType } from "@/lib/types";

const typeLabels: Record<ResourceType, string> = {
  skill: "Skill",
  rule: "Rule",
  mcp: "MCP",
  hook: "Hook",
  setting: "Setting",
};

type AgentBadgeProps = {
  slug: string;
  name?: string;
  className?: string;
};

export function AgentBadge({ slug, name, className }: AgentBadgeProps) {
  return (
    <span className={cn("text-xs text-muted-foreground", className)}>
      {name ?? formatLabel(slug)}
    </span>
  );
}

type TypeBadgeProps = {
  type: ResourceType | string;
  className?: string;
};

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const label =
    type in typeLabels ? typeLabels[type as ResourceType] : formatLabel(type);

  return (
    <span
      className={cn(
        "text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
}

type KitBadgeProps = {
  className?: string;
};

export function KitBadge({ className }: KitBadgeProps) {
  return (
    <span className={cn("text-xs font-medium text-muted-foreground", className)}>
      Kit
    </span>
  );
}

export function MetaLine({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      {items.join(" · ")}
    </p>
  );
}
