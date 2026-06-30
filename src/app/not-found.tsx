import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-start justify-center px-4 py-16">
      <p className="text-sm text-muted-foreground">404</p>
      <h1 className="mt-2 text-xl font-medium">Not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        That resource or kit isn&apos;t in the catalog.
      </p>
      <Link
        href="/browse"
        className="mt-6 text-sm underline-offset-4 hover:underline"
      >
        Back to browse
      </Link>
    </div>
  );
}
