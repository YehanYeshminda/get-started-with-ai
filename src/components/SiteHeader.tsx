"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/browse", label: "Browse", match: (path: string) => path === "/browse" },
  { href: "/browse", label: "Kits", match: (path: string) => path.startsWith("/kit") },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
        >
          Get Started With AI
        </Link>

        <nav className="flex items-center gap-5 text-sm" aria-label="Main">
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
      </div>
    </header>
  );
}
