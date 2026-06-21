import { resolveNetwork } from '../client';
import { BroadcastResult, LookupAddressParams, LookupAddressResult, NamePriceParams, NamePriceResult, ResolveNameParams, ResolveNameResult } from '../types';
export declare function resolveName(params: ResolveNameParams): Promise<ResolveNameResult>;
export declare function lookupAddress(params: LookupAddressParams): Promise<LookupAddressResult>;
export declare function getNamePrice(params: NamePriceParams): Promise<NamePriceResult>;
export interface TransferNameParams {
    network?: ReturnType<typeof resolveNetwork>;
    name: string;
    newOwnerAddress: string;
    zonefile?: string;
    senderKey: string;
}
export declare function transferName(params: TransferNameParams): Promise<BroadcastResult>;
