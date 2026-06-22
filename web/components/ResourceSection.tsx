import { docsUrl, RESOURCES } from "@/lib/content";
import { ResourceItem } from "./ResourceItem";

export function ResourceSection() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 rounded-3xl bg-[#ececea] p-8 lg:grid-cols-2 lg:gap-16 lg:p-12">
        <div>
          <span className="inline-block rounded-full border border-stacks-black/20 px-3 py-1 text-xs font-medium uppercase tracking-widest text-stacks-black/70">
            Resources
          </span>
          <p className="mt-6 text-lg leading-relaxed text-stacks-black/80 lg:text-xl">
            Guides and references for building Stacks AI agents — whether you use ElizaOS,
            OpenClaw, or Hermes, you will find setup instructions, tool docs, and architecture
            notes here.
          </p>
        </div>

        <ul className="flex flex-col gap-2">
          {RESOURCES.map((resource) => {
            const href = resource.externalHref ?? docsUrl(resource.docsPath);
            const external = Boolean(resource.externalHref);

            return (
              <li key={resource.title}>
                <ResourceItem
                  title={resource.title}
                  description={resource.description}
                  href={href}
                  color={resource.color}
                  external={external}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
