import type { BlogBlock } from "@/lib/types";

type BlogBodyProps = {
  blocks: BlogBlock[];
};

export function BlogBody({ blocks }: BlogBodyProps) {
  return (
    <div className="mt-10 flex flex-col gap-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={index}
                className="mt-4 text-lg font-semibold tracking-tight text-foreground"
              >
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p
                key={index}
                className="text-base leading-relaxed text-muted-foreground"
              >
                {block.text}
              </p>
            );
          case "list":
            return (
              <ul
                key={index}
                className="flex flex-col gap-2 pl-1 text-base leading-relaxed text-muted-foreground"
              >
                {block.items.map((item, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-skill)]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <aside
                key={index}
                className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-muted-foreground"
              >
                {block.text}
              </aside>
            );
          case "code":
            return (
              <pre
                key={index}
                className="overflow-x-auto rounded-lg border border-border bg-surface p-4"
              >
                <code className="font-mono text-sm text-foreground">
                  {block.code}
                </code>
              </pre>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
