import { docsUrl, FRAMEWORKS, githubTreeUrl } from "@/lib/content";
import { FrameworkCard } from "./FrameworkCard";

export function FrameworkSection() {
  return (
    <section id="frameworks" className="stepped-top bg-stacks-orange pt-8 lg:pt-10">
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-12 lg:px-8 lg:pb-20 lg:pt-16">
        <h2 className="text-3xl font-semibold text-white lg:text-4xl">3 ways to get started</h2>
        <p className="mt-3 max-w-2xl text-white/80">
          Pick your agent framework. Every adapter exposes the same 33 core Stacks tools — including
          sBTC and Zest — from a single source of truth.
        </p>

        <div className="mt-10 grid overflow-hidden rounded-2xl border border-white/20 md:grid-cols-3">
          {FRAMEWORKS.map((framework, index) => (
            <FrameworkCard
              key={framework.name}
              number={framework.number}
              title={framework.title}
              description={framework.description}
              packageName={framework.package}
              docsHref={docsUrl(framework.docsPath)}
              githubHref={githubTreeUrl(framework.githubPath)}
              logoSrc={framework.logoSrc}
              logoWidth={framework.logoWidth}
              logoHeight={framework.logoHeight}
              logoClassName={framework.logoClassName}
              isLast={index === FRAMEWORKS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
