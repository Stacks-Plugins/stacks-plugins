import type { FrameworkIcon } from "@/lib/content";

function FrameworkIconSvg({ icon }: { icon: FrameworkIcon }) {
  switch (icon) {
    case "code":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "brackets":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M8 4H6a2 2 0 00-2 2v4a2 2 0 002 2h2M16 4h2a2 2 0 012 2v4a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-4a2 2 0 012-2h2M16 20h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "python":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M14.5 2h-5A3.5 3.5 0 006 5.5V9h2V5.5A1.5 1.5 0 019.5 4h5A1.5 1.5 0 0116 5.5V7h2V5.5A3.5 3.5 0 0014.5 2zM8 10a2 2 0 00-2 2v5.5A3.5 3.5 0 009.5 21h5a3.5 3.5 0 003.5-3.5V16h-2v1.5A1.5 1.5 0 0114.5 19h-5A1.5 1.5 0 018 17.5V14h8v-2H8z" />
        </svg>
      );
  }
}

type FrameworkCardProps = {
  number: number;
  title: string;
  description: string;
  packageName: string;
  href: string;
  icon: FrameworkIcon;
  isLast?: boolean;
};

export function FrameworkCard({
  number,
  title,
  description,
  packageName,
  href,
  icon,
  isLast,
}: FrameworkCardProps) {
  return (
    <div
      className={`flex flex-col px-8 py-10 lg:px-10 lg:py-12 ${
        !isLast ? "border-b border-white/20 md:border-b-0 md:border-r" : ""
      }`}
    >
      <span className="text-5xl font-light text-white/90 lg:text-6xl">{number}</span>
      <div className="mt-6 text-white/90">
        <FrameworkIconSvg icon={icon} />
      </div>
      <h3 className="mt-6 text-xl font-semibold leading-snug text-white lg:text-2xl">{title}</h3>
      <p className="mt-1 font-mono text-xs text-white/60">{packageName}</p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-white/80 lg:text-base">{description}</p>
      <a
        href={href}
        className="btn-pill btn-pill-white mt-8 w-fit text-xs uppercase tracking-wide"
      >
        Get started
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}
