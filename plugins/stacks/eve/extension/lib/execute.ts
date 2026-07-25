import extension from "../extension";

type StacksParams = Record<string, unknown> & {
  network?: string;
  senderKey?: string;
};

/**
 * Call an agent-core handler after injecting extension defaults:
 * - `network` from `defaultNetwork` when omitted
 * - `senderKey` from config when omitted (write tools)
 */
export async function runStacksTool<TResult>(
  handler: (params: any) => Promise<TResult> | TResult,
  input: StacksParams,
  options?: { requireSenderKey?: boolean }
): Promise<TResult> {
  const { defaultNetwork, senderKey: configSenderKey } = extension.config;
  const params: StacksParams = {
    ...input,
    network: input.network ?? defaultNetwork,
  };

  if (options?.requireSenderKey) {
    const senderKey = params.senderKey ?? configSenderKey;
    if (!senderKey) {
      throw new Error(
        "senderKey is required for this write tool. Pass it in the tool input or set senderKey in the extension mount config (e.g. process.env.STACKS_SENDER_KEY)."
      );
    }
    params.senderKey = senderKey;
  }

  return handler(params);
}
