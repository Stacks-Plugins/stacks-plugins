import type { ResourceColor } from "@/lib/content";
import { RESOURCE_COLORS } from "@/lib/content";

type ResourceItemProps = {
  title: string;
  description: string;
  docsHref: string;
  color: ResourceColor;
  githubHref?: string;
  githubLabel?: string;
};

export function ResourceItem({
  title,
  description,
  docsHref,
  color,
  githubHref,
  githubLabel,
}: ResourceItemProps) {
  const bgColor = RESOURCE_COLORS[color];

  return (
    <div className="group flex gap-5 rounded-2xl p-4 transition-colors hover:bg-black/[0.03]">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-stacks-black"
        style={{ backgroundColor: bgColor }}
        aria-hidden
      >
        <span className="font-mono text-lg font-bold opacity-80">{title.charAt(0)}</span>
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <a
          href={docsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stacks-purple"
        >
          <h3 className="font-mono text-base font-semibold uppercase tracking-tight text-stacks-black group-hover:text-stacks-purple lg:text-lg">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-stacks-black/65">{description}</p>
        </a>
        {githubHref ? (
          <a
            href={githubHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-stacks-black/50 underline decoration-stacks-black/20 underline-offset-2 transition-colors hover:text-stacks-purple hover:decoration-stacks-purple/40"
          >
            {githubLabel ?? "View on GitHub"}
            <span aria-hidden>↗</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
