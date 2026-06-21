"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapQuote = swapQuote;
exports.swapExecute = swapExecute;
const client_1 = require("../client");
const contracts_1 = require("./contracts");
const ALEX_API = 'https://api.alexgo.io';
async function swapQuote(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const url = `${ALEX_API}/v1/price/${encodeURIComponent(params.tokenFrom)}/` +
        `${encodeURIComponent(params.tokenTo)}?amount=${params.amount}`;
    const res = await (0, client_1.fetchFn)(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch swap quote ${params.tokenFrom}->${params.tokenTo}: ` +
            `${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    const amountOut = String(json.amountOut ?? json.amount_out ?? json.price ?? '0');
    const route = json.route ?? [params.tokenFrom, params.tokenTo];
    return {
        tokenFrom: params.tokenFrom,
        tokenTo: params.tokenTo,
        amountIn: String(params.amount),
        amountOut,
        route,
        network,
    };
}
const ALEX_ROUTER = {
    contractAddress: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9',
    contractName: 'amm-pool-v2-01',
};
async function swapExecute(params) {
    if (!params.functionArgsHex || params.functionArgsHex.length === 0) {
        throw new Error('swapExecute requires `functionArgsHex` encoding the ALEX route/amounts. ' +
            'Fetch a quote first, encode the route as Clarity values, then retry. ' +
            'Alternatively use the generic `contractCall` tool against the ALEX router.');
    }
    return (0, contracts_1.contractCall)({
        network: params.network,
        senderKey: params.senderKey,
        fee: params.fee,
        nonce: params.nonce,
        contractAddress: ALEX_ROUTER.contractAddress,
        contractName: ALEX_ROUTER.contractName,
        functionName: params.functionName ?? 'swap-helper',
        functionArgsHex: params.functionArgsHex,
    });
}
//# sourceMappingURL=swaps.js.map