type StacksParams = Record<string, unknown> & {
    network?: string;
    senderKey?: string;
};
/**
 * Call an agent-core handler after injecting extension defaults:
 * - `network` from `defaultNetwork` when omitted
 * - `senderKey` from config when omitted (write tools)
 */
export declare function runStacksTool<TResult>(handler: (params: any) => Promise<TResult> | TResult, input: StacksParams, options?: {
    requireSenderKey?: boolean;
}): Promise<TResult>;
export {};
