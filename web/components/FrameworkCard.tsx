import Image from "next/image";

type FrameworkCardProps = {
  number: number;
  title: string;
  description: string;
  packageName: string;
  docsHref: string;
  githubHref: string;
  logoSrc: string;
  logoWidth: number;
  logoHeight: number;
  logoClassName?: string;
  isLast?: boolean;
};

export function FrameworkCard({
  number,
  title,
  description,
  packageName,
  docsHref,
  githubHref,
  logoSrc,
  logoWidth,
  logoHeight,
  logoClassName,
  isLast,
}: FrameworkCardProps) {
  const isSquare = Math.abs(logoWidth - logoHeight) / logoHeight < 0.15;

  return (
    <div
      className={`flex flex-col px-8 py-10 lg:px-10 lg:py-12 ${
        !isLast ? "border-b border-white/20 md:border-b-0 md:border-r" : ""
      }`}
    >
      <span className="text-5xl font-light text-white/90 lg:text-6xl">{number}</span>
      <div className="mt-6 flex h-10 items-center">
        <Image
          src={logoSrc}
          alt=""
          width={logoWidth}
          height={logoHeight}
          aria-hidden
          unoptimized
          className={
            isSquare
              ? `h-10 w-10 object-contain${logoClassName ? ` ${logoClassName}` : ""}`
              : `h-7 w-auto max-w-[180px] object-contain object-left${logoClassName ? ` ${logoClassName}` : ""}`
          }
        />
      </div>
      <h3 className="mt-6 text-xl font-semibold leading-snug text-white lg:text-2xl">{title}</h3>
      <a
        href={githubHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-block font-mono text-xs text-white/60 underline decoration-white/30 underline-offset-2 transition-colors hover:text-white hover:decoration-white/60"
      >
        {packageName}
      </a>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-white/80 lg:text-base">{description}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={docsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pill btn-pill-white w-fit text-xs uppercase tracking-wide"
        >
          Get started
          <span aria-hidden>→</span>
        </a>
        <a
          href={githubHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pill w-fit border border-white/30 bg-transparent text-xs uppercase tracking-wide text-white hover:bg-white/10"
        >
          Source
          <span aria-hidden>↗</span>
        </a>
      </div>
    </div>
  );
}
