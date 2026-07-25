"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBitcoinPrivateKey = getBitcoinPrivateKey;
exports.getBitcoinAddress = getBitcoinAddress;
exports.bitcoinReclaimPublicKeyHex = bitcoinReclaimPublicKeyHex;
exports.bitcoinPrivateKeyBytes = bitcoinPrivateKeyBytes;
const common_1 = require("@stacks/common");
const sha256_1 = require("@noble/hashes/sha256");
const base_1 = require("@scure/base");
const utils_1 = require("@scure/btc-signer/utils");
const payment_1 = require("@scure/btc-signer/payment");
const bs58check = (0, base_1.base58check)(sha256_1.sha256);
function decodePrivateKey(raw) {
    const trimmed = raw.trim();
    if (/^(0x)?[0-9a-fA-F]{64}$/.test(trimmed)) {
        return (0, common_1.hexToBytes)(trimmed.replace(/^0x/, ''));
    }
    if (/^[5KL9c][1-9A-HJ-NP-Za-km-z]{50,51}$/.test(trimmed)) {
        for (const network of [utils_1.NETWORK, utils_1.TEST_NETWORK]) {
            try {
                return (0, payment_1.WIF)(network).decode(trimmed);
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
function getBitcoinPrivateKey() {
    const key = process.env.BITCOIN_PRIVATE_KEY?.trim();
    if (!key) {
        throw new Error('BITCOIN_PRIVATE_KEY is required for Bitcoin peg-in. Set it in the environment.');
    }
    return key;
}
function getBitcoinAddress() {
    const address = process.env.BITCOIN_ADDRESS?.trim();
    if (!address) {
        throw new Error('BITCOIN_ADDRESS is required for Bitcoin peg-in. Set it in the environment.');
    }
    return address;
}
/** Compressed secp256k1 public key hex (no prefix) for sBTC reclaim scripts. */
function bitcoinReclaimPublicKeyHex(privateKey) {
    const key = decodePrivateKey(privateKey ?? getBitcoinPrivateKey());
    const pub = (0, utils_1.pubSchnorr)(key);
    return (0, common_1.bytesToHex)(pub);
}
function bitcoinPrivateKeyBytes(privateKey) {
    return decodePrivateKey(privateKey ?? getBitcoinPrivateKey());
}
