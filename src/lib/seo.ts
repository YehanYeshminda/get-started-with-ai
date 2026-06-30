/**
 * Central SEO configuration.
 *
 * Set NEXT_PUBLIC_SITE_URL in your environment (e.g. your Vercel domain) so
 * canonical URLs, sitemap entries, and Open Graph images resolve to the real
 * production origin. The fallback is only meant for local development.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "Agent Config Hub";

export const SITE_TITLE = "Agent Config Hub — Setup for AI coding agents";

export const SITE_DESCRIPTION =
  "Curated skills, rules, MCP configs, hooks, and starter kits for Cursor, Claude Code, Codex, Windsurf, Cline, and Copilot — copy-paste ready, no guesswork.";

export const SITE_KEYWORDS = [
  "AI coding agents",
  "Cursor",
  "Claude Code",
  "Codex",
  "Windsurf",
  "Cline",
  "GitHub Copilot",
  "MCP",
  "Model Context Protocol",
  "agent skills",
  "agent rules",
  "starter kits",
  "AI developer tools",
];

/** Build an absolute URL from a path like "/browse". */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Normalize a YAML/folded description into a single clean line and clamp it to
 * a search-friendly length (~155 chars) for use in meta descriptions.
 */
export function metaDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) {
    return clean;
  }
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}
