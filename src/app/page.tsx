import Link from "next/link";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import { KitCard, ResourceCard } from "@/components/ResourceCard";
import {
  getAgents,
  getCatalog,
  getFeaturedKits,
  getFeaturedResources,
} from "@/lib/content";

export default function HomePage() {
  const agents = getAgents();
  const catalog = getCatalog();
  const featuredResources = getFeaturedResources().slice(0, 6);
  const featuredKits = getFeaturedKits();

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-xl">
            <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
              Agent setup, in one place
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Skills, rules, MCP configs, and starter kits you can copy and
              paste into Cursor, Claude Code, Codex, Windsurf, Cline, or
              Copilot.
            </p>
            <Link
              href="/browse"
              className="mt-6 inline-block text-sm text-foreground underline-offset-4 hover:underline"
            >
              Browse the full catalog
            </Link>
          </div>

          <div className="mt-12 max-w-xl">
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

      {featuredKits.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-sm font-medium">Starter kits</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {featuredKits.map((kit) => (
              <KitCard key={kit.slug} kit={kit} agents={agents} />
            ))}
          </div>
        </section>
      ) : null}

      {featuredResources.length > 0 ? (
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h2 className="text-sm font-medium">Popular resources</h2>
            <div className="mt-6 divide-y divide-border rounded-lg border border-border px-4">
              {featuredResources.map((resource) => (
                <ResourceCard
                  key={resource.slug}
                  resource={resource}
                  agents={agents}
                  compact
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
