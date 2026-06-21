import { z } from "zod";

export const resourceTypeSchema = z.enum([
  "skill",
  "rule",
  "mcp",
  "hook",
  "setting",
]);

export const agentSchema = z.object({
  slug: z.string(),
  name: z.string(),
  icon: z.string(),
  docsUrl: z.string().url(),
  configPaths: z.object({
    skills: z.string(),
    rules: z.string(),
    hooks: z.string(),
    mcp: z.string(),
  }),
});

export const resourceSchema = z.object({
  slug: z.string(),
  name: z.string(),
  type: resourceTypeSchema,
  description: z.string(),
  npxCommand: z.string().nullable().optional(),
  skillsShUrl: z.string().url().nullable().optional(),
  githubUrl: z.string().url().nullable().optional(),
  agents: z.array(z.string()),
  useCases: z.array(z.string()),
  tags: z.array(z.string()).default([]),
  snippet: z.string().nullable().optional(),
  related: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});

export const kitResourceSchema = z.object({
  slug: z.string(),
  step: z.number(),
  note: z.string().optional(),
});

export const kitStepSchema = z.object({
  title: z.string(),
  resourceSlug: z.string(),
});

export const kitSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  useCases: z.array(z.string()),
  agents: z.array(z.string()),
  featured: z.boolean().default(false),
  resources: z.array(kitResourceSchema),
  steps: z.array(kitStepSchema),
});

export type Agent = z.infer<typeof agentSchema>;
export type Resource = z.infer<typeof resourceSchema>;
export type ResourceType = z.infer<typeof resourceTypeSchema>;
export type Kit = z.infer<typeof kitSchema>;

export type CatalogItem =
  | ({ kind: "resource" } & Resource)
  | ({ kind: "kit" } & Kit);

export type FilterState = {
  query: string;
  agents: string[];
  types: ResourceType[];
  useCases: string[];
};

export const USE_CASES = [
  "general",
  "cursor",
  "frontend",
  "design",
  "ui-ux",
  "fullstack",
  "nextjs",
  "backend",
  "api",
  "database",
  "testing",
  "devops",
  "security",
  "docs",
  "python",
] as const;

export const RESOURCE_TYPES: ResourceType[] = [
  "skill",
  "rule",
  "mcp",
  "hook",
  "setting",
];
