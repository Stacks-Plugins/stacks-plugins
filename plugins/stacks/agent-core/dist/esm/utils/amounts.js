/** 1 sBTC = 100_000_000 base units (8 decimals, satoshi-equivalent). */
export const SBTC_BASE = 100000000n;
/** Parse human sBTC/BTC amounts ("0.001", "1000 sats", raw integer) to base units. */
export function parseSbtcAmount(raw) {
    if (typeof raw === 'number') {
        if (!Number.isFinite(raw))
            throw new Error(`Invalid sBTC amount: ${raw}`);
        if (Number.isInteger(raw) && raw > 1000000)
            return BigInt(raw);
        return BigInt(Math.round(raw * Number(SBTC_BASE)));
    }
    const trimmed = String(raw).trim().toLowerCase();
    if (!trimmed)
        throw new Error('Empty sBTC amount');
    if (/^\d+$/.test(trimmed))
        return BigInt(trimmed);
    const satsMatch = trimmed.match(/^([\d.]+)\s*sats?$/);
    if (satsMatch)
        return BigInt(Math.round(Number(satsMatch[1])));
    const btcMatch = trimmed.match(/^([\d.]+)\s*(sbtc|btc)?$/);
    if (btcMatch) {
        return BigInt(Math.round(Number(btcMatch[1]) * Number(SBTC_BASE)));
    }
    throw new Error(`Could not parse sBTC amount: ${raw}`);
}
export function formatSbtcAmount(baseUnits) {
    const n = typeof baseUnits === 'bigint' ? baseUnits : BigInt(baseUnits);
    const whole = n / SBTC_BASE;
    const frac = n % SBTC_BASE;
    if (frac === 0n)
        return `${whole} sBTC`;
    const fracStr = frac.toString().padStart(8, '0').replace(/0+$/, '');
    return `${whole}.${fracStr} sBTC`;
}
