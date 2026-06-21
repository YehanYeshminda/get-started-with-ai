"use client";

import { useMemo, useState } from "react";
import { FilterBar, SearchInput, SectionHeader } from "@/components/FilterBar";
import { KitCard, ResourceCard } from "@/components/ResourceCard";
import { filterCatalog } from "@/lib/search";
import type {
  Agent,
  CatalogItem,
  FilterState,
  ResourceType,
} from "@/lib/types";

type CatalogBrowserProps = {
  items: CatalogItem[];
  agents: Agent[];
  initialQuery?: string;
  showFilters?: boolean;
  compactCards?: boolean;
  searchOnly?: boolean;
};

export function CatalogBrowser({
  items,
  agents,
  initialQuery = "",
  showFilters = true,
  compactCards = false,
  searchOnly = false,
}: CatalogBrowserProps) {
  const [filters, setFilters] = useState<FilterState>({
    query: initialQuery,
    agents: [],
    types: [],
    useCases: [],
  });

  const filteredItems = useMemo(
    () => filterCatalog(items, filters),
    [items, filters],
  );

  const resources = filteredItems.filter((item) => item.kind === "resource");
  const kits = filteredItems.filter((item) => item.kind === "kit");

  function toggleValue<T extends string>(
    current: T[],
    value: T,
  ): T[] {
    return current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
  }

  const showResults = !searchOnly || filters.query.trim().length > 0;

  let resultsContent = null;

  if (showResults) {
    if (filteredItems.length === 0) {
      resultsContent = (
        <div className="py-16 text-center">
          <p className="text-sm text-foreground">No matches</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search or clear your filters.
          </p>
          <button
            type="button"
            onClick={() =>
              setFilters({
                query: "",
                agents: [],
                types: [],
                useCases: [],
              })
            }
            className="mt-4 cursor-pointer text-sm text-foreground underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        </div>
      );
    } else if (compactCards) {
      resultsContent = (
        <div className="space-y-10">
          {kits.length > 0 ? (
            <section>
              <SectionHeader title="Starter kits" count={kits.length} />
              <div className="divide-y divide-border rounded-lg border border-border px-4">
                {kits.map((kit) => (
                  <KitCard key={kit.slug} kit={kit} agents={agents} list />
                ))}
              </div>
            </section>
          ) : null}

          {resources.length > 0 ? (
            <section>
              <SectionHeader title="Resources" count={resources.length} />
              <div className="divide-y divide-border rounded-lg border border-border px-4">
                {resources.map((resource) => (
                  <ResourceCard
                    key={resource.slug}
                    resource={resource}
                    agents={agents}
                    compact
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      );
    } else {
      resultsContent = (
        <div className="space-y-12">
          {kits.length > 0 ? (
            <section>
              <SectionHeader title="Starter kits" count={kits.length} />
              <div className="grid gap-4 sm:grid-cols-2">
                {kits.map((kit) => (
                  <KitCard key={kit.slug} kit={kit} agents={agents} />
                ))}
              </div>
            </section>
          ) : null}

          {resources.length > 0 ? (
            <section>
              <SectionHeader title="Resources" count={resources.length} />
              <div className="grid gap-4 sm:grid-cols-2">
                {resources.map((resource) => (
                  <ResourceCard
                    key={resource.slug}
                    resource={resource}
                    agents={agents}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      );
    }
  }

  if (!showFilters) {
    return (
      <div className="space-y-6">
        <SearchInput
          value={filters.query}
          onChange={(query) => setFilters((current) => ({ ...current, query }))}
        />
        {resultsContent}
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <SearchInput
          value={filters.query}
          onChange={(query) => setFilters((current) => ({ ...current, query }))}
          className="mb-6 lg:hidden"
        />
        <FilterBar
          agents={agents}
          selectedAgents={filters.agents}
          selectedTypes={filters.types}
          selectedUseCases={filters.useCases}
          onToggleAgent={(slug) =>
            setFilters((current) => ({
              ...current,
              agents: toggleValue(current.agents, slug),
            }))
          }
          onToggleType={(type) =>
            setFilters((current) => ({
              ...current,
              types: toggleValue<ResourceType>(current.types, type),
            }))
          }
          onToggleUseCase={(useCase) =>
            setFilters((current) => ({
              ...current,
              useCases: toggleValue(current.useCases, useCase),
            }))
          }
          onClear={() =>
            setFilters({
              query: "",
              agents: [],
              types: [],
              useCases: [],
            })
          }
          resultCount={filteredItems.length}
          totalCount={items.length}
        />
      </aside>

      <div>
        <SearchInput
          value={filters.query}
          onChange={(query) => setFilters((current) => ({ ...current, query }))}
          className="mb-8 hidden lg:block"
        />
        {resultsContent}
      </div>
    </div>
  );
}
