import { formatMicroStx } from './wallet.js';

type Network = 'mainnet' | 'testnet';

function explorerTxUrl(txid: string, network: Network): string {
  const id = txid.startsWith('0x') ? txid.slice(2) : txid;
  const base = `https://explorer.hiro.so/txid/${id}`;
  return network === 'testnet' ? `${base}?chain=testnet` : base;
}

function decodeMemo(memoHex?: string): string | undefined {
  if (!memoHex?.startsWith('0x')) return undefined;
  try {
    const hex = memoHex.slice(2).replace(/00+$/g, '');
    if (!hex) return undefined;
    const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
    const text = new TextDecoder().decode(bytes).trim();
    return text || undefined;
  } catch {
    return undefined;
  }
}

function describeTransaction(tx: any): string[] {
  const t = tx?.tx ?? tx;
  const lines: string[] = [];
  const type = t?.tx_type ?? 'unknown';
  lines.push(`Type: ${type}`);
  lines.push(`Status: ${t?.tx_status ?? 'unknown'}`);

  if (t?.block_time_iso) {
    lines.push(`Time: ${t.block_time_iso}`);
  }

  if (type === 'token_transfer' && t?.token_transfer) {
    const tt = t.token_transfer;
    lines.push(`To: ${tt.recipient_address}`);
    lines.push(`Amount: ${formatMicroStx(tt.amount ?? '0')}`);
    const memo = decodeMemo(tt.memo);
    if (memo) lines.push(`Memo: ${memo}`);
  }

  if (type === 'contract_call' && t?.contract_call) {
    const cc = t.contract_call;
    lines.push(`Contract: ${cc.contract_id}`);
    lines.push(`Function: ${cc.function_name}`);
  }

  if (tx?.stx_sent && tx.stx_sent !== '0') {
    lines.push(`STX sent (incl. fee): ${formatMicroStx(tx.stx_sent)}`);
  }
  if (tx?.stx_received && tx.stx_received !== '0') {
    lines.push(`STX received: ${formatMicroStx(tx.stx_received)}`);
  }

  return lines;
}

export function formatAccountHistory(result: {
  address?: string;
  network?: Network;
  total?: number;
  limit?: number;
  offset?: number;
  transactions?: unknown[];
}): string {
  const network = (result.network ?? 'testnet') as Network;
  const txs = result.transactions ?? [];
  const lines = [
    `Transaction history for ${result.address} (${network})`,
    `Showing ${txs.length} of ${result.total ?? txs.length} total`,
    '',
  ];

  if (txs.length === 0) {
    lines.push('No transactions found.');
    return lines.join('\n');
  }

  txs.forEach((raw, index) => {
    const t = (raw as any)?.tx ?? raw;
    const txid = t?.tx_id ?? 'unknown';
    const explorer = txid !== 'unknown' ? explorerTxUrl(txid, network) : '';

    lines.push(`${index + 1}. TxID: ${txid}`);
    lines.push(...describeTransaction(raw as any).map((l) => `   ${l}`));
    if (explorer) lines.push(`   Explorer: ${explorer}`);
    lines.push('');
  });

  lines.push('Use only these TxIDs — do not invent or modify transaction data.');

  return lines.join('\n');
}
