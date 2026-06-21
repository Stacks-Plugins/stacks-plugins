import type { Plugin } from '@elizaos/core';
import { accountActions } from './actions/accountActions';
import { bnsActions } from './actions/bnsActions';
import { contractActions } from './actions/contractActions';
import { stackingActions } from './actions/stackingActions';
import { swapActions } from './actions/swapActions';
/**
 * ElizaOS plugin exposing the full Stacks agent toolset.
 *
 * All blockchain logic lives in `@stacks/agent-core`; this package only adapts
 * those handlers into ElizaOS {@link Action}s so the same implementation is
 * shared with the OpenClaw plugin.
 */
export declare const stacksPlugin: Plugin;
export default stacksPlugin;
export { accountActions, stackingActions, bnsActions, contractActions, swapActions };
