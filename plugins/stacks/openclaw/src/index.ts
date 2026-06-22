import { Type } from 'typebox';
import { defineToolPlugin } from 'openclaw/plugin-sdk/tool-plugin';
import { stacksConfigSchema, type StacksPluginConfig } from './config.js';
import { executeTool } from './shared.js';
import { stacksToolSpecs } from './tools.js';
import { walletContextText } from './wallet.js';

export default defineToolPlugin({
  id: 'stacks',
  name: 'Stacks Plugin',
  description:
    'Stacks blockchain tools: balances, STX transfers, account history, ' +
    'stacking/PoX, BNS naming, Clarity contract calls, ALEX swaps, and bridging.',
  configSchema: stacksConfigSchema,
  tools: (tool) => [
    tool({
      name: 'stacks_wallet_info',
      label: 'Stacks Wallet Info',
      description:
        'Show the configured Stacks wallet address, network, and signing status. ' +
        'Use when the user asks about "my wallet", signing readiness, or which network is active.',
      parameters: Type.Object({}),
      execute: (_params, config: StacksPluginConfig) => walletContextText(config),
    }),
    ...stacksToolSpecs.map((spec) =>
      tool({
        name: spec.name,
        label: spec.label,
        description: spec.description,
        parameters: spec.parameters,
        optional: spec.optional,
        async execute(params, config: StacksPluginConfig, context) {
          context.signal?.throwIfAborted();
          const { text, isError } = await executeTool(
            spec,
            params as Record<string, unknown>,
            { pluginConfig: config }
          );
          if (isError) {
            throw new Error(text);
          }
          return text;
        },
      })
    ),
  ],
  activation: {
    onStartup: true,
  },
});
