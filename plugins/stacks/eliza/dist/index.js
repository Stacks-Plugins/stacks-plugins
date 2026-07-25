"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zestActions = exports.sbtcActions = exports.swapActions = exports.contractActions = exports.bnsActions = exports.stackingActions = exports.accountActions = exports.stacksPlugin = void 0;
const accountActions_1 = require("./actions/accountActions");
Object.defineProperty(exports, "accountActions", { enumerable: true, get: function () { return accountActions_1.accountActions; } });
const bnsActions_1 = require("./actions/bnsActions");
Object.defineProperty(exports, "bnsActions", { enumerable: true, get: function () { return bnsActions_1.bnsActions; } });
const contractActions_1 = require("./actions/contractActions");
Object.defineProperty(exports, "contractActions", { enumerable: true, get: function () { return contractActions_1.contractActions; } });
const stackingActions_1 = require("./actions/stackingActions");
Object.defineProperty(exports, "stackingActions", { enumerable: true, get: function () { return stackingActions_1.stackingActions; } });
const swapActions_1 = require("./actions/swapActions");
Object.defineProperty(exports, "swapActions", { enumerable: true, get: function () { return swapActions_1.swapActions; } });
const sbtcActions_1 = require("./actions/sbtcActions");
Object.defineProperty(exports, "sbtcActions", { enumerable: true, get: function () { return sbtcActions_1.sbtcActions; } });
const zestActions_1 = require("./actions/zestActions");
Object.defineProperty(exports, "zestActions", { enumerable: true, get: function () { return zestActions_1.zestActions; } });
const walletProvider_1 = require("./providers/walletProvider");
/**
 * ElizaOS plugin exposing the full Stacks agent toolset.
 *
 * All blockchain logic lives in `@sugarhi11/agent-core`; this package only adapts
 * those handlers into ElizaOS {@link Action}s so the same implementation is
 * shared with the OpenClaw plugin.
 */
exports.stacksPlugin = {
    name: 'stacks',
    description: 'Stacks blockchain tools: balances, STX transfers, account history, ' +
        'stacking/PoX, BNS naming, Clarity contracts, ALEX swaps, bridging, sBTC peg-in/out, and Zest yield.',
    actions: [
        ...accountActions_1.accountActions,
        ...stackingActions_1.stackingActions,
        ...bnsActions_1.bnsActions,
        ...contractActions_1.contractActions,
        ...swapActions_1.swapActions,
        ...sbtcActions_1.sbtcActions,
        ...zestActions_1.zestActions,
    ],
    evaluators: [],
    providers: [walletProvider_1.stacksWalletProvider],
};
exports.default = exports.stacksPlugin;
