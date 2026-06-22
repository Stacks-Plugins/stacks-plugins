import { parseStxAmount } from './wallet';

/** Stacks c32 address charset (excludes I, L, O, U). */
const C32_CHARS = '123456789ABCDEFGHJKMNPQRSTVWXYZ';
const STACKS_ADDRESS_RE = new RegExp(`\\b(S[TP][${C32_CHARS}]{20,50})\\b`, 'gi');

const AMOUNT_WITH_UNIT_RE = /\b(\d+(?:\.\d+)?)\s*stx\b/i;
const SEND_AMOUNT_RE = /\b(?:send|transfer|pay)\s+(\d+(?:\.\d+)?)\b/i;

export function extractStacksAddress(text: string): string | undefined {
  if (!text) return undefined;
  const matches = [...text.matchAll(STACKS_ADDRESS_RE)].map((m) => m[1].toUpperCase());
  if (matches.length === 0) return undefined;
  // Prefer the last address in the message (usually the recipient after "to").
  return matches[matches.length - 1];
}

export function extractStxAmount(text: string): string | number | undefined {
  if (!text) return undefined;
  const withUnit = text.match(AMOUNT_WITH_UNIT_RE);
  if (withUnit) return withUnit[1];
  const sendPattern = text.match(SEND_AMOUNT_RE);
  if (sendPattern) return sendPattern[1];
  return undefined;
}

const IGNORE_OPTION_KEYS = new Set([
  'actionContext',
  'actionPlan',
  'onStreamChunk',
]);

export function pickActionParams(options?: Record<string, unknown>): Record<string, unknown> {
  if (!options) return {};
  const params: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(options)) {
    if (IGNORE_OPTION_KEYS.has(key)) continue;
    if (value !== undefined && value !== null && value !== '') {
      params[key] = value;
    }
  }
  return params;
}

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

export function resolveParamsFromMessage(
  message: { content?: { text?: string; params?: unknown } },
  options?: Record<string, unknown>,
  responses?: Array<{ content?: { text?: string } }>
): Record<string, unknown> {
  const params = pickActionParams(options);

  const content = message?.content ?? {};
  if (content.params && typeof content.params === 'object') {
    Object.assign(params, content.params as Record<string, unknown>);
  }

  const texts = [content.text ?? ''];
  for (const r of responses ?? []) {
    if (r.content?.text) texts.push(r.content.text);
  }

  for (const text of texts) {
    if (!params.recipient) {
      const address = extractStacksAddress(text);
      if (address) params.recipient = address;
    }
    if (params.amount == null) {
      const amount = extractStxAmount(text);
      if (amount != null) params.amount = amount;
    }
  }

  return params;
}

export function requireSendParams(params: Record<string, unknown>): void {
  if (!params.recipient || typeof params.recipient !== 'string') {
    throw new Error(
      'Missing recipient address. Say e.g. "send 1 STX to ST2…" with a valid Stacks address.'
    );
  }
  if (params.amount == null) {
    throw new Error('Missing amount. Say e.g. "send 1 STX to ST2…".');
  }
  const micro = parseStxAmount(params.amount as string | number);
  if (!micro) {
    throw new Error(`Could not parse STX amount: ${params.amount}`);
  }
}
