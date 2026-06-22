export const SITE = {
  name: "Stacks Plugins",
  tagline:
    "AI agent plugins for the Stacks blockchain — balances, transfers, stacking, BNS, Clarity contracts, swaps, and bridging.",
  githubUrl: "https://github.com/Stacks-Plugins/stacks-plugins",
} as const;

export function docsUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_DOCS_URL ?? "").replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
}

export const NAV_LINKS = [
  { label: "Docs", href: () => docsUrl("/") },
  { label: "Quick start", href: () => docsUrl("/quickstart") },
  { label: "Frameworks", href: () => "#frameworks" },
] as const;

export type FrameworkIcon = "code" | "brackets" | "python";

export type Framework = {
  number: number;
  name: string;
  package: string;
  title: string;
  description: string;
  docsPath: string;
  icon: FrameworkIcon;
};

export const FRAMEWORKS: Framework[] = [
  {
    number: 1,
    name: "ElizaOS",
    package: "plugin-eliza-stacks",
    title: "Start with ElizaOS actions",
    description:
      "Register stacksPlugin in your ElizaOS agent. 19 actions with similes for intent matching, plus a STACKS_WALLET provider for wallet-aware context.",
    docsPath: "/frameworks/eliza",
    icon: "code",
  },
  {
    number: 2,
    name: "OpenClaw",
    package: "@stacks/openclaw-stacks",
    title: "Install the OpenClaw plugin",
    description:
      "20 TypeBox-validated tools via registerTool — 19 core handlers plus stacks_wallet_info. Write tools are optional for read-only agents.",
    docsPath: "/frameworks/openclaw",
    icon: "brackets",
  },
  {
    number: 3,
    name: "Hermes",
    package: "plugins/stacks/hermes",
    title: "Enable the Hermes plugin",
    description:
      "Python plugin with a Node bridge to agent-core. Includes /stacks command, bundled skills, and hooks for wallet context injection.",
    docsPath: "/frameworks/hermes",
    icon: "python",
  },
];

export type ResourceColor = "yellow" | "orange" | "coral" | "peach" | "gold" | "purple";

export type Resource = {
  title: string;
  description: string;
  docsPath: string;
  color: ResourceColor;
  externalHref?: string;
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
    description: "Browse all 19 agent tools — read vs write, grouped by category.",
    docsPath: "/tools/overview",
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
    color: "peach",
  },
  {
    title: "Agent core",
    description: "Use @stacks/agent-core directly or build a custom framework adapter.",
    docsPath: "/agent-core/overview",
    color: "gold",
  },
  {
    title: "GitHub repository",
    description: "Source code for all plugins, docs, and the shared STACKS_TOOLS registry.",
    docsPath: "",
    externalHref: SITE.githubUrl,
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
