import { Type } from 'typebox';

export const stacksConfigSchema = Type.Object({
  defaultNetwork: Type.Optional(
    Type.Union([Type.Literal('mainnet'), Type.Literal('testnet')], {
      description: 'Default Stacks network when a tool omits `network`.',
    })
  ),
});

export type StacksPluginConfig = {
  defaultNetwork?: 'mainnet' | 'testnet';
};
