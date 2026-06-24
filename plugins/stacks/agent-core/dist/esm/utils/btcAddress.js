import { Address } from '@scure/btc-signer';
import { Cl } from '@stacks/transactions';
import { MAINNET, TESTNET } from 'sbtc';
import { validate as validateBtcAddress, Network as BtcNetwork } from 'bitcoin-address-validation';
/** Map a Bitcoin address to the sBTC withdrawal recipient tuple. */
export function btcAddressToRecipient(btcAddress, network = 'mainnet') {
    const netLabel = network === 'testnet' ? 'testnet' : 'mainnet';
    const btcValidationNetwork = network === 'testnet' ? BtcNetwork.testnet : BtcNetwork.mainnet;
    if (!validateBtcAddress(btcAddress, btcValidationNetwork)) {
        throw new Error(`Invalid Bitcoin address for ${netLabel}: ${btcAddress}`);
    }
    const btcNet = network === 'testnet' ? TESTNET : MAINNET;
    const script = Address(btcNet).decode(btcAddress);
    switch (script.type) {
        case 'pkh':
            return {
                version: Cl.bufferFromHex('00'),
                hashbytes: Cl.buffer(script.hash),
            };
        case 'sh':
            return {
                version: Cl.bufferFromHex('01'),
                hashbytes: Cl.buffer(script.hash),
            };
        case 'wpkh':
            return {
                version: Cl.bufferFromHex('04'),
                hashbytes: Cl.buffer(script.hash),
            };
        case 'wsh':
            return {
                version: Cl.bufferFromHex('05'),
                hashbytes: Cl.buffer(script.hash),
            };
        case 'tr':
            return {
                version: Cl.bufferFromHex('06'),
                hashbytes: Cl.buffer(script.pubkey),
            };
        default:
            throw new Error(`Unsupported Bitcoin address type for sBTC peg-out: ${script.type}`);
    }
}
