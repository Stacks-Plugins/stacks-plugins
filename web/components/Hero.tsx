import { docsUrl, SITE } from "@/lib/content";

function HeroVideo() {
  return (
    <div className="flex h-full min-h-[280px] items-center justify-center p-6 lg:min-h-[420px] lg:p-8">
      <div className="aspect-video w-full max-w-xl overflow-hidden rounded-2xl bg-stacks-black/5 shadow-lg ring-1 ring-black/10">
        <iframe
          src={SITE.youtubeEmbedUrl}
          title="Stacks Plugins overview"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="px-6 py-10 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="flex flex-col justify-center rounded-3xl bg-stacks-black px-8 py-12 text-white lg:px-12 lg:py-16">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight lg:text-4xl xl:text-5xl">
            Give AI agents safe, structured access to Stacks
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 lg:text-lg">
            One shared tool registry powers ElizaOS, OpenClaw, and Hermes for balances, STX
            transfers, stacking, BNS, Clarity contracts, swaps, bridging, sBTC peg-in/out, and Zest
            yield — all secured by Bitcoin.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={docsUrl("/quickstart")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill btn-pill-orange"
            >
              Get started
              <span aria-hidden>→</span>
            </a>
            <a
              href="#frameworks"
              className="btn-pill border border-white/30 bg-transparent text-white hover:bg-white/10 focus-visible:outline-white"
            >
              View frameworks
            </a>
            <a
              href={SITE.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill border border-white/30 bg-transparent text-white hover:bg-white/10 focus-visible:outline-white"
            >
              Watch video
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>

        <div className="hero-grid-bg overflow-hidden rounded-3xl lg:min-h-[420px]">
          <HeroVideo />
        </div>
      </div>
    </section>
  );
}
