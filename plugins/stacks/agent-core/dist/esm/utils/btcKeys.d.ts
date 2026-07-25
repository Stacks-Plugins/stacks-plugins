export declare function getBitcoinPrivateKey(): string;
export declare function getBitcoinAddress(): string;
/** Compressed secp256k1 public key hex (no prefix) for sBTC reclaim scripts. */
export declare function bitcoinReclaimPublicKeyHex(privateKey?: string): string;
export declare function bitcoinPrivateKeyBytes(privateKey?: string): Uint8Array;
