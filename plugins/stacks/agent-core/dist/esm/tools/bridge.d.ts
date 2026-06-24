import { BridgeInitiateParams, BridgeQuoteParams, BridgeQuoteResult, BroadcastResult } from '../types';
/**
 * Get a cross-chain bridge quote.
 *
 * Uses the Allbridge Core public API to estimate the received amount for a
 * token bridged between two supported chains (including Stacks).
 */
export declare function bridgeQuote(params: BridgeQuoteParams): Promise<BridgeQuoteResult>;
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
export declare function bridgeInitiate(_params: BridgeInitiateParams): Promise<BroadcastResult>;
