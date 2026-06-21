import type {
  Action,
  HandlerCallback,
  IAgentRuntime,
  Memory,
  State,
} from '@elizaos/core';

export type ToolHandler = (params: any) => Promise<any> | any;

export interface ToolActionSpec {
  /** Tool id from @stacks/agent-core, e.g. `stacks_get_balance`. */
  name: string;
  /** Natural-language description shown to the model. */
  description: string;
  /** Example phrasings that should trigger this action. */
  similes?: string[];
  /** The agent-core handler that performs the work. */
  handler: ToolHandler;
  /** Example conversations for the action. */
  examples?: any[];
}

/**
 * Resolve tool parameters for a call. ElizaOS passes structured arguments via the
 * `options` bag when the model fills a tool; we fall back to the raw message
 * content so the action also works when invoked programmatically.
 */
function resolveParams(message: Memory, options?: Record<string, unknown>): any {
  if (options && Object.keys(options).length > 0) return options;
  const content: any = message?.content ?? {};
  // Allow a nested `params` object or the content itself.
  return content.params ?? content;
}

/**
 * Convert a single @stacks/agent-core tool into an ElizaOS {@link Action}.
 * This keeps every adapter a thin shim over the shared implementation.
 */
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
      callback?: HandlerCallback
    ) => {
      try {
        const params = resolveParams(message, options);
        const result = await spec.handler(params);
        const text =
          typeof result === 'string' ? result : JSON.stringify(result, null, 2);
        if (callback) {
          await callback({ text, content: { success: true, result } });
        }
        return true;
      } catch (error: any) {
        const text = `Stacks tool ${spec.name} failed: ${error?.message ?? String(error)}`;
        if (callback) {
          await callback({ text, content: { success: false, error: text } });
        }
        return false;
      }
    },
    examples: spec.examples ?? [],
  };
}
