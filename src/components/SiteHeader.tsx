"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/browse", label: "Browse", match: (path: string) => path === "/browse" || path.startsWith("/resource") },
  { href: "/browse", label: "Kits", match: (path: string) => path.startsWith("/kit") },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3.5 sm:px-6">
        <Link
          href="/"
          className="text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
        >
          <span className="font-mono text-muted-foreground">~/</span>agent-config
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <nav className="flex items-center gap-5" aria-label="Main">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "transition-colors",
                  item.match(pathname)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="h-[18px] w-[18px]" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
