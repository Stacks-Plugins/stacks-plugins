import type { Action } from '@elizaos/core';
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
export declare function makeAction(spec: ToolActionSpec): Action;
