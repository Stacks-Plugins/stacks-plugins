import type { TSchema } from 'typebox';
import { formatAccountHistory } from './formatters.js';
import { normalizeSendParams, requireSendParams } from './params.js';
import {
  formatMicroStx,
  getStacksSenderKey,
  getStacksWalletConfig,
  parseStxAmount,
  resolveStacksAddress,
} from './wallet.js';

export type ToolHandler = (params: any) => Promise<any> | any;

export interface ToolSpec {
  name: string;
  label?: string;
  description: string;
  parameters: TSchema;
  handler: ToolHandler;
  /** Mark write tools that require signing (senderKey injected from env). */
  signed?: boolean;
  /** Convert `amount` from STX to microSTX before calling the handler. */
  parseAmount?: boolean;
  /** OpenClaw optional tool registration (write tools). */
  optional?: boolean;
  formatResult?: (result: unknown, params: Record<string, unknown>) => string;
}

export interface ToolRuntimeContext {
  pluginConfig?: { defaultNetwork?: string };
}

function needsAddressResolution(name: string): boolean {
  return (
    name.includes('balance') ||
    name.includes('history') ||
    name.includes('stacking_status') ||
    name === 'stacks_lookup_address' ||
    name === 'stacks_can_stack'
  );
}

function requiresAddress(name: string): boolean {
  return name.includes('balance') || name.includes('history');
}

export function enrichParams(
  spec: ToolSpec,
  params: Record<string, unknown>,
  ctx: ToolRuntimeContext
): Record<string, unknown> {
  const wallet = getStacksWalletConfig(ctx.pluginConfig);
  let enriched =
    spec.name === 'stacks_send_tokens' ? normalizeSendParams(params) : { ...params };

  if (!enriched.network) {
    enriched.network = wallet.network;
  }

  if ('address' in enriched || needsAddressResolution(spec.name)) {
    const resolved = resolveStacksAddress(enriched.address as string | undefined, ctx.pluginConfig);
    if (resolved) {
      enriched.address = resolved;
    } else if (requiresAddress(spec.name)) {
      throw new Error(
        'No wallet address configured. Set STACKS_SENDER_KEY or STACKS_WALLET_ADDRESS in .env.'
      );
    }
  }

  if (spec.signed) {
    const senderKey = getStacksSenderKey();
    if (!enriched.senderKey && senderKey) {
      enriched.senderKey = senderKey;
    }
    if (!enriched.senderKey) {
      throw new Error(
        'No signing key configured. Set STACKS_SENDER_KEY in .env for sends and other write actions.'
      );
    }
  }

  if (spec.parseAmount && enriched.amount != null) {
    const micro = parseStxAmount(enriched.amount as string | number);
    if (!micro) {
      throw new Error(`Could not parse STX amount: ${enriched.amount}`);
    }
    enriched.amount = micro;
  }

  if (spec.name === 'stacks_send_tokens') {
    requireSendParams(enriched);
    if (!spec.parseAmount && enriched.amount != null) {
      const micro = parseStxAmount(enriched.amount as string | number);
      if (micro) enriched.amount = micro;
    }
  }

  return enriched;
}

function defaultFormatResult(spec: ToolSpec, result: unknown): string {
  if (spec.name === 'stacks_get_balance' && result && typeof result === 'object') {
    const b = result as {
      address?: string;
      network?: string;
      stx?: string;
      locked?: string;
      fungibleTokens?: Record<string, { balance: string }>;
    };
    const lines = [
      `Balance for ${b.address} (${b.network})`,
      `Spendable: ${formatMicroStx(b.stx ?? '0')}`,
      `Locked (stacking): ${formatMicroStx(b.locked ?? '0')}`,
    ];
    const tokens = Object.entries(b.fungibleTokens ?? {});
    if (tokens.length > 0) {
      lines.push('', 'Fungible tokens:');
      for (const [id, { balance }] of tokens.slice(0, 5)) {
        lines.push(`  ${id}: ${balance}`);
      }
    }
    return lines.join('\n');
  }

  if (spec.name === 'stacks_send_tokens' && result && typeof result === 'object') {
    const r = result as { success?: boolean; txid?: string; error?: string; reason?: string };
    if (r.success && r.txid) {
      const net = getStacksWalletConfig().network;
      const id = r.txid.startsWith('0x') ? r.txid.slice(2) : r.txid;
      const explorer =
        net === 'mainnet'
          ? `https://explorer.hiro.so/txid/${id}`
          : `https://explorer.hiro.so/txid/${id}?chain=testnet`;
      return `Transfer submitted successfully.\nTxID: ${r.txid}\nExplorer: ${explorer}`;
    }
    return `Transfer failed: ${r.error ?? 'unknown'}${r.reason ? ` (${r.reason})` : ''}`;
  }

  if (spec.name === 'stacks_get_account_history' && result && typeof result === 'object') {
    return formatAccountHistory(result as Parameters<typeof formatAccountHistory>[0]);
  }

  return typeof result === 'string' ? result : JSON.stringify(result, null, 2);
}

export function executeTool(
  spec: ToolSpec,
  rawParams: Record<string, unknown>,
  ctx: ToolRuntimeContext
): Promise<{ text: string; isError: boolean }> {
  return (async () => {
    try {
      const params = enrichParams(spec, rawParams, ctx);
      const result = await spec.handler(params);
      const text = spec.formatResult
        ? spec.formatResult(result, params)
        : defaultFormatResult(spec, result);
      return { text, isError: false };
    } catch (error: any) {
      return {
        text: `Stacks tool ${spec.name} failed: ${error?.message ?? String(error)}`,
        isError: true,
      };
    }
  })();
}

