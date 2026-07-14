import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import {
  agentSchema,
  blogPostSchema,
  kitSchema,
  resourceSchema,
  type Agent,
  type BlogPost,
  type CatalogItem,
  type Kit,
  type Resource,
} from "./types";

const contentRoot = path.join(process.cwd(), "content");

function readYamlDir<T>(
  dir: string,
  schema: { parse: (data: unknown) => T },
): T[] {
  const fullDir = path.join(contentRoot, dir);

  if (!fs.existsSync(fullDir)) {
    return [];
  }

  return fs
    .readdirSync(fullDir)
    .filter((file) => file.endsWith(".yaml") || file.endsWith(".yml"))
    .map((file) => {
      const filePath = path.join(fullDir, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const parsed = yaml.load(raw);

      try {
        return schema.parse(parsed);
      } catch (error) {
        throw new Error(
          `Invalid YAML in ${filePath}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    });
}

function validateReferences(
  agents: Agent[],
  resources: Resource[],
  kits: Kit[],
): void {
  const agentSlugs = new Set(agents.map((agent) => agent.slug));
  const resourceSlugs = new Set(resources.map((resource) => resource.slug));

  for (const resource of resources) {
    for (const agentSlug of resource.agents) {
      if (!agentSlugs.has(agentSlug)) {
        throw new Error(
          `Resource "${resource.slug}" references unknown agent "${agentSlug}"`,
        );
      }
    }
  }

  for (const kit of kits) {
    for (const agentSlug of kit.agents) {
      if (!agentSlugs.has(agentSlug)) {
        throw new Error(
          `Kit "${kit.slug}" references unknown agent "${agentSlug}"`,
        );
      }
    }

    for (const kitResource of kit.resources) {
      if (!resourceSlugs.has(kitResource.slug)) {
        throw new Error(
          `Kit "${kit.slug}" references unknown resource "${kitResource.slug}"`,
        );
      }
    }

    for (const step of kit.steps) {
      if (!resourceSlugs.has(step.resourceSlug)) {
        throw new Error(
          `Kit "${kit.slug}" step references unknown resource "${step.resourceSlug}"`,
        );
      }
    }
  }

  for (const resource of resources) {
    for (const relatedSlug of resource.related) {
      if (!resourceSlugs.has(relatedSlug)) {
        throw new Error(
          `Resource "${resource.slug}" references unknown related resource "${relatedSlug}"`,
        );
      }
    }
  }
}

export function getAgents(): Agent[] {
  return readYamlDir("agents", agentSchema).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export function getResources(): Resource[] {
  return readYamlDir("resources", resourceSchema).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export function getKits(): Kit[] {
  return readYamlDir("kits", kitSchema).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export function getCatalog(): CatalogItem[] {
  const agents = getAgents();
  const resources = getResources();
  const kits = getKits();

  validateReferences(agents, resources, kits);

  return [
    ...resources.map((resource) => ({ kind: "resource" as const, ...resource })),
    ...kits.map((kit) => ({ kind: "kit" as const, ...kit })),
  ];
}

export function getAgentMap(): Map<string, Agent> {
  return new Map(getAgents().map((agent) => [agent.slug, agent]));
}

export function getResourceBySlug(slug: string): Resource | undefined {
  return getResources().find((resource) => resource.slug === slug);
}

export function getKitBySlug(slug: string): Kit | undefined {
  return getKits().find((kit) => kit.slug === slug);
}

export function getFeaturedResources(): Resource[] {
  return getResources().filter((resource) => resource.featured);
}

export function getFeaturedKits(): Kit[] {
  return getKits().filter((kit) => kit.featured);
}

export function getAllResourceSlugs(): string[] {
  return getResources().map((resource) => resource.slug);
}

export function getResourceCountsByType(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const resource of getResources()) {
    counts[resource.type] = (counts[resource.type] ?? 0) + 1;
  }
  return counts;
}

export type CatalogStats = {
  resources: number;
  kits: number;
  agents: number;
  byType: Record<string, number>;
};

export function getCatalogStats(): CatalogStats {
  return {
    resources: getResources().length,
    kits: getKits().length,
    agents: getAgents().length,
    byType: getResourceCountsByType(),
  };
}

export function getAllKitSlugs(): string[] {
  return getKits().map((kit) => kit.slug);
}

// Blog: newest first by ISO date.
export function getBlogPosts(): BlogPost[] {
  return readYamlDir("blog", blogPostSchema).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getBlogPosts().find((post) => post.slug === slug);
}

export function getFeaturedBlogPosts(): BlogPost[] {
  const posts = getBlogPosts();
  const featured = posts.filter((post) => post.featured);
  return featured.length > 0 ? featured : posts;
}

export function getAllBlogSlugs(): string[] {
  return getBlogPosts().map((post) => post.slug);
}
