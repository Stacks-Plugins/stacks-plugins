import { AccountHistoryParams, AccountHistoryResult, BalanceResult, BroadcastResult, GetBalanceParams, SendTokensParams } from '../types';
export declare function getBalance(params: GetBalanceParams): Promise<BalanceResult>;
export declare function sendTokens(params: SendTokensParams): Promise<BroadcastResult>;
export declare function getAccountHistory(params: AccountHistoryParams): Promise<AccountHistoryResult>;
