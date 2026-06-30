import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import { getAgents, getCatalog, getCatalogStats } from "@/lib/content";

export const metadata: Metadata = {
  title: "Browse the catalog",
  description:
    "Search and filter every skill, rule, MCP config, hook, and starter kit for Cursor, Claude Code, Codex, Windsurf, Cline, and Copilot. Copy the install command and go.",
  alternates: { canonical: "/browse" },
  openGraph: {
    title: "Browse the catalog — Agent Config Hub",
    description:
      "Search and filter every skill, rule, MCP config, hook, and starter kit for your AI coding agent.",
    url: "/browse",
    type: "website",
  },
};

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
