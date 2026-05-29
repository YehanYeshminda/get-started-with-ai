"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type CopyBlockProps = {
  text: string;
  label?: string;
  externalUrl?: string | null;
  externalLabel?: string;
  className?: string;
};

export function CopyBlock({
  text,
  label,
  externalUrl,
  externalLabel = "skills.sh",
  className,
}: CopyBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <p className="text-sm text-muted-foreground">{label}</p>
      ) : null}
      <div className="overflow-hidden rounded-md border border-border bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
          <div className="flex gap-3">
            {externalUrl ? (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {externalLabel}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            aria-label={copied ? "Copied" : "Copy to clipboard"}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                Copy
              </>
            )}
          </button>
        </div>
        <pre className="overflow-x-auto px-3 py-3 font-mono text-sm leading-relaxed text-foreground">
          <code>{text}</code>
        </pre>
      </div>
    </div>
  );
}
