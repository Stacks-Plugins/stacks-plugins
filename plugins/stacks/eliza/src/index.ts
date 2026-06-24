import type { Plugin } from '@elizaos/core';
import { accountActions } from './actions/accountActions';
import { bnsActions } from './actions/bnsActions';
import { contractActions } from './actions/contractActions';
import { stackingActions } from './actions/stackingActions';
import { swapActions } from './actions/swapActions';
import { sbtcActions } from './actions/sbtcActions';
import { zestActions } from './actions/zestActions';
import { stacksWalletProvider } from './providers/walletProvider';

/**
 * ElizaOS plugin exposing the full Stacks agent toolset.
 *
 * All blockchain logic lives in `@sugarhi11/agent-core`; this package only adapts
 * those handlers into ElizaOS {@link Action}s so the same implementation is
 * shared with the OpenClaw plugin.
 */
export const stacksPlugin: Plugin = {
  name: 'stacks',
  description:
    'Stacks blockchain tools: balances, STX transfers, account history, ' +
    'stacking/PoX, BNS naming, Clarity contracts, ALEX swaps, bridging, sBTC peg-in/out, and Zest yield.',
  actions: [
    ...accountActions,
    ...stackingActions,
    ...bnsActions,
    ...contractActions,
    ...swapActions,
    ...sbtcActions,
    ...zestActions,
  ],
  evaluators: [],
  providers: [stacksWalletProvider],
};

export default stacksPlugin;

export {
  accountActions,
  stackingActions,
  bnsActions,
  contractActions,
  swapActions,
  sbtcActions,
  zestActions,
};
