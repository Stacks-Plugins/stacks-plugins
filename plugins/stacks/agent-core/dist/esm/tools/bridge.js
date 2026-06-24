import { fetchFn } from '../client';
/** Base URL for the Allbridge Core public API (supports Stacks via Core). */
const ALLBRIDGE_API = 'https://core.api.allbridgecoreapi.net';
/**
 * Get a cross-chain bridge quote.
 *
 * Uses the Allbridge Core public API to estimate the received amount for a
 * token bridged between two supported chains (including Stacks).
 */
export async function bridgeQuote(params) {
    const url = `${ALLBRIDGE_API}/swap?amount=${params.amount}` +
        `&fromChain=${encodeURIComponent(params.fromChain)}` +
        `&toChain=${encodeURIComponent(params.toChain)}` +
        `&token=${encodeURIComponent(params.token)}`;
    const res = await fetchFn(url);
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
/**
 * Initiate a cross-chain bridge transfer.
 *
 * Bridge initiation requires a protocol-specific signed contract call on the
 * source chain (and, for Stacks, the Allbridge bridge contract). Because the
 * exact contract, function, and Clarity arguments depend on the live Allbridge
 * deployment and selected route, this is intentionally not auto-broadcast.
 * Use the generic `contractCall` tool with arguments derived from the quote, or
 * wire the Allbridge SDK for full execution.
 */
export async function bridgeInitiate(_params) {
    throw new Error('bridgeInitiate is not auto-executed. Fetch a quote with `bridgeQuote`, then ' +
        'build the source-chain bridge transaction with the `contractCall` tool ' +
        '(Stacks side) or the Allbridge SDK for non-Stacks source chains.');
}
