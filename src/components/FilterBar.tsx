"use client";

import { Search, X } from "lucide-react";
import { cn, formatLabel } from "@/lib/utils";
import type { Agent, ResourceType } from "@/lib/types";
import { RESOURCE_TYPES, USE_CASES } from "@/lib/types";

type FilterBarProps = {
  agents: Agent[];
  selectedAgents: string[];
  selectedTypes: ResourceType[];
  selectedUseCases: string[];
  onToggleAgent: (slug: string) => void;
  onToggleType: (type: ResourceType) => void;
  onToggleUseCase: (useCase: string) => void;
  onClear: () => void;
  resultCount: number;
  totalCount: number;
  className?: string;
};

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-md border px-2.5 py-1 text-xs transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-xs text-muted-foreground">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function FilterBar({
  agents,
  selectedAgents,
  selectedTypes,
  selectedUseCases,
  onToggleAgent,
  onToggleType,
  onToggleUseCase,
  onClear,
  resultCount,
  totalCount,
  className,
}: FilterBarProps) {
  const hasFilters =
    selectedAgents.length > 0 ||
    selectedTypes.length > 0 ||
    selectedUseCases.length > 0;

  return (
    <div className={cn("space-y-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {resultCount} of {totalCount}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex cursor-pointer items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-3 w-3" aria-hidden="true" />
            Clear
          </button>
        ) : null}
      </div>

      <FilterGroup title="Agent">
        {agents.map((agent) => (
          <FilterChip
            key={agent.slug}
            active={selectedAgents.includes(agent.slug)}
            label={agent.name}
            onClick={() => onToggleAgent(agent.slug)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Type">
        {RESOURCE_TYPES.map((type) => (
          <FilterChip
            key={type}
            active={selectedTypes.includes(type)}
            label={formatLabel(type)}
            onClick={() => onToggleType(type)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Use case">
        {USE_CASES.map((useCase) => (
          <FilterChip
            key={useCase}
            active={selectedUseCases.includes(useCase)}
            label={formatLabel(useCase)}
            onClick={() => onToggleUseCase(useCase)}
          />
        ))}
      </FilterGroup>
    </div>
  );
}

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder = "Search skills, rules, MCP configs, kits…",
  className,
}: SearchInputProps) {
  return (
    <label className={cn("relative block", className)}>
      <span className="sr-only">Search catalog</span>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-border-strong"
      />
    </label>
  );
}

export function SectionHeader({
  title,
  count,
}: {
  title: string;
  count: number;
}) {
  return (
    <h2 className="mb-4 text-sm font-medium text-foreground">
      {title}
      <span className="ml-2 font-normal text-muted-foreground">({count})</span>
    </h2>
  );
}
