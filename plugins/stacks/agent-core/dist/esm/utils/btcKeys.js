import { hexToBytes, bytesToHex } from '@stacks/common';
import { sha256 } from '@noble/hashes/sha256';
import { base58check as createBase58check } from '@scure/base';
import { pubSchnorr, NETWORK, TEST_NETWORK } from '@scure/btc-signer/utils';
import { WIF } from '@scure/btc-signer/payment';
const bs58check = createBase58check(sha256);
function decodePrivateKey(raw) {
    const trimmed = raw.trim();
    if (/^(0x)?[0-9a-fA-F]{64}$/.test(trimmed)) {
        return hexToBytes(trimmed.replace(/^0x/, ''));
    }
    if (/^[5KL9c][1-9A-HJ-NP-Za-km-z]{50,51}$/.test(trimmed)) {
        for (const network of [NETWORK, TEST_NETWORK]) {
            try {
                return WIF(network).decode(trimmed);
            }
            catch {
                // try other network prefix
            }
        }
        const decoded = bs58check.decode(trimmed);
        if (decoded.length === 34 && decoded[33] === 0x01) {
            return decoded.slice(1, 33);
        }
        if (decoded.length === 33) {
            return decoded.slice(1);
        }
    }
    throw new Error('BITCOIN_PRIVATE_KEY must be a 32-byte hex string or WIF-encoded private key.');
}
export function getBitcoinPrivateKey() {
    const key = process.env.BITCOIN_PRIVATE_KEY?.trim();
    if (!key) {
        throw new Error('BITCOIN_PRIVATE_KEY is required for Bitcoin peg-in. Set it in the environment.');
    }
    return key;
}
export function getBitcoinAddress() {
    const address = process.env.BITCOIN_ADDRESS?.trim();
    if (!address) {
        throw new Error('BITCOIN_ADDRESS is required for Bitcoin peg-in. Set it in the environment.');
    }
    return address;
}
/** Compressed secp256k1 public key hex (no prefix) for sBTC reclaim scripts. */
export function bitcoinReclaimPublicKeyHex(privateKey) {
    const key = decodePrivateKey(privateKey ?? getBitcoinPrivateKey());
    const pub = pubSchnorr(key);
    return bytesToHex(pub);
}
export function bitcoinPrivateKeyBytes(privateKey) {
    return decodePrivateKey(privateKey ?? getBitcoinPrivateKey());
}
