import { privateKeyToAddress } from '@stacks/transactions';

export interface StacksWalletConfig {
  network: 'mainnet' | 'testnet';
  address?: string;
  hasSenderKey: boolean;
}

const MY_ADDRESS_ALIASES = new Set([
  'my',
  'me',
  'mine',
  'my wallet',
  'my address',
  'my account',
  'configured wallet',
  'agent wallet',
]);

export function getStacksWalletConfig(): StacksWalletConfig {
  const network = (process.env.STACKS_NETWORK?.trim() || 'testnet') as 'mainnet' | 'testnet';
  const senderKey = process.env.STACKS_SENDER_KEY?.trim();
  let address = process.env.STACKS_WALLET_ADDRESS?.trim();

  if (senderKey) {
    try {
      address = privateKeyToAddress(senderKey, network);
    } catch {
      if (!address) {
        address = undefined;
      }
    }
  }

  return { network, address, hasSenderKey: Boolean(senderKey) };
}

export function resolveStacksAddress(address?: string): string | undefined {
  if (!address?.trim()) return getStacksWalletConfig().address;
  const normalized = address.trim().toLowerCase();
  if (MY_ADDRESS_ALIASES.has(normalized)) {
    return getStacksWalletConfig().address;
  }
  return address.trim();
}

/** Convert human STX amounts (e.g. "1", "0.5 STX") to microSTX strings. */
export function parseStxAmount(amount: string | number | undefined): string | undefined {
  if (amount == null || amount === '') return undefined;

  if (typeof amount === 'number') {
    if (!Number.isFinite(amount)) return undefined;
    if (Number.isInteger(amount) && amount >= 1_000_000) {
      return String(amount);
    }
    return String(Math.round(amount * 1_000_000));
  }

  const raw = amount.trim().toLowerCase().replace(/,/g, '').replace(/\s*stx\s*/g, '');
  if (!raw) return undefined;

  if (/^\d+$/.test(raw) && raw.length >= 7) {
    return raw;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return undefined;

  if (Number.isInteger(parsed) && parsed >= 1_000_000) {
    return String(parsed);
  }

  return String(Math.round(parsed * 1_000_000));
}

export function formatMicroStx(microStx: string | number): string {
  const micro = typeof microStx === 'string' ? Number(microStx) : microStx;
  if (!Number.isFinite(micro)) return String(microStx);
  const stx = micro / 1_000_000;
  return `${stx.toLocaleString(undefined, { maximumFractionDigits: 6 })} STX (${micro} microSTX)`;
}
