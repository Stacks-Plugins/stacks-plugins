import { BroadcastResult, ContractCallParams, DecodeCvParams, ReadOnlyCallParams, ReadOnlyCallResult } from '../types';
/** Build, sign, and broadcast a public Clarity contract function call. */
export declare function contractCall(params: ContractCallParams): Promise<BroadcastResult>;
/** Evaluate a read-only Clarity contract function and return its decoded result. */
export declare function readOnlyCall(params: ReadOnlyCallParams): Promise<ReadOnlyCallResult>;
/** Decode a hex-encoded serialized Clarity value into readable JSON. */
export declare function decodeCv(params: DecodeCvParams): ReadOnlyCallResult;
