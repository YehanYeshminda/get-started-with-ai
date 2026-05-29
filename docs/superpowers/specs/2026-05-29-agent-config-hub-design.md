# Agent Config Hub — Design Spec

**Project:** Get Started With AI  
**Date:** 2026-05-29  
**Status:** Approved (brainstorming complete)

## Summary

A public, personally curated hub for AI coding agent configuration. Users browse, filter, and copy-paste `npx skills add` commands, config snippets, and starter kit bundles to set up Cursor, Claude Code, Codex, Windsurf, Cline, and other agents quickly.

## Goals

- Single place to discover skills, rules, MCP configs, hooks, and settings for AI coding agents
- One-click copy for install commands and config snippets
- Direct links to [skills.sh](https://www.skills.sh) detail pages
- Curated starter kits that bundle related resources into step-by-step setup flows
- Multi-agent support with per-agent compatibility badges and filtering

## Non-Goals (v1)

- User accounts or authentication
- Community submissions or voting
- Auto-sync from skills.sh API
- Admin UI (content is hand-edited YAML in the repo)
- Analytics

## Requirements

| Dimension | Decision |
|---|---|
| Audience | Personal curation + public site |
| Content | Individual resources + starter kits |
| Agents | Multi-agent (Cursor, Claude Code, Codex, Windsurf, Cline, GitHub Copilot) |
| Data | Static YAML files in repo, version-controlled |
| Browse | Agent + resource type + use case filters + fuzzy search |

## Architecture

**Pattern:** Static-site catalog (Marketplace/Directory)

```
content/                    ← hand-edited YAML
  agents/*.yaml             ← agent metadata
  resources/*.yaml          ← skills, rules, MCP, hooks, settings
  kits/*.yaml               ← starter bundles

src/
  lib/content.ts            ← parse YAML at build time
  lib/search.ts             ← client-side filter + fuzzy search
  components/               ← UI components
  app/                      ← Next.js pages
```

**Build flow:** YAML parsed at `next build` → static HTML/JSON → client-side filtering (no API, no database).

**Content workflow:** Create or edit a YAML file in `content/`, commit, deploy.

## Content Model

### Agent (`content/agents/*.yaml`)

```yaml
slug: cursor
name: Cursor
icon: cursor          # Lucide icon name or static asset path
docsUrl: https://cursor.com/docs
configPaths:
  skills: .agents/skills
  rules: .cursor/rules
  hooks: .cursor/hooks.json
  mcp: .cursor/mcp.json
```

### Resource (`content/resources/*.yaml`)

```yaml
slug: ui-ux-pro-max
name: UI/UX Pro Max
type: skill               # skill | rule | mcp | hook | setting
description: >
  Comprehensive design guide for web and mobile applications.
npxCommand: npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max
skillsShUrl: https://www.skills.sh/nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max
githubUrl: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
agents: [cursor, claude-code, windsurf, cline, codex, copilot]
useCases: [frontend, design, ui-ux]
tags: [design, ui, ux, styling]
snippet: null             # optional config text (rules, MCP JSON, hooks)
related: []               # slugs of related resources
featured: true
```

### Kit (`content/kits/*.yaml`)

```yaml
slug: essential-cursor-setup
name: Essential Cursor Setup
description: >
  Minimum viable agent configuration for Cursor — brainstorming,
  UI design intelligence, and a base rule.
useCases: [general, cursor]
agents: [cursor]
featured: true
resources:
  - slug: brainstorming
    step: 1
    note: Install first — required before creative work
  - slug: ui-ux-pro-max
    step: 2
  - slug: base-cursor-rule
    step: 3
    note: Copy into .cursor/rules/
steps:
  - title: Install brainstorming skill
    resourceSlug: brainstorming
  - title: Install UI/UX Pro Max skill
    resourceSlug: ui-ux-pro-max
  - title: Add base Cursor rule
    resourceSlug: base-cursor-rule
```

## Pages

### Home `/`

- Hero with search bar as primary CTA
- Quick-filter chips: agent, resource type, use case
- Featured starter kits (2–3 cards)
- Popular resources grid

### Directory `/browse`

- Full filterable catalog (resources + kits)
- Sticky filter bar: Agent × Type × Use case (multi-select)
- Instant fuzzy search (Fuse.js)
- Resource cards: name, description, agent badges, type badge, Copy npx button

### Resource Detail `/resource/[slug]`

- Full description and when-to-use guidance
- CopyBlock for `npx` command
- Link to skills.sh detail page (when applicable)
- Agent compatibility matrix
- Related resources
- Optional config snippet preview with copy button

### Starter Kit `/kit/[slug]`

- Kit overview and target use case
- Step-by-step setup wizard with numbered steps and CopyBlocks
- "Copy all commands" button
- Agent selector filters steps to agent-relevant items
- Checklist UI to mark steps complete (client-side only, localStorage)

## User Flow

```
Land on home
  → search or filter by agent / type / use case
  → open resource or kit detail page
  → copy npx command (and optional snippet)
  → optionally open skills.sh for full skill documentation
  → follow kit wizard steps if using a bundle
```

## UI & Visual Design

**Source:** ui-ux-pro-max design system (`Soft UI Evolution` + `Marketplace/Directory` pattern)

### Style

Modern developer-tool aesthetic — subtle depth, strong contrast, accessibility-first.

### Color Tokens (dark default: "Code dark + run green")

| Role | Hex | CSS Variable |
|---|---|---|
| Background | `#0F172A` | `--color-background` |
| Foreground | `#F8FAFC` | `--color-foreground` |
| Primary | `#1E293B` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#334155` | `--color-secondary` |
| Accent/CTA | `#22C55E` | `--color-accent` |
| Muted | `#272F42` | `--color-muted` |
| Border | `#475569` | `--color-border` |
| Destructive | `#EF4444` | `--color-destructive` |

Light mode: same tokens with inverted values via CSS variables.

### Typography

- **Headings:** JetBrains Mono
- **Body:** IBM Plex Sans
- **Code/commands:** JetBrains Mono

Google Fonts import:
```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
```

### Components

| Component | Purpose |
|---|---|
| `ResourceCard` | Grid item with badges, description, copy button |
| `CopyBlock` | Monospace command box with copy + optional external link |
| `FilterBar` | Agent/type/use-case chips, removable active filters |
| `AgentBadge` | Small pill showing agent name + compatibility |
| `KitWizard` | Vertical stepper with copy blocks and checkboxes |
| `SearchInput` | Hero and browse search with instant results |

### UX Requirements

- Lucide icons only (no emoji as icons)
- Minimum 44px touch targets on interactive elements
- `cursor-pointer` on all clickable elements
- Visible focus rings for keyboard navigation
- Hover transitions 150–300ms
- Respect `prefers-reduced-motion`
- Responsive breakpoints: 375px, 768px, 1024px, 1440px
- Text contrast minimum 4.5:1 (WCAG AA)

### Layout

- Max content width: 1280px
- Card grid: 1 col (mobile) → 2 col (tablet) → 3 col (desktop)
- Sticky top nav: logo, Browse, Kits, GitHub link

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Content | YAML + js-yaml |
| Search | Fuse.js |
| Icons | Lucide React |
| Deploy | Vercel |

## Project Structure

```
get-started-with-ai/
├── content/
│   ├── agents/
│   ├── resources/
│   └── kits/
├── docs/
│   └── superpowers/specs/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── browse/page.tsx
│   │   ├── resource/[slug]/page.tsx
│   │   └── kit/[slug]/page.tsx
│   ├── components/
│   └── lib/
├── design-system/
│   └── MASTER.md
├── package.json
└── README.md
```

## Seed Content (Launch)

### Agents (6)

Cursor, Claude Code, Codex, Windsurf, Cline, GitHub Copilot

### Resources (~8–10)

- `ui-ux-pro-max` (skill)
- `brainstorming` (skill)
- `frontend-design` (skill — anthropics/skills)
- `web-design-guidelines` (skill — vercel-labs/agent-skills)
- Sample Cursor rule snippet
- Sample MCP config block
- Sample hooks.json snippet

### Starter Kits (2)

1. **Essential Cursor Setup** — brainstorming + ui-ux-pro-max + base rule
2. **Next.js Full-Stack Agent** — nextjs + shadcn + vercel skills bundle

## Error Handling

- Missing slug on detail pages → 404 with link back to browse
- Invalid YAML at build time → build fails with file path and parse error (fail fast)
- Empty search/filter results → friendly empty state with "clear filters" action
- Copy API failure → fallback to select-all text in CopyBlock

## Testing

- Build-time: validate all YAML against TypeScript schema (Zod)
- Verify all kit `resourceSlug` references resolve to existing resources
- Verify all `agents` slugs resolve to existing agent definitions
- Manual: copy buttons work, filters combine correctly, kit wizard progress persists in localStorage
- Responsive check at 375 / 768 / 1024 / 1440px

## Future (post-v1)

- Auto-sync popular skills from skills.sh
- Community PR workflow for new resources
- "Export my stack" — generate a single install script from selected resources
- Agent-specific install path differences documented per resource
