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
  BROADCAST_RESULT_TOOLS,
  formatBroadcastResult,
  formatSbtcBalanceResult,
} from './broadcastFormat';
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

  const needsAddress =
    'address' in enriched ||
    spec.name.includes('balance') ||
    spec.name.includes('history') ||
    spec.name.includes('stacking_status') ||
    spec.name === 'stacks_zest_position';

  if (needsAddress) {
    const resolved = resolveStacksAddress(enriched.address as string | undefined);
    if (resolved) {
      enriched.address = resolved;
    } else if (
      spec.name.includes('balance') ||
      spec.name.includes('history') ||
      spec.name === 'stacks_sbtc_get_balance' ||
      spec.name === 'stacks_zest_position'
    ) {
      throw new Error(
        'No wallet address configured. Set STACKS_SENDER_KEY or STACKS_WALLET_ADDRESS in .env.'
      );
    }
  }

  if (
    'stacksAddress' in enriched ||
    spec.name.includes('sbtc_build_peg') ||
    spec.name.includes('sbtc_initiate_peg_in') ||
    spec.name.includes('sbtc_get_peg_status')
  ) {
    const resolved = resolveStacksAddress(enriched.stacksAddress as string | undefined);
    if (resolved) {
      enriched.stacksAddress = resolved;
    } else if (
      spec.name.includes('sbtc_build_peg') ||
      spec.name.includes('sbtc_initiate_peg_in')
    ) {
      const fallback = resolveStacksAddress(undefined);
      if (fallback) {
        enriched.stacksAddress = fallback;
      } else if (spec.name.includes('sbtc_build_peg')) {
        throw new Error(
          'stacksAddress is required. Set STACKS_SENDER_KEY or pass stacksAddress explicitly.'
        );
      }
    }
  }

  if (spec.name === 'stacks_sbtc_initiate_peg_in' && !enriched.senderKey && wallet.hasSenderKey) {
    enriched.senderKey = process.env.STACKS_SENDER_KEY;
  }

  if (spec.name === 'stacks_send_sbtc') {
    const walletAddr = wallet.address;
    const recipient = resolveStacksAddress(enriched.recipient as string | undefined);
    if (recipient) {
      enriched.recipient = recipient;
    }
    if (walletAddr && recipient === walletAddr) {
      throw new Error(
        'Recipient cannot equal sender: sBTC self-transfers fail post-conditions (SentEq 0). Use a different Stacks address.'
      );
    }
    if (!enriched.recipient) {
      throw new Error('recipient is required for stacks_send_sbtc.');
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
    return formatBroadcastResult(result, getStacksWalletConfig().network, 'STX transfer');
  }

  if (spec.name === 'stacks_sbtc_get_balance' && result && typeof result === 'object') {
    return formatSbtcBalanceResult(result);
  }

  if (BROADCAST_RESULT_TOOLS.has(spec.name) && result && typeof result === 'object') {
    const label =
      spec.name === 'stacks_send_sbtc'
        ? 'sBTC transfer'
        : spec.name.startsWith('stacks_zest_')
          ? 'Zest transaction'
          : 'Transaction';
    return formatBroadcastResult(result, getStacksWalletConfig().network, label);
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
