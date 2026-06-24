import Link from "next/link";
import Image from "next/image";
import { docsUrl, NAV_LINKS, SITE } from "@/lib/content";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-stacks-beige/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stacks-purple">
          <Image src="/logos/stacks.png" alt="" width={28} height={28} aria-hidden className="rounded-md" />
          <span className="text-lg font-semibold tracking-tight">{SITE.name}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => {
            const href = link.href();
            const isExternal = href.startsWith("http");

            if (isExternal) {
              return (
                <a
                  key={link.label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium uppercase tracking-widest text-stacks-black/70 transition-colors hover:text-stacks-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stacks-purple"
                >
                  {link.label}
                </a>
              );
            }

            return (
              <Link
                key={link.label}
                href={href}
                className="text-xs font-medium uppercase tracking-widest text-stacks-black/70 transition-colors hover:text-stacks-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stacks-purple"
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href={SITE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium uppercase tracking-widest text-stacks-black/70 transition-colors hover:text-stacks-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stacks-purple"
          >
            GitHub
          </a>
        </nav>

        <a
          href={docsUrl("/quickstart")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pill btn-pill-orange shrink-0 text-xs uppercase tracking-wide"
        >
          Get started
          <span aria-hidden>→</span>
        </a>
      </div>
    </header>
  );
}
