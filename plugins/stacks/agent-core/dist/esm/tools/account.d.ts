import { AccountHistoryParams, AccountHistoryResult, BalanceResult, BroadcastResult, GetBalanceParams, SendTokensParams } from '../types';
/** Fetch the STX, fungible, and non-fungible token balances for an account. */
export declare function getBalance(params: GetBalanceParams): Promise<BalanceResult>;
/** Build, sign, and broadcast an STX transfer. Returns the resulting txid. */
export declare function sendTokens(params: SendTokensParams): Promise<BroadcastResult>;
/** Fetch paginated transaction history for an account. */
export declare function getAccountHistory(params: AccountHistoryParams): Promise<AccountHistoryResult>;
