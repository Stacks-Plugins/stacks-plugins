import { formatSbtcAmount } from '@sugarhi11/agent-core';

export const BROADCAST_RESULT_TOOLS = new Set([
  'stacks_send_tokens',
  'stacks_send_sbtc',
  'stacks_sbtc_initiate_peg_out',
  'stacks_stack',
  'stacks_delegate_stx',
  'stacks_revoke_delegate',
  'stacks_transfer_name',
  'stacks_contract_call',
  'stacks_swap_execute',
  'stacks_bridge_initiate',
  'stacks_zest_supply_sbtc',
  'stacks_zest_redeem_sbtc',
  'stacks_zest_collateral_add_sbtc',
  'stacks_zest_borrow',
  'stacks_zest_repay',
]);

export function formatBroadcastResult(
  result: unknown,
  network: 'mainnet' | 'testnet',
  label = 'Transaction'
): string {
  if (!result || typeof result !== 'object') {
    return String(result);
  }
  const r = result as { success?: boolean; txid?: string; error?: string; reason?: string };
  if (r.success && r.txid) {
    const id = r.txid.startsWith('0x') ? r.txid.slice(2) : r.txid;
    const explorer =
      network === 'mainnet'
        ? `https://explorer.hiro.so/txid/${id}`
        : `https://explorer.hiro.so/txid/${id}?chain=testnet`;
    return `${label} submitted successfully.\nTxID: ${r.txid}\nExplorer: ${explorer}`;
  }
  return `${label} failed: ${r.error ?? 'unknown'}${r.reason ? ` (${r.reason})` : ''}`;
}

export function formatSbtcBalanceResult(result: unknown): string {
  if (!result || typeof result !== 'object') {
    return String(result);
  }
  const b = result as { address?: string; network?: string; sbtc?: string };
  return [
    `sBTC balance for ${b.address} (${b.network})`,
    `${formatSbtcAmount(b.sbtc ?? '0')} (${b.sbtc ?? '0'} base units)`,
  ].join('\n');
}
