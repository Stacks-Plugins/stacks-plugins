import {
  broadcastTransaction,
  cvToJSON,
  deserializeCV,
  fetchCallReadOnlyFunction,
  makeContractCall,
  serializeCV,
  ClarityValue,
  SignedContractCallOptions,
} from '@stacks/transactions';
import { resolveNetwork, stacksClient } from '../client';
import {
  BroadcastResult,
  ContractCallParams,
  DecodeCvParams,
  ReadOnlyCallParams,
  ReadOnlyCallResult,
} from '../types';

function decodeArgs(functionArgsHex?: string[]): ClarityValue[] {
  return (functionArgsHex ?? []).map(hex => deserializeCV(hex));
}

/** Build, sign, and broadcast a public Clarity contract function call. */
export async function contractCall(params: ContractCallParams): Promise<BroadcastResult> {
  const network = resolveNetwork(params.network);

  const txOptions: SignedContractCallOptions = {
    contractAddress: params.contractAddress,
    contractName: params.contractName,
    functionName: params.functionName,
    functionArgs: decodeArgs(params.functionArgsHex),
    senderKey: params.senderKey,
    network,
  };
  if (params.fee != null) txOptions.fee = BigInt(params.fee);
  if (params.nonce != null) txOptions.nonce = BigInt(params.nonce);

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction({ transaction, network });
  if ('error' in result) {
    const err = result as any;
    return { txid: err.txid ?? '', success: false, error: err.error, reason: err.reason };
  }
  return { txid: result.txid, success: true };
}

/** Evaluate a read-only Clarity contract function and return its decoded result. */
export async function readOnlyCall(params: ReadOnlyCallParams): Promise<ReadOnlyCallResult> {
  const network = resolveNetwork(params.network);
  const senderAddress = params.senderAddress ?? params.contractAddress;

  const result = await fetchCallReadOnlyFunction({
    contractAddress: params.contractAddress,
    contractName: params.contractName,
    functionName: params.functionName,
    functionArgs: decodeArgs(params.functionArgsHex),
    senderAddress,
    network,
    client: stacksClient(network),
  });

  return { value: cvToJSON(result), hex: serializeCV(result) };
}

/** Decode a hex-encoded serialized Clarity value into readable JSON. */
export function decodeCv(params: DecodeCvParams): ReadOnlyCallResult {
  const cv = deserializeCV(params.hex);
  return { value: cvToJSON(cv), hex: params.hex };
}
