export const SITE = {
  name: "Stacks Plugins",
  tagline:
    "AI agent plugins for the Stacks blockchain covering balances, transfers, stacking, BNS, Clarity contracts, swaps, bridging, sBTC, and Zest yield.",
  githubUrl: "https://github.com/Stacks-Plugins/stacks-plugins",
  githubBranch: "main",
  youtubeUrl: "https://youtu.be/ccCIxig72xA",
  youtubeEmbedUrl: "https://www.youtube.com/embed/ccCIxig72xA",
} as const;

export function githubTreeUrl(path: string): string {
  const normalized = path.replace(/^\//, "");
  return normalized
    ? `${SITE.githubUrl}/tree/${SITE.githubBranch}/${normalized}`
    : SITE.githubUrl;
}

export function githubBlobUrl(path: string): string {
  return `${SITE.githubUrl}/blob/${SITE.githubBranch}/${path.replace(/^\//, "")}`;
}

/** Maps a docs site path to the corresponding MDX file on GitHub. */
export function docsUrl(path: string): string {
  const slug = path.replace(/^\//, "").replace(/\/$/, "");
  const docPath = slug ? `docs/${slug}.mdx` : "docs/index.mdx";
  return githubBlobUrl(docPath);
}

export const NAV_LINKS = [
  { label: "Docs", href: () => docsUrl("/") },
  { label: "Quick start", href: () => docsUrl("/quickstart") },
  { label: "Frameworks", href: () => "#frameworks" },
] as const;

export type Framework = {
  number: number;
  name: string;
  package: string;
  title: string;
  description: string;
  docsPath: string;
  githubPath: string;
  logoSrc: string;
  logoWidth: number;
  logoHeight: number;
  logoClassName?: string;
};

export const FRAMEWORKS: Framework[] = [
  {
    number: 1,
    name: "ElizaOS",
    package: "plugin-eliza-stacks",
    title: "Start with ElizaOS actions",
    description:
      "Register stacksPlugin in your ElizaOS agent. 33 actions with similes for intent matching, plus a STACKS_WALLET provider for wallet-aware context.",
    docsPath: "/frameworks/eliza",
    githubPath: "plugins/stacks/eliza",
    logoSrc: "/logos/eliza.png",
    logoWidth: 157,
    logoHeight: 24,
  },
  {
    number: 2,
    name: "OpenClaw",
    package: "@stacks/openclaw-stacks",
    title: "Install the OpenClaw plugin",
    description:
      "34 TypeBox-validated tools via registerTool, with 33 core handlers plus stacks_wallet_info. Write tools are optional for read-only agents.",
    docsPath: "/frameworks/openclaw",
    githubPath: "plugins/stacks/openclaw",
    logoSrc: "/logos/openclaw.png",
    logoWidth: 1024,
    logoHeight: 210,
  },
  {
    number: 3,
    name: "Hermes",
    package: "plugins/stacks/hermes",
    title: "Enable the Hermes plugin",
    description:
      "Python plugin with a Node bridge to agent-core. Includes /stacks command, bundled skills, and hooks for wallet context injection.",
    docsPath: "/frameworks/hermes",
    githubPath: "plugins/stacks/hermes",
    logoSrc: "/logos/hermes.png",
    logoWidth: 500,
    logoHeight: 500,
    logoClassName: "brightness-0 invert",
  },
];

export type ResourceColor = "yellow" | "orange" | "coral" | "peach" | "gold" | "purple";

export type Resource = {
  title: string;
  description: string;
  docsPath: string;
  color: ResourceColor;
  externalHref?: string;
  githubPath?: string;
  githubLabel?: string;
  githubBlob?: boolean;
};

export const RESOURCES: Resource[] = [
  {
    title: "Quick start",
    description: "Clone, build, configure, and wire up a framework plugin in minutes.",
    docsPath: "/quickstart",
    color: "yellow",
  },
  {
    title: "Tool reference",
    description: "Browse all 33 agent tools, read vs write, grouped by category.",
    docsPath: "/tools/overview",
    githubPath: "plugins/stacks/agent-core/src/index.ts",
    githubLabel: "STACKS_TOOLS registry",
    githubBlob: true,
    color: "orange",
  },
  {
    title: "Architecture",
    description: "How agent-core, framework adapters, and the Hermes Node bridge fit together.",
    docsPath: "/architecture",
    color: "coral",
  },
  {
    title: "Configuration",
    description: "Environment variables, networks, and signing keys for local development.",
    docsPath: "/configuration",
    githubPath: "plugins/stacks/.env.example",
    githubLabel: ".env.example",
    githubBlob: true,
    color: "peach",
  },
  {
    title: "sBTC & Zest safety",
    description: "Testnet-first guidance for peg flows, on-Stacks transfers, and Zest DeFi writes.",
    docsPath: "/safety/sbtc-zest",
    color: "coral",
  },
  {
    title: "Agent core",
    description: "Use @stacks/agent-core directly or build a custom framework adapter.",
    docsPath: "/agent-core/overview",
    githubPath: "plugins/stacks/agent-core",
    githubLabel: "plugins/stacks/agent-core",
    color: "gold",
  },
  {
    title: "GitHub repository",
    description: "Source code for all plugins, docs, and the shared STACKS_TOOLS registry.",
    docsPath: "",
    externalHref: SITE.githubUrl,
    githubPath: "plugins/stacks",
    githubLabel: "plugins/stacks",
    color: "purple",
  },
];

export const RESOURCE_COLORS: Record<ResourceColor, string> = {
  yellow: "#F5C842",
  orange: "#FF8C42",
  coral: "#FF6B4A",
  peach: "#FFB088",
  gold: "#FFD60A",
  purple: "#5546FF",
};
