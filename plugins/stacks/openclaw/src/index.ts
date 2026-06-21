import { Type, type TSchema } from '@sinclair/typebox';
import { definePluginEntry } from 'openclaw/plugin-sdk/plugin-entry';
import {
  bridgeInitiate,
  bridgeQuote,
  canStack,
  contractCall,
  decodeCv,
  delegateStx,
  getAccountHistory,
  getBalance,
  getNamePrice,
  getStackingStatus,
  lookupAddress,
  readOnlyCall,
  resolveName,
  revokeDelegate,
  sendTokens,
  stack,
  swapExecute,
  swapQuote,
  transferName,
} from '@stacks/agent-core';

const Network = Type.Optional(
  Type.Union([Type.Literal('mainnet'), Type.Literal('testnet')], {
    description: 'Target network. Defaults to mainnet.',
  })
);

/** Amount fields accept a number or numeric string (microSTX / smallest unit). */
const Amount = Type.Union([Type.String(), Type.Number()]);
const HexArgs = Type.Optional(
  Type.Array(Type.String(), {
    description: 'Clarity function args as hex-encoded serialized ClarityValues.',
  })
);

type ToolHandler = (params: any) => Promise<any> | any;

export default definePluginEntry({
  id: 'stacks',
  name: 'Stacks Plugin',
  description: 'Stacks blockchain tools for OpenClaw agents.',
  register(api: any) {
    const tool = (
      name: string,
      description: string,
      parameters: TSchema,
      handler: ToolHandler,
      optional = false
    ) => {
      api.registerTool(
        {
          name,
          description,
          parameters,
          async execute(_id: string, params: Record<string, unknown>) {
            try {
              const result = await handler(params);
              const text =
                typeof result === 'string' ? result : JSON.stringify(result, null, 2);
              return { content: [{ type: 'text', text }] };
            } catch (error: any) {
              return {
                content: [
                  { type: 'text', text: `Error in ${name}: ${error?.message ?? String(error)}` },
                ],
                isError: true,
              };
            }
          },
        },
        { optional }
      );
    };

    // --- Account ---
    tool(
      'stacks_get_balance',
      'Get STX, fungible, and non-fungible token balances for a Stacks address.',
      Type.Object({ address: Type.String(), network: Network }),
      getBalance
    );
    tool(
      'stacks_send_tokens',
      'Sign and broadcast an STX transfer.',
      Type.Object({
        recipient: Type.String(),
        amount: Amount,
        senderKey: Type.String(),
        memo: Type.Optional(Type.String()),
        fee: Type.Optional(Amount),
        nonce: Type.Optional(Amount),
        network: Network,
      }),
      sendTokens,
      true
    );
    tool(
      'stacks_get_account_history',
      'Get paginated transaction history for a Stacks address.',
      Type.Object({
        address: Type.String(),
        limit: Type.Optional(Type.Number()),
        offset: Type.Optional(Type.Number()),
        network: Network,
      }),
      getAccountHistory
    );

    // --- Stacking / PoX ---
    tool(
      'stacks_stacking_status',
      'Get the current stacking (PoX) lock and delegation status for an address.',
      Type.Object({ address: Type.String(), network: Network }),
      getStackingStatus
    );
    tool(
      'stacks_can_stack',
      'Check whether an address can stack a given amount for a number of cycles.',
      Type.Object({
        address: Type.String(),
        amount: Amount,
        cycles: Type.Number(),
        poxAddress: Type.String(),
        network: Network,
      }),
      canStack
    );
    tool(
      'stacks_stack',
      'Lock STX for stacking (PoX).',
      Type.Object({
        amount: Amount,
        cycles: Type.Number(),
        poxAddress: Type.String(),
        senderKey: Type.String(),
        burnBlockHeight: Type.Optional(Type.Number()),
        fee: Type.Optional(Amount),
        nonce: Type.Optional(Amount),
        network: Network,
      }),
      stack,
      true
    );
    tool(
      'stacks_delegate_stx',
      'Delegate STX to a stacking pool/operator.',
      Type.Object({
        amount: Amount,
        delegateTo: Type.String(),
        senderKey: Type.String(),
        untilBurnBlockHeight: Type.Optional(Type.Number()),
        poxAddress: Type.Optional(Type.String()),
        fee: Type.Optional(Amount),
        nonce: Type.Optional(Amount),
        network: Network,
      }),
      delegateStx,
      true
    );
    tool(
      'stacks_revoke_delegate',
      'Revoke an active stacking delegation.',
      Type.Object({
        senderKey: Type.String(),
        fee: Type.Optional(Amount),
        nonce: Type.Optional(Amount),
        network: Network,
      }),
      revokeDelegate,
      true
    );

    // --- BNS ---
    tool(
      'stacks_resolve_name',
      'Resolve a BNS name to its owner address and zonefile.',
      Type.Object({ name: Type.String(), network: Network }),
      resolveName
    );
    tool(
      'stacks_lookup_address',
      'List all BNS names owned by a Stacks address.',
      Type.Object({ address: Type.String(), network: Network }),
      lookupAddress
    );
    tool(
      'stacks_get_name_price',
      'Get the registration price (microSTX) for a BNS name.',
      Type.Object({ name: Type.String(), network: Network }),
      getNamePrice
    );
    tool(
      'stacks_transfer_name',
      'Transfer ownership of a BNS name to another address.',
      Type.Object({
        name: Type.String(),
        newOwnerAddress: Type.String(),
        senderKey: Type.String(),
        zonefile: Type.Optional(Type.String()),
        network: Network,
      }),
      transferName,
      true
    );

    // --- Contracts ---
    tool(
      'stacks_contract_call',
      'Sign and broadcast a public Clarity contract function call.',
      Type.Object({
        contractAddress: Type.String(),
        contractName: Type.String(),
        functionName: Type.String(),
        functionArgsHex: HexArgs,
        senderKey: Type.String(),
        fee: Type.Optional(Amount),
        nonce: Type.Optional(Amount),
        network: Network,
      }),
      contractCall,
      true
    );
    tool(
      'stacks_read_only_call',
      'Evaluate a read-only Clarity contract function and return decoded JSON.',
      Type.Object({
        contractAddress: Type.String(),
        contractName: Type.String(),
        functionName: Type.String(),
        functionArgsHex: HexArgs,
        senderAddress: Type.Optional(Type.String()),
        network: Network,
      }),
      readOnlyCall
    );
    tool(
      'stacks_decode_cv',
      'Decode a hex-encoded serialized Clarity value into readable JSON.',
      Type.Object({ hex: Type.String() }),
      decodeCv
    );

    // --- Swaps & Bridge ---
    tool(
      'stacks_swap_quote',
      'Get a token swap quote from the ALEX DEX (mainnet).',
      Type.Object({
        tokenFrom: Type.String(),
        tokenTo: Type.String(),
        amount: Amount,
        network: Network,
      }),
      swapQuote
    );
    tool(
      'stacks_swap_execute',
      'Execute a token swap on the ALEX DEX.',
      Type.Object({
        tokenFrom: Type.String(),
        tokenTo: Type.String(),
        amount: Amount,
        minAmountOut: Amount,
        senderKey: Type.String(),
        functionArgsHex: HexArgs,
        functionName: Type.Optional(Type.String()),
        fee: Type.Optional(Amount),
        nonce: Type.Optional(Amount),
        network: Network,
      }),
      swapExecute,
      true
    );
    tool(
      'stacks_bridge_quote',
      'Get a cross-chain bridge quote via Allbridge Core.',
      Type.Object({
        fromChain: Type.String(),
        toChain: Type.String(),
        token: Type.String(),
        amount: Amount,
      }),
      bridgeQuote
    );
    tool(
      'stacks_bridge_initiate',
      'Initiate a cross-chain bridge transfer (guided).',
      Type.Object({
        fromChain: Type.String(),
        toChain: Type.String(),
        token: Type.String(),
        amount: Amount,
        recipient: Type.String(),
        senderKey: Type.String(),
        network: Network,
      }),
      bridgeInitiate,
      true
    );
  },
});
