import Link from "next/link";
import { docsUrl } from "@/lib/content";

function HeroGraphic() {
  return (
    <div className="relative flex h-full min-h-[280px] items-center justify-center p-8 lg:min-h-[420px]">
      {/* Abstract layered shapes */}
      <div className="relative h-48 w-48 lg:h-56 lg:w-56">
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "linear-gradient(135deg, #FF5C00 0%, #FFB088 50%, transparent 50%)",
            transform: "rotate(-6deg)",
          }}
        />
        <div
          className="absolute inset-4 rounded-3xl"
          style={{
            background: "linear-gradient(225deg, #5546FF 0%, #7B6FFF 60%, transparent 60%)",
            transform: "rotate(4deg)",
          }}
        />
        <div className="absolute -right-2 top-6 flex flex-col gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stacks-purple shadow-lg ring-4 ring-white/80">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7931A] shadow-lg ring-4 ring-white/80">
            <span className="text-xl font-bold text-white">₿</span>
          </div>
        </div>
        {/* Ripple circles */}
        <svg
          className="absolute -bottom-8 -right-8 h-32 w-32 text-stacks-orange/20"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden
        >
          <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.75" />
          <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="px-6 py-10 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-2 lg:gap-6">
        {/* Left — dark card */}
        <div className="flex flex-col justify-center rounded-3xl bg-stacks-black px-8 py-12 text-white lg:px-12 lg:py-16">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight lg:text-4xl xl:text-5xl">
            Give AI agents safe, structured access to Stacks
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 lg:text-lg">
            One shared tool registry powers ElizaOS, OpenClaw, and Hermes — balances, STX
            transfers, stacking, BNS, Clarity contracts, swaps, and bridging secured by Bitcoin.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={docsUrl("/quickstart")} className="btn-pill btn-pill-orange">
              Get started
              <span aria-hidden>→</span>
            </Link>
            <Link href="#frameworks" className="btn-pill border border-white/30 bg-transparent text-white hover:bg-white/10 focus-visible:outline-white">
              View frameworks
            </Link>
          </div>
        </div>

        {/* Right — light graphic card */}
        <div className="hero-grid-bg overflow-hidden rounded-3xl lg:min-h-[420px]">
          <HeroGraphic />
        </div>
      </div>
    </section>
  );
}
