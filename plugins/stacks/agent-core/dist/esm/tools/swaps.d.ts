import { BroadcastResult, SwapExecuteParams, SwapQuoteParams, SwapQuoteResult } from '../types';
/**
 * Get a swap quote from the ALEX DEX aggregator.
 *
 * Note: ALEX only operates on mainnet. Token identifiers are ALEX token
 * principals (e.g. `token-wstx`, `token-wusda`) or `STX`.
 */
export declare function swapQuote(params: SwapQuoteParams): Promise<SwapQuoteResult>;
/**
 * Execute a swap on ALEX.
 *
 * This builds and broadcasts a contract call against the ALEX AMM router using
 * pre-serialized Clarity arguments. Because route encoding is protocol-specific
 * and changes with pool versions, callers should pass `functionArgsHex` produced
 * from the quote `route`. When no encoded args are available this throws so the
 * agent does not broadcast an unsafe/empty swap.
 */
export declare function swapExecute(params: SwapExecuteParams & {
    functionArgsHex?: string[];
    functionName?: string;
}): Promise<BroadcastResult>;
