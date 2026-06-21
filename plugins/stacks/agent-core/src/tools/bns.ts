import { buildTransferNameTx, getNamePrice as bnsGetNamePrice } from '@stacks/bns';
import { networkFrom } from '@stacks/network';
import {
  broadcastTransaction,
  privateKeyToPublic,
  publicKeyToHex,
  TransactionSigner,
  StacksTransactionWire,
} from '@stacks/transactions';
import { apiUrl, fetchFn, resolveNetwork } from '../client';
import {
  BroadcastResult,
  LookupAddressParams,
  LookupAddressResult,
  NamePriceParams,
  NamePriceResult,
  ResolveNameParams,
  ResolveNameResult,
} from '../types';

/** Sign an unsigned BNS transaction with the sender key and broadcast it. */
async function signAndBroadcast(
  transaction: StacksTransactionWire,
  senderKey: string,
  network: ReturnType<typeof resolveNetwork>
): Promise<BroadcastResult> {
  const signer = new TransactionSigner(transaction);
  signer.signOrigin(senderKey);
  const result = await broadcastTransaction({ transaction, network });
  if ('error' in result) {
    const err = result as any;
    return { txid: err.txid ?? '', success: false, error: err.error, reason: err.reason };
  }
  return { txid: result.txid, success: true };
}

/** Resolve a BNS name to its owner address and zonefile. */
export async function resolveName(params: ResolveNameParams): Promise<ResolveNameResult> {
  const network = resolveNetwork(params.network);
  const url = `${apiUrl(network)}/v1/names/${encodeURIComponent(params.name)}`;
  const res = await fetchFn(url);
  if (res.status === 404) {
    return { name: params.name, network, found: false };
  }
  if (!res.ok) {
    throw new Error(`Failed to resolve ${params.name}: ${res.status} ${res.statusText}`);
  }
  const json: any = await res.json();
  return {
    name: params.name,
    network,
    address: json.address,
    zonefile: json.zonefile,
    expireBlock: json.expire_block,
    status: json.status,
    found: true,
  };
}

/** List all BNS names owned by a Stacks address. */
export async function lookupAddress(params: LookupAddressParams): Promise<LookupAddressResult> {
  const network = resolveNetwork(params.network);
  const url = `${apiUrl(network)}/v1/addresses/stacks/${params.address}`;
  const res = await fetchFn(url);
  if (!res.ok) {
    throw new Error(`Failed to look up ${params.address}: ${res.status} ${res.statusText}`);
  }
  const json: any = await res.json();
  return { address: params.address, network, names: json.names ?? [] };
}

/** Get the registration price (in microSTX) for a BNS name. */
export async function getNamePrice(params: NamePriceParams): Promise<NamePriceResult> {
  const network = resolveNetwork(params.network);
  const amount = await bnsGetNamePrice({
    fullyQualifiedName: params.name,
    network: networkFrom(network),
  });
  return { name: params.name, network, amount: amount.toString() };
}

export interface TransferNameParams {
  network?: ReturnType<typeof resolveNetwork>;
  /** Fully-qualified name to transfer, e.g. `myname.btc`. */
  name: string;
  /** Recipient Stacks address. */
  newOwnerAddress: string;
  /** Optional new zonefile to set on transfer. */
  zonefile?: string;
  /** Hex-encoded private key of the current owner. */
  senderKey: string;
}

/** Transfer ownership of a BNS name to another address (`name-transfer`). */
export async function transferName(params: TransferNameParams): Promise<BroadcastResult> {
  const network = resolveNetwork(params.network);
  const publicKey = publicKeyToHex(privateKeyToPublic(params.senderKey));
  const transaction = await buildTransferNameTx({
    fullyQualifiedName: params.name,
    newOwnerAddress: params.newOwnerAddress,
    zonefile: params.zonefile,
    publicKey,
    network: networkFrom(network),
  });
  return signAndBroadcast(transaction, params.senderKey, network);
}
