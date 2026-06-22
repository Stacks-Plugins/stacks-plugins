import type { ResourceColor } from "@/lib/content";
import { RESOURCE_COLORS } from "@/lib/content";

type ResourceItemProps = {
  title: string;
  description: string;
  href: string;
  color: ResourceColor;
  external?: boolean;
};

export function ResourceItem({ title, description, href, color, external }: ResourceItemProps) {
  const bgColor = RESOURCE_COLORS[color];

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex gap-5 rounded-2xl p-4 transition-colors hover:bg-black/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stacks-purple"
    >
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-stacks-black"
        style={{ backgroundColor: bgColor }}
        aria-hidden
      >
        <span className="font-mono text-lg font-bold opacity-80">
          {title.charAt(0)}
        </span>
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <h3 className="font-mono text-base font-semibold uppercase tracking-tight text-stacks-black group-hover:text-stacks-purple lg:text-lg">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-stacks-black/65">{description}</p>
      </div>
    </a>
  );
}
