import { StacksNetworkName } from '@stacks/network';
export type NetworkArg = StacksNetworkName;
export interface BaseParams {
    network?: NetworkArg;
}
export interface SignedParams extends BaseParams {
    senderKey: string;
    fee?: string | number;
    nonce?: string | number;
}
export interface GetBalanceParams extends BaseParams {
    address: string;
}
export interface BalanceResult {
    address: string;
    network: NetworkArg;
    stx: string;
    locked: string;
    totalSent: string;
    totalReceived: string;
    fungibleTokens: Record<string, {
        balance: string;
    }>;
    nonFungibleTokens: Record<string, {
        count: string;
    }>;
}
export interface SendTokensParams extends SignedParams {
    recipient: string;
    amount: string | number;
    memo?: string;
}
export interface BroadcastResult {
    txid: string;
    success: boolean;
    error?: string;
    reason?: string;
}
export interface AccountHistoryParams extends BaseParams {
    address: string;
    limit?: number;
    offset?: number;
}
export interface AccountHistoryResult {
    address: string;
    network: NetworkArg;
    total: number;
    limit: number;
    offset: number;
    transactions: unknown[];
}
export interface StackingStatusParams extends BaseParams {
    address: string;
}
export interface CanStackParams extends BaseParams {
    address: string;
    amount: string | number;
    cycles: number;
    poxAddress: string;
}
export interface StackParams extends SignedParams {
    amount: string | number;
    cycles: number;
    poxAddress: string;
    burnBlockHeight?: number;
}
export interface DelegateStxParams extends SignedParams {
    amount: string | number;
    delegateTo: string;
    untilBurnBlockHeight?: number;
    poxAddress?: string;
}
export interface RevokeDelegateParams extends SignedParams {
}
export interface ResolveNameParams extends BaseParams {
    name: string;
}
export interface ResolveNameResult {
    name: string;
    network: NetworkArg;
    address?: string;
    zonefile?: string;
    expireBlock?: number;
    status?: string;
    found: boolean;
}
export interface LookupAddressParams extends BaseParams {
    address: string;
}
export interface LookupAddressResult {
    address: string;
    network: NetworkArg;
    names: string[];
}
export interface NamePriceParams extends BaseParams {
    name: string;
}
export interface NamePriceResult {
    name: string;
    network: NetworkArg;
    amount: string;
}
export interface ContractCallParams extends SignedParams {
    contractAddress: string;
    contractName: string;
    functionName: string;
    functionArgsHex?: string[];
}
export interface ReadOnlyCallParams extends BaseParams {
    contractAddress: string;
    contractName: string;
    functionName: string;
    functionArgsHex?: string[];
    senderAddress?: string;
}
export interface ReadOnlyCallResult {
    value: unknown;
    hex: string;
}
export interface DecodeCvParams {
    hex: string;
}
export interface SwapQuoteParams extends BaseParams {
    tokenFrom: string;
    tokenTo: string;
    amount: string | number;
}
export interface SwapQuoteResult {
    tokenFrom: string;
    tokenTo: string;
    amountIn: string;
    amountOut: string;
    route: string[];
    network: NetworkArg;
}
export interface SwapExecuteParams extends SignedParams {
    tokenFrom: string;
    tokenTo: string;
    amount: string | number;
    minAmountOut: string | number;
}
export interface BridgeQuoteParams extends BaseParams {
    fromChain: string;
    toChain: string;
    token: string;
    amount: string | number;
}
export interface BridgeQuoteResult {
    fromChain: string;
    toChain: string;
    token: string;
    amountIn: string;
    amountOut: string;
    fee: string;
    provider: string;
}
export interface BridgeInitiateParams extends SignedParams {
    fromChain: string;
    toChain: string;
    token: string;
    amount: string | number;
    recipient: string;
}
