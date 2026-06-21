import { BroadcastResult, ContractCallParams, DecodeCvParams, ReadOnlyCallParams, ReadOnlyCallResult } from '../types';
export declare function contractCall(params: ContractCallParams): Promise<BroadcastResult>;
export declare function readOnlyCall(params: ReadOnlyCallParams): Promise<ReadOnlyCallResult>;
export declare function decodeCv(params: DecodeCvParams): ReadOnlyCallResult;
