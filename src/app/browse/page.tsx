import { CatalogBrowser } from "@/components/CatalogBrowser";
import { getAgents, getCatalog, getResources, getKits } from "@/lib/content";

export default function BrowsePage() {
  const agents = getAgents();
  const catalog = getCatalog();
  const resourceCount = getResources().length;
  const kitCount = getKits().length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-10 max-w-xl">
        <h1 className="text-2xl font-medium tracking-tight">Browse</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {resourceCount} resources and {kitCount} starter kits for Cursor,
          Claude Code, Codex, and other agents. Filter or search, then copy the
          install command.
        </p>
      </div>

      <CatalogBrowser items={catalog} agents={agents} showFilters />
    </div>
  );
}
