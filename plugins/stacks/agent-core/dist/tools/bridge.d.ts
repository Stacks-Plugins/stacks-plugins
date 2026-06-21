import { BridgeInitiateParams, BridgeQuoteParams, BridgeQuoteResult, BroadcastResult } from '../types';
export declare function bridgeQuote(params: BridgeQuoteParams): Promise<BridgeQuoteResult>;
export declare function bridgeInitiate(_params: BridgeInitiateParams): Promise<BroadcastResult>;
