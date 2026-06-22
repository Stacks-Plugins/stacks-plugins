import { parseStxAmount } from './wallet.js';

export function normalizeSendParams(params: Record<string, unknown>): Record<string, unknown> {
  const out = { ...params };

  if (!out.recipient) {
    out.recipient =
      out.to ?? out.toAddress ?? out.recipientAddress ?? out.destination;
  }

  if (out.amount == null) {
    out.amount = out.stxAmount ?? out.stx ?? out.value ?? out.quantity;
  }

  if (typeof out.amount === 'object' && out.amount != null) {
    const nested = out.amount as Record<string, unknown>;
    out.amount = nested.amount ?? nested.value ?? nested.stx;
  }

  for (const key of ['fee', 'nonce'] as const) {
    if (out[key] === '' || out[key] === null || out[key] === undefined) {
      delete out[key];
    }
  }

  delete out.to;
  delete out.toAddress;
  delete out.recipientAddress;
  delete out.destination;
  delete out.stxAmount;
  delete out.stx;
  delete out.value;
  delete out.quantity;

  return out;
}

export function requireSendParams(params: Record<string, unknown>): void {
  if (!params.recipient || typeof params.recipient !== 'string') {
    throw new Error(
      'Missing recipient address. Provide `recipient` with a valid Stacks address.'
    );
  }
  if (params.amount == null) {
    throw new Error('Missing amount. Provide `amount` in STX or microSTX.');
  }
  const micro = parseStxAmount(params.amount as string | number);
  if (!micro) {
    throw new Error(`Could not parse STX amount: ${params.amount}`);
  }
}
