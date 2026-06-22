import type {
  Action,
  ActionResult,
  HandlerCallback,
  IAgentRuntime,
  Memory,
  State,
} from '@elizaos/core';
import {
  formatMicroStx,
  getStacksWalletConfig,
  parseStxAmount,
  resolveStacksAddress,
} from './wallet';
import { formatAccountHistory } from './formatters';
import {
  normalizeSendParams,
  requireSendParams,
  resolveParamsFromMessage,
} from './params';

export type ToolHandler = (params: any) => Promise<any> | any;

export interface ToolActionSpec {
  /** Tool id from @sugarhi11/agent-core, e.g. `stacks_get_balance`. */
  name: string;
  /** Natural-language description shown to the model. */
  description: string;
  /** Example phrasings that should trigger this action. */
  similes?: string[];
  /** The agent-core handler that performs the work. */
  handler: ToolHandler;
  /** Example conversations for the action. */
  examples?: any[];
  /** Auto-inject STACKS_SENDER_KEY from env when omitted. */
  signed?: boolean;
  /** Convert `amount` from STX to microSTX before calling the handler. */
  parseAmount?: boolean;
  /** Format handler output for chat (defaults to JSON or custom per action). */
  formatResult?: (result: unknown, params: Record<string, unknown>) => string;
}

function resolveParams(
  message: Memory,
  options?: Record<string, unknown>,
  responses?: Memory[]
): Record<string, unknown> {
  return resolveParamsFromMessage(message, options, responses);
}

function enrichParams(
  spec: ToolActionSpec,
  params: Record<string, unknown>
): Record<string, unknown> {
  const wallet = getStacksWalletConfig();
  let enriched =
    spec.name === 'stacks_send_tokens' ? normalizeSendParams(params) : { ...params };

  if (!enriched.network) {
    enriched.network = wallet.network;
  }

  if ('address' in enriched || spec.name.includes('balance') || spec.name.includes('history') || spec.name.includes('stacking_status')) {
    const resolved = resolveStacksAddress(enriched.address as string | undefined);
    if (resolved) {
      enriched.address = resolved;
    } else if (spec.name.includes('balance') || spec.name.includes('history')) {
      throw new Error(
        'No wallet address configured. Set STACKS_SENDER_KEY or STACKS_WALLET_ADDRESS in .env.'
      );
    }
  }

  if (spec.signed) {
    if (!enriched.senderKey && wallet.hasSenderKey) {
      enriched.senderKey = process.env.STACKS_SENDER_KEY;
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

function defaultFormatResult(spec: ToolActionSpec, result: unknown): string {
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

export function makeAction(spec: ToolActionSpec): Action {
  return {
    name: spec.name.toUpperCase(),
    similes: spec.similes ?? [],
    description: spec.description,
    validate: async (_runtime: IAgentRuntime, _message: Memory) => true,
    handler: async (
      _runtime: IAgentRuntime,
      message: Memory,
      _state?: State,
      options?: Record<string, unknown>,
      callback?: HandlerCallback,
      responses?: Memory[]
    ): Promise<ActionResult> => {
      try {
        const raw = resolveParams(message, options, responses);
        const params = enrichParams(spec, raw);
        const result = await spec.handler(params);
        const text = spec.formatResult
          ? spec.formatResult(result, params)
          : defaultFormatResult(spec, result);

        if (callback) {
          await callback({ text, content: { success: true, result } });
        }
        return {
          success: true,
          text,
          data: { actionName: spec.name, result },
        };
      } catch (error: any) {
        const text = `Stacks tool ${spec.name} failed: ${error?.message ?? String(error)}`;
        if (callback) {
          await callback({ text, content: { success: false, error: text } });
        }
        return {
          success: false,
          text,
          error: error instanceof Error ? error : new Error(String(error)),
          data: { actionName: spec.name, error: text },
        };
      }
    },
    examples: spec.examples ?? [],
  };
}
