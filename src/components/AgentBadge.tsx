import { cn, formatLabel, getTypeStyle } from "@/lib/utils";
import type { ResourceType } from "@/lib/types";

type AgentBadgeProps = {
  slug: string;
  name?: string;
  className?: string;
};

export function AgentBadge({ slug, name, className }: AgentBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-surface px-2 py-0.5 text-xs text-muted-foreground",
        className,
      )}
    >
      {name ?? formatLabel(slug)}
    </span>
  );
}

type TypeBadgeProps = {
  type: ResourceType | string;
  className?: string;
};

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const style = getTypeStyle(type);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        className,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", style.dot)} aria-hidden="true" />
      {style.label}
    </span>
  );
}

type KitBadgeProps = {
  className?: string;
};

export function KitBadge({ className }: KitBadgeProps) {
  return <TypeBadge type="kit" className={className} />;
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

export function TagList({
  tags,
  className,
  max = 4,
}: {
  tags: string[];
  className?: string;
  max?: number;
}) {
  if (tags.length === 0) return null;
  const shown = tags.slice(0, max);
  const extra = tags.length - shown.length;

  return (
    <p className={cn("font-mono text-xs text-muted-foreground", className)}>
      {shown.map((tag) => `#${tag}`).join("  ")}
      {extra > 0 ? `  +${extra}` : ""}
    </p>
  );
}
