"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.btcAddressToRecipient = btcAddressToRecipient;
const btc_signer_1 = require("@scure/btc-signer");
const transactions_1 = require("@stacks/transactions");
const sbtc_1 = require("sbtc");
const bitcoin_address_validation_1 = require("bitcoin-address-validation");
/** Map a Bitcoin address to the sBTC withdrawal recipient tuple. */
function btcAddressToRecipient(btcAddress, network = 'mainnet') {
    const netLabel = network === 'testnet' ? 'testnet' : 'mainnet';
    const btcValidationNetwork = network === 'testnet' ? bitcoin_address_validation_1.Network.testnet : bitcoin_address_validation_1.Network.mainnet;
    if (!(0, bitcoin_address_validation_1.validate)(btcAddress, btcValidationNetwork)) {
        throw new Error(`Invalid Bitcoin address for ${netLabel}: ${btcAddress}`);
    }
    const btcNet = network === 'testnet' ? sbtc_1.TESTNET : sbtc_1.MAINNET;
    const script = (0, btc_signer_1.Address)(btcNet).decode(btcAddress);
    switch (script.type) {
        case 'pkh':
            return {
                version: transactions_1.Cl.bufferFromHex('00'),
                hashbytes: transactions_1.Cl.buffer(script.hash),
            };
        case 'sh':
            return {
                version: transactions_1.Cl.bufferFromHex('01'),
                hashbytes: transactions_1.Cl.buffer(script.hash),
            };
        case 'wpkh':
            return {
                version: transactions_1.Cl.bufferFromHex('04'),
                hashbytes: transactions_1.Cl.buffer(script.hash),
            };
        case 'wsh':
            return {
                version: transactions_1.Cl.bufferFromHex('05'),
                hashbytes: transactions_1.Cl.buffer(script.hash),
            };
        case 'tr':
            return {
                version: transactions_1.Cl.bufferFromHex('06'),
                hashbytes: transactions_1.Cl.buffer(script.pubkey),
            };
        default:
            throw new Error(`Unsupported Bitcoin address type for sBTC peg-out: ${script.type}`);
    }
}
