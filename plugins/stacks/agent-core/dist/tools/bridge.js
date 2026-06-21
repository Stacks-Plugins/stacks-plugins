"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bridgeQuote = bridgeQuote;
exports.bridgeInitiate = bridgeInitiate;
const client_1 = require("../client");
const ALLBRIDGE_API = 'https://core.api.allbridgecoreapi.net';
async function bridgeQuote(params) {
    const url = `${ALLBRIDGE_API}/swap?amount=${params.amount}` +
        `&fromChain=${encodeURIComponent(params.fromChain)}` +
        `&toChain=${encodeURIComponent(params.toChain)}` +
        `&token=${encodeURIComponent(params.token)}`;
    const res = await (0, client_1.fetchFn)(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch bridge quote ${params.token} ${params.fromChain}->${params.toChain}: ` +
            `${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    return {
        fromChain: params.fromChain,
        toChain: params.toChain,
        token: params.token,
        amountIn: String(params.amount),
        amountOut: String(json.amountOut ?? json.amount ?? '0'),
        fee: String(json.fee ?? json.bridgeFee ?? '0'),
        provider: 'allbridge-core',
    };
}
async function bridgeInitiate(_params) {
    throw new Error('bridgeInitiate is not auto-executed. Fetch a quote with `bridgeQuote`, then ' +
        'build the source-chain bridge transaction with the `contractCall` tool ' +
        '(Stacks side) or the Allbridge SDK for non-Stacks source chains.');
}
//# sourceMappingURL=bridge.js.map