import Link from "next/link";
import { docsUrl, SITE } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-black/5 bg-stacks-beige px-6 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <p className="text-sm text-stacks-black/60">
          © {year} {SITE.name}. Built on Stacks.
        </p>
        <div className="flex flex-wrap gap-6">
          <Link
            href={docsUrl("/")}
            className="text-sm font-medium text-stacks-black/70 transition-colors hover:text-stacks-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stacks-purple"
          >
            Documentation
          </Link>
          <a
            href={SITE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-stacks-black/70 transition-colors hover:text-stacks-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stacks-purple"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
