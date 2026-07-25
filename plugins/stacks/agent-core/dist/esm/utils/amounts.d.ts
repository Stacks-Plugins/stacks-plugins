/** 1 sBTC = 100_000_000 base units (8 decimals, satoshi-equivalent). */
export declare const SBTC_BASE = 100000000n;
/** Parse human sBTC/BTC amounts ("0.001", "1000 sats", raw integer) to base units. */
export declare function parseSbtcAmount(raw: string | number): bigint;
export declare function formatSbtcAmount(baseUnits: bigint | string | number): string;
