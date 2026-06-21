import { CatalogBrowser } from "@/components/CatalogBrowser";
import { getAgents, getCatalog, getCatalogStats } from "@/lib/content";

export default function BrowsePage() {
  const agents = getAgents();
  const catalog = getCatalog();
  const stats = getCatalogStats();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">Browse</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {stats.resources} resources and {stats.kits} starter kits for Cursor,
          Claude Code, Codex, and other agents. Filter or search, then copy the
          install command.
        </p>
      </div>

      <CatalogBrowser items={catalog} agents={agents} showFilters />
    </div>
  );
}
