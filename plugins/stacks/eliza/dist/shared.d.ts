import type { Action } from '@elizaos/core';
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
 * Convert a single @stacks/agent-core tool into an ElizaOS {@link Action}.
 * This keeps every adapter a thin shim over the shared implementation.
 */
export declare function makeAction(spec: ToolActionSpec): Action;
