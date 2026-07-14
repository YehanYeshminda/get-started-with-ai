import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLabel(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Format an ISO date (YYYY-MM-DD) as e.g. "Jul 15, 2026". */
export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Rough reading time in minutes from a list of text fragments (~200 wpm). */
export function readingMinutes(texts: string[]): number {
  const words = texts.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export type TypeStyle = {
  label: string;
  dot: string;
  pill: string;
  text: string;
};

const typeStyles: Record<string, TypeStyle> = {
  skill: {
    label: "Skill",
    dot: "bg-[var(--color-skill)]",
    pill: "border-[color-mix(in_oklab,var(--color-skill)_35%,transparent)] bg-[color-mix(in_oklab,var(--color-skill)_12%,transparent)] text-[var(--color-skill)]",
    text: "text-[var(--color-skill)]",
  },
  rule: {
    label: "Rule",
    dot: "bg-[var(--color-rule)]",
    pill: "border-[color-mix(in_oklab,var(--color-rule)_35%,transparent)] bg-[color-mix(in_oklab,var(--color-rule)_12%,transparent)] text-[var(--color-rule)]",
    text: "text-[var(--color-rule)]",
  },
  mcp: {
    label: "MCP",
    dot: "bg-[var(--color-mcp)]",
    pill: "border-[color-mix(in_oklab,var(--color-mcp)_35%,transparent)] bg-[color-mix(in_oklab,var(--color-mcp)_12%,transparent)] text-[var(--color-mcp)]",
    text: "text-[var(--color-mcp)]",
  },
  hook: {
    label: "Hook",
    dot: "bg-[var(--color-hook)]",
    pill: "border-[color-mix(in_oklab,var(--color-hook)_35%,transparent)] bg-[color-mix(in_oklab,var(--color-hook)_12%,transparent)] text-[var(--color-hook)]",
    text: "text-[var(--color-hook)]",
  },
  setting: {
    label: "Setting",
    dot: "bg-[var(--color-setting)]",
    pill: "border-[color-mix(in_oklab,var(--color-setting)_35%,transparent)] bg-[color-mix(in_oklab,var(--color-setting)_12%,transparent)] text-[var(--color-setting)]",
    text: "text-[var(--color-setting)]",
  },
  kit: {
    label: "Kit",
    dot: "bg-[var(--color-kit)]",
    pill: "border-[color-mix(in_oklab,var(--color-kit)_35%,transparent)] bg-[color-mix(in_oklab,var(--color-kit)_12%,transparent)] text-[var(--color-kit)]",
    text: "text-[var(--color-kit)]",
  },
};

export function getTypeStyle(type: string): TypeStyle {
  return (
    typeStyles[type] ?? {
      label: formatLabel(type),
      dot: "bg-muted-foreground",
      pill: "border-border text-muted-foreground",
      text: "text-muted-foreground",
    }
  );
}
