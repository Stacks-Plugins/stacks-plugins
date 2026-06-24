import { resolveNetwork } from '../client';
import { BroadcastResult, LookupAddressParams, LookupAddressResult, NamePriceParams, NamePriceResult, ResolveNameParams, ResolveNameResult } from '../types';
/** Resolve a BNS name to its owner address and zonefile. */
export declare function resolveName(params: ResolveNameParams): Promise<ResolveNameResult>;
/** List all BNS names owned by a Stacks address. */
export declare function lookupAddress(params: LookupAddressParams): Promise<LookupAddressResult>;
/** Get the registration price (in microSTX) for a BNS name. */
export declare function getNamePrice(params: NamePriceParams): Promise<NamePriceResult>;
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
export declare function transferName(params: TransferNameParams): Promise<BroadcastResult>;
