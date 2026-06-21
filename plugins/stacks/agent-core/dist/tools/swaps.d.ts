import { BroadcastResult, SwapExecuteParams, SwapQuoteParams, SwapQuoteResult } from '../types';
export declare function swapQuote(params: SwapQuoteParams): Promise<SwapQuoteResult>;
export declare function swapExecute(params: SwapExecuteParams & {
    functionArgsHex?: string[];
    functionName?: string;
}): Promise<BroadcastResult>;
