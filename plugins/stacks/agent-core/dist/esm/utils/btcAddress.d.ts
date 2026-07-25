import { Cl } from '@stacks/transactions';
import { NetworkArg } from '../types';
export type BtcRecipientTuple = {
    version: ReturnType<typeof Cl.bufferFromHex>;
    hashbytes: ReturnType<typeof Cl.buffer>;
};
/** Map a Bitcoin address to the sBTC withdrawal recipient tuple. */
export declare function btcAddressToRecipient(btcAddress: string, network?: NetworkArg): BtcRecipientTuple;
