import Link from "next/link";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import { KitCard, ResourceCard } from "@/components/ResourceCard";
import {
  getAgents,
  getCatalog,
  getCatalogStats,
  getFeaturedKits,
  getFeaturedResources,
} from "@/lib/content";
import { getTypeStyle } from "@/lib/utils";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/seo";
import type { ResourceType } from "@/lib/types";

const typeBlurbs: { type: ResourceType; blurb: string }[] = [
  { type: "skill", blurb: "Reusable agent abilities and workflows" },
  { type: "rule", blurb: "Always-on instructions for consistent output" },
  { type: "mcp", blurb: "Model Context Protocol servers and tools" },
  { type: "hook", blurb: "Run scripts on agent lifecycle events" },
  { type: "setting", blurb: "Drop-in config snippets and presets" },
];

export default function HomePage() {
  const agents = getAgents();
  const catalog = getCatalog();
  const stats = getCatalogStats();
  const featuredResources = getFeaturedResources().slice(0, 6);
  const featuredKits = getFeaturedKits();

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: stats.resources + stats.kits,
      itemListElement: [
        ...featuredKits.map((kit, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: kit.name,
          url: absoluteUrl(`/kit/${kit.slug}`),
        })),
        ...featuredResources.map((resource, index) => ({
          "@type": "ListItem",
          position: featuredKits.length + index + 1,
          name: resource.name,
          url: absoluteUrl(`/resource/${resource.slug}`),
        })),
      ],
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Agent setup, without the guesswork
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Skills, rules, MCP configs, hooks, and starter kits you can copy
              into Cursor, Claude Code, Codex, Windsurf, Cline, or Copilot. Pick
              what you need, grab the command, move on.
            </p>
            <p className="mt-4 font-mono text-sm text-muted-foreground">
              {stats.resources} resources · {stats.kits} kits · {stats.agents}{" "}
              agents
            </p>
          </div>

          <div className="mt-10 max-w-xl">
            <CatalogBrowser
              items={catalog}
              agents={agents}
              showFilters={false}
              compactCards
              searchOnly
            />
          </div>
        </div>
      </section>

      {/* Browse by type */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-sm font-medium">Browse by type</h2>
        <div className="mt-5 grid divide-y divide-border overflow-hidden rounded-lg border border-border sm:grid-cols-2 sm:divide-y-0">
          {typeBlurbs.map(({ type, blurb }, i) => {
            const style = getTypeStyle(type);
            const count = stats.byType[type] ?? 0;
            return (
              <Link
                key={type}
                href="/browse"
                className={`flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface ${
                  i % 2 === 0 ? "sm:border-r sm:border-border" : ""
                }`}
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`}
                  aria-hidden="true"
                />
                <span className="font-medium text-foreground">
                  {style.label}s
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {count}
                </span>
                <span className="ml-auto hidden truncate text-sm text-muted-foreground sm:block">
                  {blurb}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Starter kits */}
      {featuredKits.length > 0 ? (
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-medium">Starter kits</h2>
              <Link
                href="/browse"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View all
              </Link>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredKits.map((kit) => (
                <KitCard key={kit.slug} kit={kit} agents={agents} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Popular resources */}
      {featuredResources.length > 0 ? (
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-medium">Popular resources</h2>
              <Link
                href="/browse"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View all
              </Link>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredResources.map((resource) => (
                <ResourceCard
                  key={resource.slug}
                  resource={resource}
                  agents={agents}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
