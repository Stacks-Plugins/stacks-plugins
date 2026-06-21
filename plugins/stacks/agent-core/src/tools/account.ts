import {
  broadcastTransaction,
  makeSTXTokenTransfer,
  SignedTokenTransferOptions,
} from '@stacks/transactions';
import { apiUrl, fetchFn, resolveNetwork } from '../client';
import {
  AccountHistoryParams,
  AccountHistoryResult,
  BalanceResult,
  BroadcastResult,
  GetBalanceParams,
  SendTokensParams,
} from '../types';

/** Fetch the STX, fungible, and non-fungible token balances for an account. */
export async function getBalance(params: GetBalanceParams): Promise<BalanceResult> {
  const network = resolveNetwork(params.network);
  const url = `${apiUrl(network)}/extended/v1/address/${params.address}/balances`;
  const res = await fetchFn(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch balance for ${params.address}: ${res.status} ${res.statusText}`);
  }
  const json: any = await res.json();

  const fungibleTokens: Record<string, { balance: string }> = {};
  for (const [key, value] of Object.entries(json.fungible_tokens ?? {})) {
    fungibleTokens[key] = { balance: String((value as any).balance) };
  }
  const nonFungibleTokens: Record<string, { count: string }> = {};
  for (const [key, value] of Object.entries(json.non_fungible_tokens ?? {})) {
    nonFungibleTokens[key] = { count: String((value as any).count) };
  }

  return {
    address: params.address,
    network,
    stx: String(json.stx?.balance ?? '0'),
    locked: String(json.stx?.locked ?? '0'),
    totalSent: String(json.stx?.total_sent ?? '0'),
    totalReceived: String(json.stx?.total_received ?? '0'),
    fungibleTokens,
    nonFungibleTokens,
  };
}

/** Build, sign, and broadcast an STX transfer. Returns the resulting txid. */
export async function sendTokens(params: SendTokensParams): Promise<BroadcastResult> {
  const network = resolveNetwork(params.network);

  const txOptions: SignedTokenTransferOptions = {
    recipient: params.recipient,
    amount: BigInt(params.amount),
    senderKey: params.senderKey,
    network,
    memo: params.memo,
    fee: params.fee != null ? BigInt(params.fee) : undefined,
    nonce: params.nonce != null ? BigInt(params.nonce) : undefined,
  };

  const transaction = await makeSTXTokenTransfer(txOptions);
  const result = await broadcastTransaction({ transaction, network });

  if ('error' in result) {
    const err = result as any;
    return { txid: err.txid ?? '', success: false, error: err.error, reason: err.reason };
  }
  return { txid: result.txid, success: true };
}

/** Fetch paginated transaction history for an account. */
export async function getAccountHistory(
  params: AccountHistoryParams
): Promise<AccountHistoryResult> {
  const network = resolveNetwork(params.network);
  const limit = Math.min(params.limit ?? 20, 50);
  const offset = params.offset ?? 0;
  const url =
    `${apiUrl(network)}/extended/v2/addresses/${params.address}/transactions` +
    `?limit=${limit}&offset=${offset}`;
  const res = await fetchFn(url);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch history for ${params.address}: ${res.status} ${res.statusText}`
    );
  }
  const json: any = await res.json();

  return {
    address: params.address,
    network,
    total: json.total ?? 0,
    limit,
    offset,
    transactions: json.results ?? [],
  };
}
