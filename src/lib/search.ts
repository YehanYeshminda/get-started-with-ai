import Fuse from "fuse.js";
import {
  type CatalogItem,
  type FilterState,
  type Kit,
  type Resource,
  type ResourceType,
} from "./types";

function matchesAgents(item: CatalogItem, agents: string[]): boolean {
  if (agents.length === 0) {
    return true;
  }

  return agents.some((agent) => item.agents.includes(agent));
}

function matchesUseCases(item: CatalogItem, useCases: string[]): boolean {
  if (useCases.length === 0) {
    return true;
  }

  return useCases.some((useCase) => item.useCases.includes(useCase));
}

function matchesTypes(item: CatalogItem, types: ResourceType[]): boolean {
  if (types.length === 0) {
    return true;
  }

  if (item.kind === "kit") {
    return types.length === 0;
  }

  return types.includes(item.type);
}

export function filterCatalog(
  items: CatalogItem[],
  filters: FilterState,
): CatalogItem[] {
  const { query, agents, types, useCases } = filters;

  let filtered = items.filter(
    (item) =>
      matchesAgents(item, agents) &&
      matchesUseCases(item, useCases) &&
      matchesTypes(item, types),
  );

  if (query.trim()) {
    const fuse = new Fuse(filtered, {
      keys: [
        { name: "name", weight: 0.4 },
        { name: "description", weight: 0.3 },
        { name: "tags", weight: 0.2 },
        { name: "useCases", weight: 0.1 },
      ],
      threshold: 0.35,
      includeScore: true,
    });

    filtered = fuse.search(query.trim()).map((result) => result.item);
  }

  return filtered;
}

export function getCopyTextForResource(resource: Resource): string | null {
  if (resource.npxCommand) {
    return resource.npxCommand;
  }

  if (resource.snippet) {
    return resource.snippet;
  }

  return null;
}

export function getAllCommandsForKit(
  kit: Kit,
  resources: Resource[],
  agentSlug?: string,
): string {
  const resourceMap = new Map(resources.map((resource) => [resource.slug, resource]));

  return kit.steps
    .map((step) => resourceMap.get(step.resourceSlug))
    .filter((resource): resource is Resource => Boolean(resource))
    .filter((resource) =>
      agentSlug ? resource.agents.includes(agentSlug) : true,
    )
    .map((resource) => getCopyTextForResource(resource))
    .filter((text): text is string => Boolean(text))
    .join("\n");
}
