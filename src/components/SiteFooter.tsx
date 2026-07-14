import { Github } from "lucide-react";
import { SITE_NAME } from "@/lib/seo";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-muted-foreground">
          <span className="font-mono text-muted-foreground">~/</span>
          Developed by{" "}
          <span className="font-medium text-foreground">yydev</span>
          {" "}for developers.
        </p>

        <div className="flex items-center gap-5 text-muted-foreground">
          <span className="font-mono text-xs">© {year} {SITE_NAME}</span>
          <a
            href="https://github.com/YehanYeshminda/get-started-with-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
            aria-label="GitHub repository"
          >
            <Github className="h-[18px] w-[18px]" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
